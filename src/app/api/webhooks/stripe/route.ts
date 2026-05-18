import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { requireEnv } from '@/lib/env'
import {
  sendCustomerReceipt,
  sendAdminSaleNotification,
  sendInscricaoConfirmacao,
  type SaleInfo,
} from '@/lib/email'
import { getSupabase } from '@/lib/supabase'

// Confirma a inscrição no Supabase só depois que o Stripe reconhece o
// pagamento, e dispara o e-mail de confirmação. Retorna true se a sessão
// era de uma inscrição (para não cair no fluxo genérico de /contratar).
async function confirmarInscricao(
  s: Stripe.Checkout.Session,
): Promise<boolean> {
  const inscricaoId = s.metadata?.inscricao_id
  if (!inscricaoId) return false

  let metodo = 'card'
  try {
    if (typeof s.payment_intent === 'string') {
      const pi = await getStripe().paymentIntents.retrieve(s.payment_intent, {
        expand: ['payment_method'],
      })
      const pm = pi.payment_method
      if (pm && typeof pm !== 'string' && pm.type) metodo = pm.type
    }
  } catch (err) {
    console.error('inscricao_payment_method_error', err)
  }

  const supabase = getSupabase()
  const { data: row, error } = await supabase
    .from('inscricoes')
    .update({
      status: 'pago',
      amount_cents: s.amount_total ?? undefined,
      payment_method: metodo,
      paid_at: new Date().toISOString(),
    })
    .eq('id', inscricaoId)
    .select(
      'nome, email, distancia, genero, faixa_etaria, tamanho_camisa, kit, amount_cents',
    )
    .single()

  if (error || !row) {
    console.error('inscricao_update_error', error)
    return true
  }

  await sendInscricaoConfirmacao({
    email: row.email,
    nome: row.nome,
    distancia: row.distancia,
    categoria: `${row.genero} · ${row.faixa_etaria}`,
    tamanhoCamisa: row.tamanho_camisa,
    kit: row.kit,
    amountCents: row.amount_cents ?? s.amount_total ?? 0,
  })
  await sendAdminSaleNotification({
    customerEmail: row.email,
    customerName: row.nome,
    amountCents: row.amount_cents ?? s.amount_total ?? 0,
    planLabel: `Inscrição ${row.distancia} (${row.kit})`,
    isSubscription: false,
  })
  return true
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Assinatura ausente' }, { status: 400 })
  }

  // A verificação exige o corpo bruto, antes de qualquer parse.
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      requireEnv('STRIPE_WEBHOOK_SECRET'),
    )
  } catch (err) {
    console.error('webhook_signature_error', err)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session
        // Inscrição da corrida: confirma no Supabase + e-mail próprio.
        if (await confirmarInscricao(s)) break
        const info: SaleInfo = {
          customerEmail: s.customer_details?.email ?? '',
          customerName:
            s.customer_details?.name ?? s.metadata?.customerName ?? null,
          amountCents: s.amount_total ?? 0,
          planLabel:
            s.mode === 'subscription' ? 'Assinatura' : 'Pagamento único',
          isSubscription: s.mode === 'subscription',
        }
        if (info.customerEmail) await sendCustomerReceipt(info)
        await sendAdminSaleNotification(info)
        break
      }

      case 'invoice.paid': {
        // Renovações recorrentes. A 1ª cobrança já é tratada em
        // checkout.session.completed, então só agimos no ciclo de renovação.
        const inv = event.data.object as Stripe.Invoice
        if (inv.billing_reason === 'subscription_cycle') {
          const info: SaleInfo = {
            customerEmail: inv.customer_email ?? '',
            customerName: inv.customer_name ?? null,
            amountCents: inv.amount_paid ?? 0,
            planLabel: 'Renovação de assinatura',
            isSubscription: true,
          }
          if (info.customerEmail) await sendCustomerReceipt(info)
          await sendAdminSaleNotification(info)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await sendAdminSaleNotification({
          customerEmail: '',
          customerName: null,
          amountCents: 0,
          planLabel: `Assinatura cancelada (${sub.id})`,
          isSubscription: true,
        })
        break
      }

      default:
        break
    }
  } catch (err) {
    // Falha de email não deve forçar o Stripe a reprocessar o pagamento.
    console.error('webhook_handler_error', event.type, err)
    return NextResponse.json({ received: true, warning: 'handler error' })
  }

  return NextResponse.json({ received: true })
}
