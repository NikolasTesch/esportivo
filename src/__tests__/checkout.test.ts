import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Mocks — definidos antes de importar o route handler
// ---------------------------------------------------------------------------
const mockInsert = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn(() => ({ insert: mockInsert, update: mockUpdate }))
vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ from: mockFrom }),
}))

const mockCreatePreference = vi.fn()
vi.mock('@/lib/mercadopago', () => ({
  createCheckoutPreference: (...args: unknown[]) => mockCreatePreference(...args),
}))

vi.mock('@/lib/env', () => ({
  getEnv: (_k: string) => 'http://localhost:3000',
}))

// ---------------------------------------------------------------------------
// Payload de inscrição válido (sem metodo — campo removido)
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
    select: () => ({
      single: () => Promise.resolve({ data: null, error: new Error('db fail') }),
    }),
  })
}

function supabaseUpdateOk() {
  mockUpdate.mockReturnValue({ eq: () => Promise.resolve({ error: null }) })
}

// ---------------------------------------------------------------------------
// Testes
// ---------------------------------------------------------------------------
describe('POST /api/esportivo/checkout', () => {
  let POST: (req: NextRequest) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    supabaseUpdateOk()
    const mod = await import('../app/api/esportivo/checkout/route')
    POST = mod.POST
  })

  // ---- Fluxo principal (Mercado Pago) --------------------------------------

  it('grava inscrição como pendente com provider mercadopago e retorna URL do MP', async () => {
    supabaseInsertOk('abc-111')
    mockCreatePreference.mockResolvedValue({
      id: 'pref-123',
      checkoutUrl: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref-123',
    })

    const res = await POST(makeRequest(BASE))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.url).toContain('mercadopago.com.br')

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'mercadopago', status: 'pendente' }),
    )
  })

  it('grava o preference_id no campo order_nsu após criar a preferência', async () => {
    supabaseInsertOk('abc-222')
    mockCreatePreference.mockResolvedValue({
      id: 'pref-456',
      checkoutUrl: 'https://mercadopago.com.br/checkout/pref-456',
    })

    await POST(makeRequest(BASE))

    expect(mockUpdate).toHaveBeenCalledWith({ order_nsu: 'pref-456' })
  })

  it('passa description, email, nome, cpf e amountCents corretos ao MP', async () => {
    supabaseInsertOk('abc-333')
    mockCreatePreference.mockResolvedValue({ id: 'p', checkoutUrl: 'https://mp.com/p' })

    await POST(makeRequest(BASE))

    expect(mockCreatePreference).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'maria@email.com',
        nome: 'Maria Oliveira',
        cpf: '111.444.777-35',
        amountCents: 8000,
      }),
    )
  })

  // ---- Valores por kit -----------------------------------------------------

  it('kit premium: amount_cents = 8000 + 8900 = 16900', async () => {
    supabaseInsertOk('abc-444')
    mockCreatePreference.mockResolvedValue({ id: 'p', checkoutUrl: 'https://mp.com/p' })

    await POST(makeRequest({ ...BASE, kit: 'premium' }))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ amount_cents: 16900 }),
    )
    expect(mockCreatePreference).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: 16900 }),
    )
  })

  it('kit embaixador: amount_cents = 8000 + 16900 = 24900', async () => {
    supabaseInsertOk('abc-555')
    mockCreatePreference.mockResolvedValue({ id: 'p', checkoutUrl: 'https://mp.com/p' })

    await POST(makeRequest({ ...BASE, kit: 'embaixador' }))

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ amount_cents: 24900 }),
    )
  })

  // ---- Erros de validação --------------------------------------------------

  it('retorna 400 para payload sem nome', async () => {
    const { nome: _omit, ...semNome } = BASE
    const res = await POST(makeRequest(semNome))
    expect(res.status).toBe(400)
    expect(mockCreatePreference).not.toHaveBeenCalled()
  })

  it('retorna 400 para e-mail inválido', async () => {
    const res = await POST(makeRequest({ ...BASE, email: 'nao-e-email' }))
    expect(res.status).toBe(400)
  })

  it('retorna 400 para distância inválida', async () => {
    const res = await POST(makeRequest({ ...BASE, distancia: '100K' }))
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
    const res = await POST(makeRequest(BASE))
    expect(res.status).toBe(500)
    expect(mockCreatePreference).not.toHaveBeenCalled()
  })

  it('retorna 500 e marca cancelado quando Mercado Pago falha', async () => {
    supabaseInsertOk('abc-666')
    mockCreatePreference.mockRejectedValue(new Error('mp timeout'))

    const res = await POST(makeRequest(BASE))
    expect(res.status).toBe(500)
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'cancelado' })
  })

  // ---- notification_url e external_reference --------------------------------

  it('passa inscricaoId como external_reference e notification_url correto', async () => {
    supabaseInsertOk('meta-id-1')
    mockCreatePreference.mockResolvedValue({ id: 'p', checkoutUrl: 'https://mp.com/p' })

    await POST(makeRequest({ ...BASE, distancia: '21K', kit: 'premium' }))

    expect(mockCreatePreference).toHaveBeenCalledWith(
      expect.objectContaining({
        inscricaoId: 'meta-id-1',
        notificationUrl: 'http://localhost:3000/api/webhooks/mercadopago',
      }),
    )
  })
})
