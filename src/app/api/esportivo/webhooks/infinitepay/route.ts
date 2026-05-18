import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { confirmarPagamento, type WebhookPayload } from '@/lib/infinitepay'
import { sendInscricaoConfirmacao, sendAdminSaleNotification } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// InfinitePay espera resposta rápida com este corpo exato.
const ACK = { success: true, message: null }

export async function POST(req: NextRequest) {
  let payload: WebhookPayload
  try {
    payload = (await req.json()) as WebhookPayload
  } catch {
    // Mesmo com corpo inválido, devolvemos ACK para não gerar reentrega infinita.
    return NextResponse.json(ACK)
  }

  const orderNsu = payload.order_nsu
  if (!orderNsu) return NextResponse.json(ACK)

  try {
    const supabase = getSupabase()

    // 1. order_nsu precisa existir no nosso banco.
    const { data: row } = await supabase
      .from('inscricoes')
      .select(
        'id, status, nome, email, distancia, genero, faixa_etaria, tamanho_camisa, kit, amount_cents',
      )
      .eq('order_nsu', orderNsu)
      .single()

    if (!row) {
      console.error('infinitepay_webhook_unknown_order', orderNsu)
      return NextResponse.json(ACK)
    }
    if (row.status === 'pago') return NextResponse.json(ACK) // idempotente

    // 2. Reconfirma no servidor — nunca confiar só no corpo do webhook.
    const ok = await confirmarPagamento(payload)
    if (!ok) {
      console.error('infinitepay_payment_not_confirmed', orderNsu)
      return NextResponse.json(ACK)
    }

    // 3. Marca como pago e dispara os e-mails.
    await supabase
      .from('inscricoes')
      .update({
        status: 'pago',
        amount_cents: payload.paid_amount ?? payload.amount ?? row.amount_cents,
        payment_method: payload.capture_method ?? 'pix',
        paid_at: new Date().toISOString(),
      })
      .eq('id', row.id)

    await sendInscricaoConfirmacao({
      email: row.email,
      nome: row.nome,
      distancia: row.distancia,
      categoria: `${row.genero} · ${row.faixa_etaria}`,
      tamanhoCamisa: row.tamanho_camisa,
      kit: row.kit,
      amountCents: payload.paid_amount ?? row.amount_cents ?? 0,
    })
    await sendAdminSaleNotification({
      customerEmail: row.email,
      customerName: row.nome,
      amountCents: payload.paid_amount ?? row.amount_cents ?? 0,
      planLabel: `Inscrição ${row.distancia} (${row.kit}) · Pix`,
      isSubscription: false,
    })
  } catch (err) {
    console.error('infinitepay_webhook_error', err)
  }

  return NextResponse.json(ACK)
}
