'use client'

import { useMemo, useState } from 'react'
import type { Inscricao } from '@/lib/supabase'
import { formatBRL } from '@/lib/esportivo'

type ColKey =
  | 'id'
  | 'status'
  | 'nome'
  | 'email'
  | 'telefone'
  | 'cpf'
  | 'data_nascimento'
  | 'genero'
  | 'faixa_etaria'
  | 'distancia'
  | 'tamanho_camisa'
  | 'kit'
  | 'amount_cents'
  | 'payment_method'
  | 'paid_at'
  | 'created_at'

interface Column {
  key: ColKey
  label: string
  // Valor exibido na tabela (pode conter JSX via render)
  render: (r: Inscricao) => React.ReactNode
  // Valor em texto puro, usado na exportação .txt
  text: (r: Inscricao) => string
}

const statusStyle: Record<string, string> = {
  pago: 'bg-[#D6FF3F] text-black',
  pendente: 'border border-white/25 text-white/60',
  cancelado: 'border border-[#FF5A1F]/40 text-[#FF5A1F]',
}

const COLUMNS: Column[] = [
  {
    key: 'id',
    label: 'ID',
    render: (r) => (
      <span className="font-mono text-xs text-white/40">{r.id.slice(0, 8)}</span>
    ),
    text: (r) => r.id.slice(0, 8),
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => (
      <span
        className={`px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${statusStyle[r.status] ?? ''}`}
      >
        {r.status}
      </span>
    ),
    text: (r) => r.status,
  },
  {
    key: 'nome',
    label: 'Nome',
    render: (r) => <span className="font-semibold text-white">{r.nome}</span>,
    text: (r) => r.nome,
  },
  {
    key: 'email',
    label: 'Email',
    render: (r) => r.email,
    text: (r) => r.email,
  },
  {
    key: 'telefone',
    label: 'Telefone',
    render: (r) => r.telefone,
    text: (r) => r.telefone,
  },
  {
    key: 'cpf',
    label: 'CPF',
    render: (r) => <span className="tabular-nums">{r.cpf}</span>,
    text: (r) => r.cpf,
  },
  {
    key: 'data_nascimento',
    label: 'Nascimento',
    render: (r) => <span className="tabular-nums">{r.data_nascimento}</span>,
    text: (r) => r.data_nascimento,
  },
  {
    key: 'genero',
    label: 'Gênero',
    render: (r) => <span className="capitalize">{r.genero}</span>,
    text: (r) => r.genero,
  },
  {
    key: 'faixa_etaria',
    label: 'Faixa',
    render: (r) => r.faixa_etaria,
    text: (r) => r.faixa_etaria,
  },
  {
    key: 'distancia',
    label: 'Prova',
    render: (r) => (
      <span className="font-bold text-[#D6FF3F]">{r.distancia}</span>
    ),
    text: (r) => r.distancia,
  },
  {
    key: 'tamanho_camisa',
    label: 'Camisa',
    render: (r) => <span className="font-bold">{r.tamanho_camisa}</span>,
    text: (r) => r.tamanho_camisa,
  },
  {
    key: 'kit',
    label: 'Kit',
    render: (r) => <span className="capitalize">{r.kit}</span>,
    text: (r) => r.kit,
  },
  {
    key: 'amount_cents',
    label: 'Valor',
    render: (r) => (
      <span className="tabular-nums">
        {r.amount_cents != null ? formatBRL(r.amount_cents) : '—'}
      </span>
    ),
    text: (r) => (r.amount_cents != null ? formatBRL(r.amount_cents) : '—'),
  },
  {
    key: 'payment_method',
    label: 'Método',
    render: (r) => <span className="uppercase">{r.payment_method ?? '—'}</span>,
    text: (r) => r.payment_method ?? '—',
  },
  {
    key: 'paid_at',
    label: 'Pago em',
    render: (r) => (
      <span className="text-xs text-white/40">
        {r.paid_at ? new Date(r.paid_at).toLocaleString('pt-BR') : '—'}
      </span>
    ),
    text: (r) =>
      r.paid_at ? new Date(r.paid_at).toLocaleString('pt-BR') : '—',
  },
  {
    key: 'created_at',
    label: 'Criado em',
    render: (r) => (
      <span className="text-xs text-white/40">
        {new Date(r.created_at).toLocaleString('pt-BR')}
      </span>
    ),
    text: (r) => new Date(r.created_at).toLocaleString('pt-BR'),
  },
]

