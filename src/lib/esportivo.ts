import { z } from 'zod'

// Dados da corrida compartilhados entre formulário, API e painel ADM.

export const PRECO_BASE_CENTS = 8000 // R$ 80,00 — preço único fixo da inscrição

export const DISTANCIAS = ['5K', '10K', '21K'] as const
export const GENEROS = ['masculino', 'feminino'] as const
export const FAIXAS = ['16-19', '20-29', '30-39', '40-49', '50-59', '60+'] as const

export const KITS = [
  { id: 'basico', label: 'Básico — incluído na inscrição', addCents: 0 },
  { id: 'premium', label: 'Premium — add-on (+R$ 89)', addCents: 8900 },
  { id: 'embaixador', label: 'Embaixador — add-on solidário (+R$ 169)', addCents: 16900 },
] as const

export const KITS_DESC: Record<string, { desc: string; itens: string[] }> = {
  basico: {
    desc: 'Tudo o que você precisa para correr no dia.',
    itens: ['Número de peito + chip de cronometragem', 'Camiseta técnica oficial 2026', 'Hidratação a cada 2,5 km', 'Medalha finisher na chegada'],
  },
  premium: {
    desc: 'A lembrança completa do dia, mais foto digital.',
    itens: ['Tudo do Básico', 'Sacola-mochila exclusiva do evento', 'Viseira técnica da edição', 'Pacote de fotos digitais em alta resolução'],
  },
  embaixador: {
    desc: 'O kit que mais apoia a causa, com doação ao Instituto Reviva.',
    itens: ['Tudo do Premium', 'Corta-vento + mochila do evento', 'Acesso à área VIP de chegada', 'Doação extra ao Instituto Reviva + certificado'],
  },
}

// Tabela de tamanhos (medidas em cm, aproximadas).
export const TAMANHOS: Record<
  (typeof GENEROS)[number],
  { tamanho: string; busto: string; comprimento: string }[]
> = {
  masculino: [
    { tamanho: 'PP', busto: '92', comprimento: '68' },
    { tamanho: 'P', busto: '98', comprimento: '70' },
    { tamanho: 'M', busto: '104', comprimento: '72' },
    { tamanho: 'G', busto: '110', comprimento: '74' },
    { tamanho: 'GG', busto: '116', comprimento: '76' },
    { tamanho: 'XGG', busto: '122', comprimento: '78' },
  ],
  feminino: [
    { tamanho: 'PP', busto: '80', comprimento: '60' },
    { tamanho: 'P', busto: '86', comprimento: '62' },
    { tamanho: 'M', busto: '92', comprimento: '64' },
    { tamanho: 'G', busto: '98', comprimento: '66' },
    { tamanho: 'GG', busto: '104', comprimento: '68' },
  ],
}

export const TAMANHOS_VALIDOS = {
  masculino: TAMANHOS.masculino.map((t) => t.tamanho),
  feminino: TAMANHOS.feminino.map((t) => t.tamanho),
}

export function totalCents(kitId: string): number {
  const kit = KITS.find((k) => k.id === kitId)
  return PRECO_BASE_CENTS + (kit?.addCents ?? 0)
}

export function formatBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

// Schema validado no /api/esportivo/checkout.
export const InscricaoSchema = z
  .object({
    nome: z.string().min(3).max(120),
    email: z.email(),
    telefone: z.string().min(8).max(20),
    cpf: z.string().min(11).max(14),
    data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    genero: z.enum(GENEROS),
    faixa_etaria: z.enum(FAIXAS),
    distancia: z.enum(DISTANCIAS),
    tamanho_camisa: z.string().min(1).max(4),
    kit: z.enum(['basico', 'premium', 'embaixador']),
  })
  .refine(
    (d) => TAMANHOS_VALIDOS[d.genero].includes(d.tamanho_camisa),
    { path: ['tamanho_camisa'], message: 'Tamanho inválido para o gênero' },
  )

export type InscricaoInput = z.infer<typeof InscricaoSchema>
