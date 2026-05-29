import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getEnv } from '@/lib/env'
import { InscricaoSchema, totalCents, KITS } from '@/lib/esportivo'
import { createCheckoutPreference } from '@/lib/mercadopago'

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

  // 1. Grava inscrição como PENDENTE antes de redirecionar — nenhum lead se perde.
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
      provider: 'mercadopago',
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
  const sucessoUrl = `${baseUrl}/esportivo/inscricao/sucesso?ref=${row.id}`

  // 2. Cria preferência no Mercado Pago (aceita cartão e Pix).
  try {
    const preference = await createCheckoutPreference({
      amountCents: amount,
      description: `Inscrição ${d.distancia} — Corrida pela Consciência 2026 · Kit ${kitLabel}`,
      email: d.email,
      nome: d.nome,
      cpf: d.cpf,
      inscricaoId: row.id,
      notificationUrl: `${baseUrl}/api/webhooks/mercadopago`,
      successUrl: `${sucessoUrl}&preference_id={preference_id}`,
      failureUrl: `${baseUrl}/esportivo/inscricao`,
      pendingUrl: sucessoUrl,
    })

    await supabase
      .from('inscricoes')
      .update({ order_nsu: preference.id })
      .eq('id', row.id)

    return NextResponse.json({ url: preference.checkoutUrl })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('mp_checkout_error', msg)
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
