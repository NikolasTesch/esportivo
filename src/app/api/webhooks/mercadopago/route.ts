import { NextRequest, NextResponse } from 'next/server'
import {
  getMPPayment,
  getMPMerchantOrder,
  verifyWebhookSignature,
  type MPPayment,
} from '@/lib/mercadopago'
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
  })

  return true
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const topic = url.searchParams.get('topic')
  const qId = url.searchParams.get('id')
  const queryDataId = url.searchParams.get('data.id')

  // Corpo lido UMA única vez (req.json não pode ser consumido duas vezes).
  // Precisamos dele tanto para o `data.id` da assinatura quanto para o
  // processamento do webhook v2.
  let body: Record<string, unknown> | null = null
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    body = null
  }
  const bodyData =
    body && typeof body.data === 'object' && body.data
      ? (body.data as Record<string, unknown>)
      : null
  const bodyDataId = bodyData?.id != null ? String(bodyData.id) : null

  // Rejeita notificações forjadas: valida a assinatura HMAC do Mercado Pago
  // ANTES de qualquer consulta/atualização. O id do manifest segue a spec do
  // MP (query `data.id`), com fallback para o `data.id` do corpo e o `id` legado.
  const validSignature = verifyWebhookSignature({
    signatureHeader: req.headers.get('x-signature'),
    requestId: req.headers.get('x-request-id'),
    dataId: queryDataId ?? bodyDataId ?? qId,
  })
  if (!validSignature) {
    console.warn('mp_webhook_invalid_signature')
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

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
    if (body?.type === 'payment' && bodyDataId) {
      const payment = await getMPPayment(bodyDataId)
      await confirmarInscricao(payment)
    }
  } catch (err) {
    // Erro de rede/MP não deve bloquear o retorno 200 (MP re-tenta em falha).
    console.error('mp_webhook_error', err)
  }

  return NextResponse.json({ ok: true })
}
