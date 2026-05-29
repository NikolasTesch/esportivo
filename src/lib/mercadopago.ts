import { requireEnv } from './env'

const MP_API = 'https://api.mercadopago.com'

function getAccessToken() {
  return requireEnv('MERCADOPAGO_ACCESS_TOKEN')
}

function authHeader() {
  return { Authorization: `Bearer ${getAccessToken()}` }
}

export interface MPPreferenceResult {
  id: string
  checkoutUrl: string
}

// Cria preferência do Checkout Pro (suporta cartão e Pix na mesma sessão).
// MP detecta ambiente automaticamente pelo token: TEST-... → sandbox; APP-... → produção.
export async function createCheckoutPreference(params: {
  amountCents: number
  description: string
  email: string
  nome: string
  cpf: string
  inscricaoId: string
  notificationUrl: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}): Promise<MPPreferenceResult> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
      'X-Idempotency-Key': params.inscricaoId,
    },
    body: JSON.stringify({
      items: [
        {
          id: params.inscricaoId,
          title: params.description,
          quantity: 1,
          unit_price: params.amountCents / 100,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: params.email,
        name: params.nome,
        identification: { type: 'CPF', number: params.cpf.replace(/\D/g, '') },
      },
      back_urls: {
        success: params.successUrl,
        failure: params.failureUrl,
        pending: params.pendingUrl,
      },
      auto_return: 'approved',
      external_reference: params.inscricaoId,
      notification_url: params.notificationUrl,
      payment_methods: { installments: 12 },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Mercado Pago ${res.status}: ${text}`)
  }

  const data = await res.json()

  // Tokens de teste começam com "TEST-" → usa sandbox_init_point
  const isTest = getAccessToken().startsWith('TEST-')
  const checkoutUrl = isTest ? data.sandbox_init_point : data.init_point

  if (!checkoutUrl) throw new Error('Mercado Pago não retornou URL de checkout')

  return { id: data.id as string, checkoutUrl }
}

export interface MPPayment {
  status: string
  externalReference: string | null
  amountCents: number
  paymentMethod: string | null
}

export async function getMPPayment(id: string): Promise<MPPayment> {
  const res = await fetch(`${MP_API}/v1/payments/${id}`, { headers: authHeader() })
  if (!res.ok) throw new Error(`Pagamento MP não encontrado: ${id}`)
  const data = await res.json()
  return {
    status: data.status as string,
    externalReference: (data.external_reference as string | null) ?? null,
    amountCents: Math.round((data.transaction_amount ?? 0) * 100),
    paymentMethod: (data.payment_type_id as string | null) ?? null,
  }
}

export interface MPMerchantOrder {
  externalReference: string | null
  payments: Array<{ id: string; status: string; amountCents: number; paymentMethod: string | null }>
}

// Checkout Pro notifica via merchant_order; cada order contém os pagamentos.
export async function getMPMerchantOrder(id: string): Promise<MPMerchantOrder> {
  const res = await fetch(`${MP_API}/merchant_orders/${id}`, { headers: authHeader() })
  if (!res.ok) throw new Error(`Merchant order MP não encontrada: ${id}`)
  const data = await res.json()
  return {
    externalReference: (data.external_reference as string | null) ?? null,
    payments: ((data.payments ?? []) as Record<string, unknown>[]).map((p) => ({
      id: String(p.id),
      status: p.status as string,
      amountCents: Math.round(((p.transaction_amount as number) ?? 0) * 100),
      paymentMethod: (p.payment_type_id as string | null) ?? null,
    })),
  }
}
