import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { requireEnv } from './env'

let client: SupabaseClient | null = null

// Client Supabase com service_role — APENAS servidor (API routes / server
// components). A service key ignora RLS, então nunca importe isto em código
// que rode no browser.
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false } },
    )
  }
  return client
}

export interface Inscricao {
  id: string
  created_at: string
  nome: string
  email: string
  telefone: string
  cpf: string
  data_nascimento: string
  genero: 'masculino' | 'feminino'
  faixa_etaria: string
  distancia: '5K' | '10K' | '21K'
  tamanho_camisa: string
  kit: string
  status: 'pendente' | 'pago' | 'cancelado'
  amount_cents: number | null
  payment_method: string | null
  provider: 'stripe' | 'infinitepay'
  stripe_session_id: string | null
  order_nsu: string | null
  paid_at: string | null
}
