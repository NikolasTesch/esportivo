import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react'
import { getSupabase, type Inscricao } from '@/lib/supabase'
import { formatBRL } from '@/lib/esportivo'

export const metadata: Metadata = {
  title: 'Inscrição recebida — Corrida pela Consciência 2026',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Search = { ref?: string; session_id?: string }

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm">
      <span className="text-white/45">{k}</span>
      <span className="font-semibold text-white">{v}</span>
    </div>
  )
}

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const { ref } = await searchParams

  let row: Inscricao | null = null
  if (ref) {
    try {
      const { data } = await getSupabase()
        .from('inscricoes')
        .select('*')
        .eq('id', ref)
        .single()
      row = (data as Inscricao | null) ?? null
    } catch {
      row = null
    }
  }

  const pago = row?.status === 'pago'
  const cancelado = row?.status === 'cancelado'

  const Icone = pago ? CheckCircle2 : cancelado ? XCircle : Clock
  const cor = pago
    ? 'text-[#D6FF3F]'
    : cancelado
      ? 'text-[#FF5A1F]'
      : 'text-white'
  const titulo = pago
    ? 'Inscrição confirmada'
    : cancelado
      ? 'Pagamento não concluído'
      : row
        ? 'Inscrição recebida'
        : 'Aguardando confirmação'

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Icone size={56} className={cor} strokeWidth={1.5} />
      <h1 className="mt-6 text-4xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-5xl">
        {titulo}
        <span className="text-[#FF5A1F]">.</span>
      </h1>

      {!row && ref && (
        <p className="mt-5 text-base leading-relaxed text-white/60">
          Não conseguimos localizar esta inscrição no momento. Se você
          concluiu o pagamento, a confirmação chegará por e-mail em instantes.
        </p>
      )}

      {!row && !ref && (
        <p className="mt-5 text-base leading-relaxed text-white/60">
          Se você acabou de pagar via Pix, aguarde alguns instantes — a
          confirmação pode levar até 5 minutos para aparecer. Você receberá
          um e-mail assim que sua vaga for garantida. Pode atualizar esta
          página em instantes ou acessar pelo link enviado no e-mail de
          inscrição.
        </p>
      )}

      {row && pago && (
        <p className="mt-5 text-base leading-relaxed text-white/60">
          Pagamento reconhecido e vaga garantida, {row.nome.split(' ')[0]}!
          Enviamos a confirmação para <strong className="text-white">{row.email}</strong>.
          Obrigado por correr pela causa.
        </p>
      )}

      {row && !pago && !cancelado && (
        <p className="mt-5 text-base leading-relaxed text-white/60">
          Recebemos sua inscrição, {row.nome.split(' ')[0]}. O pagamento
          {row.provider === 'pix' ? ' via Pix' : ''} está sendo
          processado — assim que for reconhecido, sua vaga é confirmada e
          você recebe um e-mail em{' '}
          <strong className="text-white">{row.email}</strong>. Pode atualizar
          esta página em instantes.
        </p>
      )}

      {row && cancelado && (
        <p className="mt-5 text-base leading-relaxed text-white/60">
          O pagamento não foi concluído. Você pode tentar novamente —
          nenhuma cobrança foi efetivada.
        </p>
      )}

      {row && (
        <div className="mt-10 border border-white/10 bg-[#0B0B0C] p-7">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D6FF3F]">
            Resumo da inscrição
          </p>
          <Linha k="Protocolo" v={row.id.slice(0, 8).toUpperCase()} />
          <Linha k="Prova" v={row.distancia} />
          <Linha k="Categoria" v={`${row.genero} · ${row.faixa_etaria}`} />
          <Linha k="Camisa" v={row.tamanho_camisa} />
          <Linha k="Kit" v={row.kit} />
          <Linha
            k="Pagamento"
            v={
              row.provider === 'mercadopago'
                ? 'Mercado Pago (cartão ou Pix)'
                : row.provider === 'pix'
                  ? 'Pix'
                  : 'Cartão de crédito'
            }
          />
          <Linha
            k="Valor"
            v={row.amount_cents != null ? formatBRL(row.amount_cents) : '—'}
          />
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-white/45">Status</span>
            <span
              className={`px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${
                pago
                  ? 'bg-[#D6FF3F] text-black'
                  : cancelado
                    ? 'border border-[#FF5A1F]/40 text-[#FF5A1F]'
                    : 'border border-white/25 text-white/60'
              }`}
            >
              {pago ? 'Confirmado' : cancelado ? 'Não concluído' : 'Aguardando confirmação'}
            </span>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {row && cancelado && (
          <Link
            href="/esportivo/inscricao"
            className="inline-flex items-center justify-center gap-3 bg-[#D6FF3F] px-8 py-4 text-xs font-extrabold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5"
          >
            Tentar novamente
            <ArrowRight size={16} />
          </Link>
        )}
        <Link
          href="/esportivo"
          className="inline-flex items-center justify-center border border-white/25 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-[#D6FF3F] hover:text-[#D6FF3F]"
        >
          Voltar ao evento
        </Link>
      </div>
    </main>
  )
}
