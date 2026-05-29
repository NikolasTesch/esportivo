import { NextRequest, NextResponse } from 'next/server'
import { getMPPayment, getMPMerchantOrder, type MPPayment } from '@/lib/mercadopago'
import { getSupabase } from '@/lib/supabase'
import { sendInscricaoConfirmacao, sendAdminSaleNotification } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Confirma a inscrição quando o pagamento é aprovado.
// Retorna true se a atualização aconteceu (para evitar e-mail duplo).
async function confirmarInscricao(payment: MPPayment): Promise<boolean> {
  if (payment.status !== 'approved' || !payment.externalReference) return false

  const supabase = getSupabase()

  // .eq('status', 'pendente') garante idempotência — se já foi processado, não re-envia e-mail.
  const { data: row, error } = await supabase
    .from('inscricoes')
    .update({
      status: 'pago',
      payment_method: payment.paymentMethod,
      amount_cents: payment.amountCents,
      paid_at: new Date().toISOString(),
    })
    .eq('id', payment.externalReference)
    .eq('provider', 'mercadopago')
    .eq('status', 'pendente')
    .select('nome, email, distancia, genero, faixa_etaria, tamanho_camisa, kit, amount_cents')
    .single()

  if (error || !row) {
    console.warn('mp_confirm_skipped', payment.externalReference, error?.message)
    return false
  }

  const amountCents = row.amount_cents ?? payment.amountCents

  await sendInscricaoConfirmacao({
    email: row.email,
    nome: row.nome,
    distancia: row.distancia,
    categoria: `${row.genero} · ${row.faixa_etaria}`,
    tamanhoCamisa: row.tamanho_camisa,
    kit: row.kit,
    amountCents,
  })
  await sendAdminSaleNotification({
    customerEmail: row.email,
    customerName: row.nome,
    amountCents,
    planLabel: `Inscrição ${row.distancia} (${row.kit})`,
    isSubscription: false,
  })

  return true
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const topic = url.searchParams.get('topic')
  const qId = url.searchParams.get('id')

  try {
    // ── Formato legado: ?topic=payment&id=PAYMENT_ID ──────────────────────
    if (topic === 'payment' && qId) {
      const payment = await getMPPayment(qId)
      await confirmarInscricao(payment)
      return NextResponse.json({ ok: true })
    }

    // ── Formato legado: ?topic=merchant_order&id=ORDER_ID ─────────────────
    // Checkout Pro notifica via merchant_order; localizamos o pagamento aprovado dentro dela.
    if (topic === 'merchant_order' && qId) {
      const order = await getMPMerchantOrder(qId)
      for (const p of order.payments) {
        if (p.status === 'approved') {
          const payment = await getMPPayment(p.id)
          const confirmed = await confirmarInscricao(payment)
          if (confirmed) break // Processa apenas o primeiro aprovado
        }
      }
      return NextResponse.json({ ok: true })
    }

    // ── Novo formato (webhook v2): body JSON ──────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: true })
    }

    if (body?.type === 'payment' && body?.data && typeof body.data === 'object') {
      const dataId = (body.data as Record<string, unknown>).id
      if (dataId) {
        const payment = await getMPPayment(String(dataId))
        await confirmarInscricao(payment)
      }
    }
  } catch (err) {
    // Erro de rede/MP não deve bloquear o retorno 200 (MP re-tenta em falha).
    console.error('mp_webhook_error', err)
  }

  return NextResponse.json({ ok: true })
}
