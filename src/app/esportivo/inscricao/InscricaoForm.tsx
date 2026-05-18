'use client'

import { useMemo, useState } from 'react'
import {
  DISTANCIAS,
  FAIXAS,
  GENEROS,
  KITS,
  TAMANHOS_VALIDOS,
  formatBRL,
  totalCents,
} from '@/lib/esportivo'

const inputCls =
  'w-full border border-white/15 bg-[#0B0B0C] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D6FF3F]'
const labelCls =
  'mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/45'

export function InscricaoForm() {
  const [genero, setGenero] = useState<(typeof GENEROS)[number]>('masculino')
  const [kit, setKit] = useState<string>('basico')
  const [metodo, setMetodo] = useState<'cartao' | 'pix'>('cartao')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tamanhos = TAMANHOS_VALIDOS[genero]
  const total = useMemo(() => totalCents(kit), [kit])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      nome: String(fd.get('nome') ?? ''),
      email: String(fd.get('email') ?? ''),
      telefone: String(fd.get('telefone') ?? ''),
      cpf: String(fd.get('cpf') ?? ''),
      data_nascimento: String(fd.get('data_nascimento') ?? ''),
      genero,
      faixa_etaria: String(fd.get('faixa_etaria') ?? ''),
      distancia: String(fd.get('distancia') ?? ''),
      tamanho_camisa: String(fd.get('tamanho_camisa') ?? ''),
      kit,
      metodo,
    }
    try {
      const res = await fetch('/api/esportivo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Não foi possível iniciar o pagamento')
      }
      window.location.href = data.url as string
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {error && (
        <p className="border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-4 py-3 text-sm text-[#FF5A1F]">
          {error}
        </p>
      )}

      <fieldset className="space-y-6">
        <legend className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#D6FF3F]">
          1 · Sua prova
        </legend>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="distancia">Distância</label>
            <select id="distancia" name="distancia" required className={inputCls} defaultValue="">
              <option value="" disabled>Selecione</option>
              {DISTANCIAS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="genero">Gênero</label>
            <select
              id="genero"
              name="genero"
              required
              className={inputCls}
              value={genero}
              onChange={(e) => setGenero(e.target.value as (typeof GENEROS)[number])}
            >
              {GENEROS.map((g) => (
                <option key={g} value={g}>
                  {g === 'masculino' ? 'Masculino' : 'Feminino'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="faixa_etaria">Faixa etária</label>
            <select id="faixa_etaria" name="faixa_etaria" required className={inputCls} defaultValue="">
              <option value="" disabled>Selecione</option>
              {FAIXAS.map((f) => (
                <option key={f} value={f}>{f} anos</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#D6FF3F]">
          2 · Camisa & kit
        </legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="tamanho_camisa">
              Tamanho da camisa ({genero === 'masculino' ? 'masculino' : 'baby look'})
            </label>
            <select id="tamanho_camisa" name="tamanho_camisa" required className={inputCls} defaultValue="">
              <option value="" disabled>Selecione</option>
              {tamanhos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="kit">Kit</label>
            <select
              id="kit"
              name="kit"
              required
              className={inputCls}
              value={kit}
              onChange={(e) => setKit(e.target.value)}
            >
              {KITS.map((k) => (
                <option key={k.id} value={k.id}>{k.label}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#D6FF3F]">
          3 · Seus dados
        </legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="nome">Nome completo</label>
            <input id="nome" name="nome" required minLength={3} className={inputCls} placeholder="Como aparece no documento" />
          </div>
          <div>
            <label className={labelCls} htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required className={inputCls} placeholder="voce@email.com" />
          </div>
          <div>
            <label className={labelCls} htmlFor="telefone">Telefone / WhatsApp</label>
            <input id="telefone" name="telefone" required className={inputCls} placeholder="(48) 99999-9999" />
          </div>
          <div>
            <label className={labelCls} htmlFor="cpf">CPF</label>
            <input id="cpf" name="cpf" required minLength={11} maxLength={14} className={inputCls} placeholder="000.000.000-00" />
          </div>
          <div>
            <label className={labelCls} htmlFor="data_nascimento">Data de nascimento</label>
            <input id="data_nascimento" name="data_nascimento" type="date" required className={inputCls} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#D6FF3F]">
          4 · Forma de pagamento
        </legend>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2">
          {([
            { id: 'cartao', titulo: 'Cartão de crédito', sub: 'Stripe · até 12x · aprovação na hora' },
            { id: 'pix', titulo: 'Pix', sub: 'InfinitePay · pagamento à vista · sem taxa' },
          ] as const).map((m) => {
            const ativo = metodo === m.id
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setMetodo(m.id)}
                aria-pressed={ativo}
                className={`flex flex-col items-start p-6 text-left transition-colors ${
                  ativo
                    ? 'bg-[#D6FF3F] text-black'
                    : 'bg-[#0B0B0C] text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-lg font-bold uppercase tracking-wide">
                  {m.titulo}
                </span>
                <span
                  className={`mt-1 text-xs ${ativo ? 'text-black/70' : 'text-white/45'}`}
                >
                  {m.sub}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
            Total a pagar
          </p>
          <p className="text-4xl font-extrabold italic tracking-tight text-[#D6FF3F]">
            {formatBRL(total)}
          </p>
          <p className="mt-1 text-xs text-white/45">
            Categoria e tamanho são confirmados após o pagamento.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 bg-[#D6FF3F] px-9 py-5 text-sm font-extrabold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? 'Redirecionando…' : 'Ir para o pagamento'}
        </button>
      </div>
    </form>
  )
}