const DEFAULT_VISIBLE: ColKey[] = [
  'status',
  'nome',
  'telefone',
  'cpf',
  'distancia',
  'genero',
  'tamanho_camisa',
  'kit',
  'amount_cents',
  'paid_at',
]

const DEFAULT_EXPORT: ColKey[] = ['nome', 'telefone', 'tamanho_camisa']

const SELECT_BASE =
  'border border-white/15 bg-[#0B0B0C] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70 outline-none focus:border-[#D6FF3F]'

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function Bar({
  label,
  value,
  max,
  accent,
}: {
  label: string
  value: number
  max: number
  accent: string
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">
        {label}
      </span>
      <div className="h-5 flex-1 bg-white/[0.04]">
        <div
          className="h-full"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-extrabold tabular-nums text-white">
        {value}
      </span>
    </div>
  )
}

function ChartCard({
  title,
  data,
  accent,
}: {
  title: string
  data: [string, number][]
  accent: string
}) {
  const max = Math.max(1, ...data.map(([, v]) => v))
  return (
    <div className="bg-[#0B0B0C] p-5">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>
      <div className="space-y-2.5">
        {data.length === 0 ? (
          <p className="text-xs text-white/30">Sem dados.</p>
        ) : (
          data.map(([label, value]) => (
            <Bar
              key={label}
              label={label}
              value={value}
              max={max}
              accent={accent}
            />
          ))
        )}
      </div>
    </div>
  )
}

