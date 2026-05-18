import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import { getEnv } from '@/lib/env'
import { InscricaoSchema, totalCents, KITS } from '@/lib/esportivo'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = InscricaoSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos. Confira os campos e tente novamente.' },
      { status: 400 },
    )
  }
  const d = parsed.data
  const amount = totalCents(d.kit)

  let supabase
  try {
    supabase = getSupabase()
  } catch {
    return NextResponse.json(
      { error: 'Inscrições não configuradas no servidor (Supabase ausente).' },
      { status: 503 },
    )
  }

  // 1. Grava a inscrição como PENDENTE antes de cobrar — nenhum lead se perde.
  const { data: row, error: dbErr } = await supabase
    .from('inscricoes')
    .insert({
      nome: d.nome,
      email: d.email,
      telefone: d.telefone,
      cpf: d.cpf,
      data_nascimento: d.data_nascimento,
      genero: d.genero,
      faixa_etaria: d.faixa_etaria,
      distancia: d.distancia,
      tamanho_camisa: d.tamanho_camisa,
      kit: d.kit,
      status: 'pendente',
      amount_cents: amount,
    })
    .select('id')
    .single()

  if (dbErr || !row) {
    console.error('inscricao_insert_error', dbErr)
    return NextResponse.json(
      { error: 'Não foi possível registrar a inscrição. Tente novamente.' },
      { status: 500 },
    )
  }

  const baseUrl =
    getEnv('NEXT_PUBLIC_APP_URL') ??
    req.headers.get('origin') ??
    'http://localhost:3000'

  const kitLabel = KITS.find((k) => k.id === d.kit)?.label ?? 'Básico'

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'pix'],
      customer_email: d.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'brl',
            unit_amount: amount,
            product_data: {
              name: `Inscrição ${d.distancia} — Corrida pela Consciência 2026`,
              description: `Kit ${kitLabel} · Camisa ${d.tamanho_camisa} · ${d.genero}`,
            },
          },
        },
      ],
      success_url: `${baseUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/esportivo/inscricao`,
      metadata: { inscricao_id: row.id, distancia: d.distancia, kit: d.kit },
    })

    await supabase
      .from('inscricoes')
      .update({ stripe_session_id: session.id })
      .eq('id', row.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('esportivo_checkout_error', err)
    await supabase
      .from('inscricoes')
      .update({ status: 'cancelado' })
      .eq('id', row.id)
    return NextResponse.json(
      { error: 'Não foi possível iniciar o pagamento.' },
      { status: 500 },
    )
  }
}
