'use client'

import { useState } from 'react'

type Plan = 'onetime' | 'subscription'

export function PricingSection() {
  const [loading, setLoading] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function checkout(plan: Plan) {
    setLoading(plan)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Falha ao iniciar pagamento')
      }
      window.location.href = data.url as string
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setLoading(null)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-3xl font-semibold tracking-tight text-[#1A1A1A]">
        Contrate sua landing page
      </h2>
      <p className="mt-2 text-[#5D6D7E]">
        Escolha o formato que faz sentido para o seu negócio.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-8">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            Pagamento único
          </h3>
          <p className="mt-2 text-sm text-[#5D6D7E]">
            Entrega da landing page com pagamento avulso via cartão.
          </p>
          <button
            onClick={() => checkout('onetime')}
            disabled={loading !== null}
            className="mt-6 w-full rounded-xl bg-[#dd0b0e] px-5 py-3 font-medium text-white transition disabled:opacity-50"
          >
            {loading === 'onetime' ? 'Redirecionando…' : 'Contratar avulso'}
          </button>
        </div>

        <div className="rounded-2xl border border-black/10 p-8">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Assinatura</h3>
          <p className="mt-2 text-sm text-[#5D6D7E]">
            Plano recorrente com manutenção e hospedagem contínuas.
          </p>
          <button
            onClick={() => checkout('subscription')}
            disabled={loading !== null}
            className="mt-6 w-full rounded-xl bg-[#1A1A1A] px-5 py-3 font-medium text-white transition disabled:opacity-50"
          >
            {loading === 'subscription'
              ? 'Redirecionando…'
              : 'Assinar plano'}
          </button>
        </div>
      </div>
    </section>
  )
}
