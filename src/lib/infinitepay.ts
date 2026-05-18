import { requireEnv } from './env'

// Integração InfinitePay (Checkout / link de pagamento) — usada para Pix.
// API pública, sem secret key: identificada pelo handle (InfiniteTag).
// Docs: https://docs.infinitepay.io  · Suporte: ecommerce@infinitepay.io
//
// IMPORTANTE: a InfinitePay NÃO assina o webhook (sem HMAC). A confiança vem
// de (1) order_nsu existir no nosso banco e (2) reconfirmar via payment_check
// no servidor antes de marcar como pago. Nunca confie só no corpo do webhook.

const BASE = 'https://api.checkout.infinitepay.io'

export interface CriarLinkInput {
  orderNsu: string
  amountCents: number
  description: string
  redirectUrl: string
  webhookUrl: string
}

// Cria o link de checkout e devolve a URL para redirecionar o cliente.
export async function criarLinkCheckout(
  i: CriarLinkInput,
): Promise<string> {
  const handle = requireEnv('INFINITEPAY_HANDLE').replace(/^\$/, '')

  const res = await fetch(`${BASE}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handle,
      order_nsu: i.orderNsu,
      redirect_url: i.redirectUrl,
      webhook_url: i.webhookUrl,
      items: [
        {
          quantity: 1,
          price: i.amountCents, // sempre em centavos
          description: i.description,
        },
      ],
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`InfinitePay link HTTP ${res.status}: ${body}`)
  }

  const data: unknown = await res.json().catch(() => ({}))
  const url = extractUrl(data)
  if (!url) {
    throw new Error(
      `InfinitePay: resposta sem URL de checkout (${JSON.stringify(data)})`,
    )
  }
  return url
}

// O nome exato do campo de URL pode variar conforme a versão da API;
// tentamos as chaves conhecidas de forma defensiva.
function extractUrl(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const o = data as Record<string, unknown>
  const candidates = [
    o.url,
    o.checkout_url,
    o.payment_url,
    o.link,
    (o.data as Record<string, unknown> | undefined)?.url,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.startsWith('http')) return c
  }
  return null
}

export interface WebhookPayload {
  order_nsu?: string
  transaction_nsu?: string
  invoice_slug?: string
  slug?: string
  amount?: number
  paid_amount?: number
  capture_method?: string // 'pix' | 'credit_card'
  receipt_url?: string
}

// Reconfirma o pagamento no servidor (não confiar só no webhook).
// Retorna true se a InfinitePay confirma o pagamento daquele pedido.
export async function confirmarPagamento(
  p: WebhookPayload,
): Promise<boolean> {
  const handle = requireEnv('INFINITEPAY_HANDLE').replace(/^\$/, '')
  const slug = p.invoice_slug ?? p.slug
  if (!p.order_nsu || !p.transaction_nsu || !slug) return false

  try {
    const res = await fetch(`${BASE}/payment_check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle,
        order_nsu: p.order_nsu,
        transaction_nsu: p.transaction_nsu,
        slug,
      }),
    })
    if (!res.ok) return false
    const data: unknown = await res.json().catch(() => ({}))
    return isPaid(data)
  } catch {
    return false
  }
}

function isPaid(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const o = data as Record<string, unknown>
  if (o.success === true || o.paid === true) return true
  if (typeof o.status === 'string') {
    return ['paid', 'approved', 'success', 'completed'].includes(
      o.status.toLowerCase(),
    )
  }
  return false
}