export function AdminDashboard({ rows }: { rows: Inscricao[] }) {
  const [q, setQ] = useState('')
  const [fStatus, setFStatus] = useState('todos')
  const [fProva, setFProva] = useState('todos')
  const [fGenero, setFGenero] = useState('todos')
  const [fKit, setFKit] = useState('todos')
  const [fTamanho, setFTamanho] = useState('todos')
  const [visible, setVisible] = useState<Set<ColKey>>(new Set(DEFAULT_VISIBLE))
  const [showCols, setShowCols] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [exportCols, setExportCols] = useState<Set<ColKey>>(
    new Set(DEFAULT_EXPORT),
  )

  const tamanhosDisponiveis = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.tamanho_camisa))).sort(),
    [rows],
  )

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (fStatus !== 'todos' && r.status !== fStatus) return false
      if (fProva !== 'todos' && r.distancia !== fProva) return false
      if (fGenero !== 'todos' && r.genero !== fGenero) return false
      if (fKit !== 'todos' && r.kit !== fKit) return false
      if (fTamanho !== 'todos' && r.tamanho_camisa !== fTamanho) return false
      if (term) {
        const hay =
          `${r.nome} ${r.email} ${r.cpf} ${r.telefone}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
  }, [rows, q, fStatus, fProva, fGenero, fKit, fTamanho])

  const pagos = filtered.filter((r) => r.status === 'pago')
  const pendentes = filtered.filter((r) => r.status === 'pendente')
  const arrecadado = pagos.reduce((s, r) => s + (r.amount_cents ?? 0), 0)

  const count = (fn: (r: Inscricao) => string) => {
    const m = new Map<string, number>()
    for (const r of filtered) {
      const k = fn(r)
      m.set(k, (m.get(k) ?? 0) + 1)
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  }

  const porProva = count((r) => r.distancia)
  const porStatus = count((r) => r.status)
  const porTamanho = Array.from(
    filtered.reduce((m, r) => {
      m.set(r.tamanho_camisa, (m.get(r.tamanho_camisa) ?? 0) + 1)
      return m
    }, new Map<string, number>()),
  ).sort((a, b) => a[0].localeCompare(b[0]))

  const visibleColumns = COLUMNS.filter((c) => visible.has(c.key))

  function toggle(set: Set<ColKey>, key: ColKey, setter: (s: Set<ColKey>) => void) {
    const next = new Set(set)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setter(next)
  }

  function resetFilters() {
    setQ('')
    setFStatus('todos')
    setFProva('todos')
    setFGenero('todos')
    setFKit('todos')
    setFTamanho('todos')
  }

  function exportTamanhos() {
    const cols = COLUMNS.filter((c) => exportCols.has(c.key))
    if (cols.length === 0) return

    const header = cols.map((c) => c.label.toUpperCase()).join(' - ')
    const lines = filtered.map((r) =>
      cols.map((c) => c.text(r)).join(' - '),
    )

    const partes: string[] = []
    partes.push(`# Exportação — ${filtered.length} inscrição(ões)`)
    partes.push(`# Gerado em ${new Date().toLocaleString('pt-BR')}`)
    partes.push('')
    partes.push(header)
    partes.push('-'.repeat(header.length))
    partes.push(...lines)

    if (exportCols.has('tamanho_camisa')) {
      partes.push('')
      partes.push('# Resumo por tamanho de camisa')
      for (const [tam, qtd] of porTamanho) {
        partes.push(`${tam}: ${qtd}`)
      }
    }

    const stamp = new Date().toISOString().slice(0, 10)
    download(`tamanhos-${stamp}.txt`, partes.join('\n'))
    setShowExport(false)
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
        {[
          ['Filtrados', String(filtered.length)],
          ['Pagos', String(pagos.length)],
          ['Pendentes', String(pendentes.length)],
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

      {/* Charts */}
      <div className="mb-8 grid gap-px bg-white/10 lg:grid-cols-3">
        <ChartCard title="Por prova" data={porProva} accent="#D6FF3F" />
        <ChartCard
          title="Por tamanho de camisa"
          data={porTamanho}
          accent="#FF5A1F"
        />
        <ChartCard title="Por status" data={porStatus} accent="#6EE7F9" />
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar nome, email, CPF, telefone…"
          className="min-w-[220px] flex-1 border border-white/15 bg-[#0B0B0C] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#D6FF3F]"
        />
        <select
          value={fStatus}
          onChange={(e) => setFStatus(e.target.value)}
          className={SELECT_BASE}
        >
          <option value="todos">Status: todos</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          value={fProva}
          onChange={(e) => setFProva(e.target.value)}
          className={SELECT_BASE}
        >
          <option value="todos">Prova: todas</option>
          <option value="5K">5K</option>
          <option value="10K">10K</option>
          <option value="21K">21K</option>
        </select>
        <select
          value={fGenero}
          onChange={(e) => setFGenero(e.target.value)}
          className={SELECT_BASE}
        >
          <option value="todos">Gênero: todos</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
        </select>
        <select
          value={fKit}
          onChange={(e) => setFKit(e.target.value)}
          className={SELECT_BASE}
        >
          <option value="todos">Kit: todos</option>
          <option value="basico">Básico</option>
          <option value="premium">Premium</option>
          <option value="embaixador">Embaixador</option>
        </select>
        <select
          value={fTamanho}
          onChange={(e) => setFTamanho(e.target.value)}
          className={SELECT_BASE}
        >
          <option value="todos">Camisa: todas</option>
          {tamanhosDisponiveis.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50 transition-colors hover:border-white/40 hover:text-white"
        >
          Limpar
        </button>
      </div>

      {/* Ações de coluna / export */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            setShowCols((v) => !v)
            setShowExport(false)
          }}
          className="border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-[#D6FF3F] hover:text-[#D6FF3F]"
        >
          Colunas ({visibleColumns.length})
        </button>
        <button
          onClick={() => {
            setShowExport((v) => !v)
            setShowCols(false)
          }}
          className="bg-[#D6FF3F] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black transition-transform hover:-translate-y-0.5"
        >
          Exportar tamanhos
        </button>
      </div>

      {/* Painel: escolher colunas visíveis */}
      {showCols && (
        <div className="mb-6 border border-white/10 bg-[#0B0B0C] p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            Colunas visíveis na tabela
          </p>
          <div className="flex flex-wrap gap-2">
            {COLUMNS.map((c) => {
              const on = visible.has(c.key)
              return (
                <button
                  key={c.key}
                  onClick={() => toggle(visible, c.key, setVisible)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    on
                      ? 'bg-white/10 text-white'
                      : 'border border-white/15 text-white/35 hover:text-white/60'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Painel: escolher colunas do export */}
      {showExport && (
        <div className="mb-6 border border-[#D6FF3F]/30 bg-[#0B0B0C] p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            Colunas no arquivo .txt — exporta as {filtered.length} linhas
            filtradas
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {COLUMNS.map((c) => {
              const on = exportCols.has(c.key)
              return (
                <button
                  key={c.key}
                  onClick={() => toggle(exportCols, c.key, setExportCols)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    on
                      ? 'bg-[#D6FF3F] text-black'
                      : 'border border-white/15 text-white/35 hover:text-white/60'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
          <button
            onClick={exportTamanhos}
            disabled={exportCols.size === 0}
            className="bg-[#D6FF3F] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Baixar .txt
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full whitespace-nowrap text-sm">
          <thead>
            <tr className="bg-white/[0.03] text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
              {visibleColumns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumns.length || 1}
                  className="px-4 py-10 text-center text-white/40"
                >
                  Nenhuma inscrição encontrada com os filtros atuais.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/10 text-white/70"
              >
                {visibleColumns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
