import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'
import type Stripe from 'stripe'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockPaymentIntentsRetrieve = vi.fn()
const mockWebhooksConstructEvent = vi.fn()
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    paymentIntents: { retrieve: mockPaymentIntentsRetrieve },
    webhooks: { constructEvent: mockWebhooksConstructEvent },
  }),
}))

const mockUpdate = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    from: () => ({
      update: mockUpdate,
    }),
  }),
}))

vi.mock('@/lib/env', () => ({
  requireEnv: (_k: string) => 'whsec_test_secret',
}))

vi.mock('@/lib/email', () => ({
  sendCustomerReceipt: vi.fn().mockResolvedValue(undefined),
  sendAdminSaleNotification: vi.fn().mockResolvedValue(undefined),
  sendInscricaoConfirmacao: vi.fn().mockResolvedValue(undefined),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeWebhookRequest(body: string, signature = 'valid-sig'): NextRequest {
  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'stripe-signature': signature, 'Content-Type': 'application/json' },
    body,
  }) as unknown as NextRequest
}

function makeSession(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    id: 'cs_test',
    object: 'checkout.session',
    mode: 'payment',
    amount_total: 8000,
    customer_details: { email: 'test@email.com', name: 'Teste' },
    payment_status: 'paid',
    payment_intent: 'pi_test',
    metadata: { inscricao_id: 'inscricao-uuid-1', distancia: '10K', kit: 'basico' },
    ...overrides,
  } as Stripe.Checkout.Session
}

function supabaseUpdateReturnsRow(row: object) {
  const chain = {
    update: mockUpdate,
    eq: mockEq,
    select: mockSelect,
    single: vi.fn().mockResolvedValue({ data: row, error: null }),
  }
  mockSelect.mockReturnValue(chain)
  mockEq.mockReturnValue(chain)
  mockUpdate.mockReturnValue(chain)
}

// ---------------------------------------------------------------------------
// Testes
// ---------------------------------------------------------------------------
describe('POST /api/webhooks/stripe', () => {
  let POST: (req: NextRequest) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()

    mockPaymentIntentsRetrieve.mockResolvedValue({
      payment_method: { type: 'card' },
    })

    supabaseUpdateReturnsRow({
      nome: 'Teste',
      email: 'test@email.com',
      distancia: '10K',
      genero: 'masculino',
      faixa_etaria: '30-39',
      tamanho_camisa: 'M',
      kit: 'basico',
      amount_cents: 8000,
    })

    const mod = await import('../app/api/webhooks/stripe/route')
    POST = mod.POST
  })

  // ---- Assinatura -----------------------------------------------------------
  it('retorna 400 quando header stripe-signature está ausente', async () => {
    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: '{}',
    }) as unknown as NextRequest
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retorna 400 quando assinatura é inválida', async () => {
    mockWebhooksConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })
    const res = await POST(makeWebhookRequest('{}', 'bad-sig'))
    expect(res.status).toBe(400)
  })

  // ---- checkout.session.completed — cartão (síncrono) -----------------------
  it('confirma inscrição em checkout.session.completed com payment_status paid', async () => {
    const session = makeSession({ payment_status: 'paid' })
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const res = await POST(makeWebhookRequest(JSON.stringify(session)))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.received).toBe(true)
    // Supabase atualizado para 'pago'
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'pago' }))
  })

  // ---- checkout.session.completed — Pix pendente (assíncrono) ---------------
  it('NÃO confirma inscrição quando payment_status é unpaid (Pix aguardando)', async () => {
    const session = makeSession({ payment_status: 'unpaid' })
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const res = await POST(makeWebhookRequest(JSON.stringify(session)))

    expect(res.status).toBe(200)
    // Supabase NÃO deve marcar como pago
    expect(mockUpdate).not.toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pago' }),
    )
  })

  // ---- checkout.session.async_payment_succeeded — Pix confirmado ------------
  it('confirma inscrição Pix via checkout.session.async_payment_succeeded', async () => {
    const session = makeSession({ payment_status: 'paid' })
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'checkout.session.async_payment_succeeded',
      data: { object: session },
    })

    const res = await POST(makeWebhookRequest(JSON.stringify(session)))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.received).toBe(true)
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: 'pago' }))
  })

  // ---- Sessão sem inscricao_id (fluxo genérico /contratar) ------------------
  it('não aciona confirmarInscricao quando metadata não tem inscricao_id', async () => {
    const session = makeSession({
      payment_status: 'paid',
      metadata: null,
      customer_details: { email: 'generic@email.com', name: 'Genérico' } as Stripe.Checkout.Session['customer_details'],
    })
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const res = await POST(makeWebhookRequest(JSON.stringify(session)))
    expect(res.status).toBe(200)
    // Supabase não deve ser chamado para esta sessão
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  // ---- Evento desconhecido --------------------------------------------------
  it('responde received:true para evento desconhecido sem processar', async () => {
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'some.unknown.event',
      data: { object: {} },
    })

    const res = await POST(makeWebhookRequest('{}'))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.received).toBe(true)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  // ---- Falha de e-mail não bloqueia resposta --------------------------------
  it('retorna received:true mesmo quando envio de e-mail falha', async () => {
    const { sendInscricaoConfirmacao } = await import('@/lib/email')
    vi.mocked(sendInscricaoConfirmacao).mockRejectedValueOnce(new Error('resend down'))

    const session = makeSession({ payment_status: 'paid' })
    mockWebhooksConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: session },
    })

    const res = await POST(makeWebhookRequest(JSON.stringify(session)))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.received).toBe(true)
  })
})
