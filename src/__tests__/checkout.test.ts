import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Mocks — definidos antes de importar o route handler
// ---------------------------------------------------------------------------
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  update: mockUpdate,
}))
vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}))

const mockSessionCreate = vi.fn()
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: mockSessionCreate } } }),
}))

vi.mock('@/lib/env', () => ({
  getEnv: (_k: string) => 'http://localhost:3000',
}))

// ---------------------------------------------------------------------------
// Payload de inscrição válido reutilizável
// ---------------------------------------------------------------------------
const BASE = {
  nome: 'Maria Oliveira',
  email: 'maria@email.com',
  telefone: '(11) 98888-7777',
  cpf: '111.444.777-35',
  data_nascimento: '1995-03-20',
  genero: 'feminino',
  faixa_etaria: '20-29',
  distancia: '5K',
  tamanho_camisa: 'P',
  kit: 'basico',
}

function makeRequest(body: object): NextRequest {
  return new Request('http://localhost/api/esportivo/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest
}

// ---------------------------------------------------------------------------
// Helpers de retorno do Supabase
// ---------------------------------------------------------------------------
function supabaseInsertOk(id = 'uuid-1234') {
  mockInsert.mockReturnValue({
    select: () => ({ single: () => Promise.resolve({ data: { id }, error: null }) }),
  })
}

function supabaseInsertErr() {
  mockInsert.mockReturnValue({
    select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('db fail') }) }),
  })
}

function supabaseUpdateOk() {
  mockUpdate.mockReturnValue({
    eq: () => Promise.resolve({ error: null }),
  })
}

// ---------------------------------------------------------------------------
// Testes
// ---------------------------------------------------------------------------
describe('POST /api/esportivo/checkout', () => {
  let POST: (req: NextRequest) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    supabaseUpdateOk()
    // Reimportar garante que os mocks estejam activos
    const mod = await import('../app/api/esportivo/checkout/route')
    POST = mod.POST
  })

  // ---- Cartão ---------------------------------------------------------------
  it('cartão: grava inscrição como pendente e retorna URL do Stripe', async () => {
    supabaseInsertOk('abc-111')
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/cartao', id: 'cs_test' })

    const res = await POST(makeRequest({ ...BASE, metodo: 'cartao' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.url).toBe('https://checkout.stripe.com/cartao')

    // Confirma que Stripe foi chamado com payment_method_types: card
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['card'] }),
    )

    // provider gravado como 'stripe'
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'stripe', status: 'pendente' }),
    )
  })

  // ---- Pix ------------------------------------------------------------------
  it('pix: grava inscrição com provider "pix" e retorna URL do Stripe', async () => {
    supabaseInsertOk('abc-222')
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/pix', id: 'cs_pix' })

    const res = await POST(makeRequest({ ...BASE, metodo: 'pix' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.url).toBe('https://checkout.stripe.com/pix')

    // Stripe deve ser chamado com payment_method_types: pix
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ payment_method_types: ['pix'] }),
    )

    // provider gravado como 'pix' (não mais 'infinitepay')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'pix', status: 'pendente' }),
    )
  })

  it('pix: InfinitePay NÃO é mais chamado', async () => {
    supabaseInsertOk('abc-333')
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/pix2', id: 'cs_pix2' })

    await POST(makeRequest({ ...BASE, metodo: 'pix' }))

    // Stripe sessions.create é o único ponto de saída — verifica que foi chamado
    expect(mockSessionCreate).toHaveBeenCalledTimes(1)
  })

  // ---- Valores ----------------------------------------------------------
  it('kit premium: amount_cents = 8000 + 8900', async () => {
    supabaseInsertOk('abc-444')
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/x', id: 'cs_x' })

    await POST(makeRequest({ ...BASE, metodo: 'cartao', kit: 'premium' }))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ amount_cents: 16900 }),
    )
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 16900 }),
          }),
        ]),
      }),
    )
  })

  it('kit embaixador: amount_cents = 8000 + 16900', async () => {
    supabaseInsertOk('abc-555')
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/y', id: 'cs_y' })

    await POST(makeRequest({ ...BASE, metodo: 'cartao', kit: 'embaixador' }))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ amount_cents: 24900 }),
    )
  })

  // ---- Erros de validação --------------------------------------------------
  it('retorna 400 para payload sem nome', async () => {
    const { nome: _omit, ...semNome } = BASE
    const res = await POST(makeRequest({ ...semNome, metodo: 'cartao' }))
    expect(res.status).toBe(400)
    expect(mockSessionCreate).not.toHaveBeenCalled()
  })

  it('retorna 400 para e-mail inválido', async () => {
    const res = await POST(makeRequest({ ...BASE, email: 'nao-e-email', metodo: 'cartao' }))
    expect(res.status).toBe(400)
  })

  it('retorna 400 para distância inválida', async () => {
    const res = await POST(makeRequest({ ...BASE, distancia: '100K', metodo: 'pix' }))
    expect(res.status).toBe(400)
  })

  it('retorna 400 para JSON malformado', async () => {
    const req = new Request('http://localhost/api/esportivo/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
    }) as unknown as NextRequest
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  // ---- Erros de infra -------------------------------------------------------
  it('retorna 500 quando Supabase falha no insert', async () => {
    supabaseInsertErr()
    const res = await POST(makeRequest({ ...BASE, metodo: 'cartao' }))
    expect(res.status).toBe(500)
    expect(mockSessionCreate).not.toHaveBeenCalled()
  })

  it('cartão: retorna 500 e marca cancelado quando Stripe falha', async () => {
    supabaseInsertOk('abc-666')
    mockSessionCreate.mockRejectedValue(new Error('stripe timeout'))

    const res = await POST(makeRequest({ ...BASE, metodo: 'cartao' }))
    expect(res.status).toBe(500)

    // inscricao marcada como cancelada
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'cancelado' })
  })

  it('pix: retorna 500 e marca cancelado quando Stripe falha', async () => {
    supabaseInsertOk('abc-777')
    mockSessionCreate.mockRejectedValue(new Error('stripe pix error'))

    const res = await POST(makeRequest({ ...BASE, metodo: 'pix' }))
    expect(res.status).toBe(500)

    expect(mockUpdate).toHaveBeenCalledWith({ status: 'cancelado' })
  })

  // ---- Metadata do Stripe ---------------------------------------------------
  it('metadata inclui inscricao_id, distancia e kit', async () => {
    supabaseInsertOk('meta-id-1')
    mockSessionCreate.mockResolvedValue({ url: 'https://stripe.com/s', id: 'cs_meta' })

    await POST(makeRequest({ ...BASE, metodo: 'cartao', distancia: '21K', kit: 'premium' }))

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          inscricao_id: 'meta-id-1',
          distancia: '21K',
          kit: 'premium',
        }),
      }),
    )
  })
})
