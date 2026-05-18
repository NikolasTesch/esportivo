import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAuthed } from '@/lib/admin-auth'
import { getSupabase, type Inscricao } from '@/lib/supabase'
import { formatBRL } from '@/lib/esportivo'
import { LogoutButton } from './LogoutButton'

export const metadata: Metadata = {
  title: 'Painel ADM — Pagamentos',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const statusStyle: Record<string, string> = {
  pago: 'bg-[#D6FF3F] text-black',
  pendente: 'border border-white/25 text-white/60',
  cancelado: 'border border-[#FF5A1F]/40 text-[#FF5A1F]',
}

export default async function AdminPage() {
  const jar = await cookies()
  if (!isAuthed(jar.get(ADMIN_COOKIE)?.value)) {
    redirect('/esportivo/admin/login')
  }

  let rows: Inscricao[] = []
  let dbError: string | null = null
  try {
    const { data, error } = await getSupabase()
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    rows = (data ?? []) as Inscricao[]
  } catch (err) {
    dbError =
      err instanceof Error ? err.message : 'Falha ao carregar inscrições'
  }

  const pagos = rows.filter((r) => r.status === 'pago')
  const arrecadado = pagos.reduce((s, r) => s + (r.amount_cents ?? 0), 0)

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold uppercase italic tracking-tight">
            Pagamentos<span className="text-[#FF5A1F]">.</span>
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Inscrições da Corrida pela Consciência 2026.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
        {[
          ['Total', String(rows.length)],
          ['Pagos', String(pagos.length)],
          ['Pendentes', String(rows.filter((r) => r.status === 'pendente').length)],
          ['Arrecadado', formatBRL(arrecadado)],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#0B0B0C] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              {label}
            </p>
            <p className="mt-2 text-2xl font-extrabold italic tracking-tight text-[#D6FF3F]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {dbError && (
        <p className="mb-8 border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-4 py-3 text-sm text-[#FF5A1F]">
          {dbError}. Verifique as variáveis do Supabase e se o schema foi
          aplicado.
        </p>
      )}

      <div className="overflow-x-auto border border-white/10">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-white/[0.03] text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Nasc.</th>
              <th className="px-4 py-3">Prova</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Camisa</th>
              <th className="px-4 py-3">Kit</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Método</th>
              <th className="px-4 py-3">Pago em</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !dbError && (
              <tr>
                <td colSpan={13} className="px-4 py-10 text-center text-white/40">
                  Nenhuma inscrição ainda.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 text-white/70">
                <td className="px-4 py-3 font-mono text-xs text-white/40">
                  {r.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${statusStyle[r.status] ?? ''}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-white">{r.nome}</td>
                <td className="px-4 py-3">
                  <div>{r.email}</div>
                  <div className="text-xs text-white/40">{r.telefone}</div>
                </td>
                <td className="px-4 py-3 tabular-nums">{r.cpf}</td>
                <td className="px-4 py-3 tabular-nums">{r.data_nascimento}</td>
                <td className="px-4 py-3 font-bold text-[#D6FF3F]">{r.distancia}</td>
                <td className="px-4 py-3 capitalize">
                  {r.genero} · {r.faixa_etaria}
                </td>
                <td className="px-4 py-3 font-bold">{r.tamanho_camisa}</td>
                <td className="px-4 py-3 capitalize">{r.kit}</td>
                <td className="px-4 py-3 tabular-nums">
                  {r.amount_cents != null ? formatBRL(r.amount_cents) : '—'}
                </td>
                <td className="px-4 py-3 uppercase">{r.payment_method ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-white/40">
                  {r.paid_at ? new Date(r.paid_at).toLocaleString('pt-BR') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
