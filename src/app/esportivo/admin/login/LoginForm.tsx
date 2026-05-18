'use client'

import { useState } from 'react'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/esportivo/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: String(fd.get('password') ?? '') }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha no login')
      window.location.href = '/esportivo/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p className="border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-4 py-3 text-sm text-[#FF5A1F]">
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-white/45"
        >
          Senha do painel
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full border border-white/15 bg-[#0B0B0C] px-4 py-3 text-sm text-white outline-none focus:border-[#D6FF3F]"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D6FF3F] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
