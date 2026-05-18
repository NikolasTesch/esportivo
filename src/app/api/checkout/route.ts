import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { getEnv, requireEnv } from '@/lib/env'

export const runtime = 'nodejs'

const BodySchema = z.object({
  plan: z.enum(['onetime', 'subscription']),
  customerEmail: z.email().optional(),
  customerName: z.string().min(1).max(120).optional(),
})

export async function POST(req: NextRequest) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { plan, customerEmail, customerName } = parsed.data
  const isSubscription = plan === 'subscription'

  let priceId: string
  try {
    priceId = isSubscription
      ? requireEnv('STRIPE_PRICE_SUBSCRIPTION')
      : requireEnv('STRIPE_PRICE_ONETIME')
  } catch (err) {
    console.error('checkout_config_error', err)
    return NextResponse.json(
      { error: 'Pagamento não configurado no servidor' },
      { status: 503 },
    )
  }

  // Portabilidade de host: prioriza a env, cai para a origem da requisição.
  const baseUrl =
    getEnv('NEXT_PUBLIC_APP_URL') ??
    req.headers.get('origin') ??
    'http://localhost:3000'

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: `${baseUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancelado`,
      metadata: { plan, customerName: customerName ?? '' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout_error', err)
    return NextResponse.json(
      { error: 'Não foi possível iniciar o pagamento' },
      { status: 500 },
    )
  }
}
