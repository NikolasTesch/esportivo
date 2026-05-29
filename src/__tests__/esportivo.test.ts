import { describe, it, expect } from 'vitest'
import {
  totalCents,
  formatBRL,
  InscricaoSchema,
  PRECO_BASE_CENTS,
} from '@/lib/esportivo'

// ---------------------------------------------------------------------------
// totalCents
// ---------------------------------------------------------------------------
describe('totalCents', () => {
  it('kit básico = preço base (sem add-on)', () => {
    expect(totalCents('basico')).toBe(PRECO_BASE_CENTS)
  })

  it('kit premium = preço base + R$ 89', () => {
    expect(totalCents('premium')).toBe(PRECO_BASE_CENTS + 8900)
  })

  it('kit embaixador = preço base + R$ 169', () => {
    expect(totalCents('embaixador')).toBe(PRECO_BASE_CENTS + 16900)
  })

  it('kit desconhecido retorna somente preço base', () => {
    expect(totalCents('inexistente')).toBe(PRECO_BASE_CENTS)
  })
})

// ---------------------------------------------------------------------------
// formatBRL
// ---------------------------------------------------------------------------
describe('formatBRL', () => {
  it('formata centavos em reais corretamente', () => {
    expect(formatBRL(8000)).toBe('R$ 80,00')
  })

  it('formata valor zero', () => {
    expect(formatBRL(0)).toBe('R$ 0,00')
  })

  it('formata valores grandes', () => {
    expect(formatBRL(24900)).toBe('R$ 249,00')
  })
})

// ---------------------------------------------------------------------------
// InscricaoSchema — validação Zod
// ---------------------------------------------------------------------------
const BASE_VALIDO = {
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(48) 99999-9999',
  cpf: '123.456.789-09',
  data_nascimento: '1990-06-15',
  genero: 'masculino' as const,
  faixa_etaria: '30-39' as const,
  distancia: '10K' as const,
  tamanho_camisa: 'M',
  kit: 'basico' as const,
  metodo: 'cartao' as const,
}

describe('InscricaoSchema', () => {
  it('aceita payload completo e válido (cartão)', () => {
    const result = InscricaoSchema.safeParse(BASE_VALIDO)
    expect(result.success).toBe(true)
  })

  it('aceita payload completo e válido (pix)', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, metodo: 'pix' })
    expect(result.success).toBe(true)
  })

  it('aceita todos os kits válidos', () => {
    for (const kit of ['basico', 'premium', 'embaixador'] as const) {
      expect(InscricaoSchema.safeParse({ ...BASE_VALIDO, kit }).success).toBe(true)
    }
  })

  it('aceita todas as distâncias', () => {
    for (const distancia of ['5K', '10K', '21K'] as const) {
      expect(InscricaoSchema.safeParse({ ...BASE_VALIDO, distancia }).success).toBe(true)
    }
  })

  it('rejeita nome muito curto', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, nome: 'AB' })
    expect(result.success).toBe(false)
  })

  it('rejeita e-mail inválido', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, email: 'nao-e-email' })
    expect(result.success).toBe(false)
  })

  it('rejeita distância inválida', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, distancia: '42K' })
    expect(result.success).toBe(false)
  })

  it('rejeita kit inválido', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, kit: 'inexistente' })
    expect(result.success).toBe(false)
  })

  it('rejeita método de pagamento inválido', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, metodo: 'boleto' })
    expect(result.success).toBe(false)
  })

  it('rejeita tamanho de camisa incompatível com gênero feminino', () => {
    // XGG só existe para masculino
    const result = InscricaoSchema.safeParse({
      ...BASE_VALIDO,
      genero: 'feminino',
      tamanho_camisa: 'XGG',
    })
    expect(result.success).toBe(false)
  })

  it('aceita tamanhos válidos para feminino', () => {
    for (const tamanho of ['PP', 'P', 'M', 'G', 'GG']) {
      expect(
        InscricaoSchema.safeParse({ ...BASE_VALIDO, genero: 'feminino', tamanho_camisa: tamanho }).success,
      ).toBe(true)
    }
  })

  it('rejeita data_nascimento em formato errado', () => {
    const result = InscricaoSchema.safeParse({ ...BASE_VALIDO, data_nascimento: '15/06/1990' })
    expect(result.success).toBe(false)
  })

  it('rejeita payload vazio', () => {
    const result = InscricaoSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
