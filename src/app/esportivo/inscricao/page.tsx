import type { Metadata } from 'next'
import Link from 'next/link'
import { TAMANHOS, formatBRL, PRECO_BASE_CENTS } from '@/lib/esportivo'
import { InscricaoForm } from './InscricaoForm'
import { FadeIn, HeroBody, HeroHeading, SectionLabel } from '../motion'

export const metadata: Metadata = {
  title: 'Inscrição — Corrida pela Consciência 2026',
  description:
    'Escolha sua categoria, o tamanho da camisa e finalize a inscrição da Corrida pela Consciência 2026 em Florianópolis.',
}

function TabelaTamanhos({
  titulo,
  linhas,
}: {
  titulo: string
  linhas: { tamanho: string; busto: string; comprimento: string }[]
}) {
  return (
    <div className="border border-white/10">
      <p className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D6FF3F]">
        {titulo}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
            <th className="px-4 py-3">Tamanho</th>
            <th className="px-4 py-3">Busto (cm)</th>
            <th className="px-4 py-3">Compr. (cm)</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.tamanho} className="border-t border-white/10 text-white/70">
              <td className="px-4 py-3 font-bold text-white">{l.tamanho}</td>
              <td className="px-4 py-3 tabular-nums">{l.busto}</td>
              <td className="px-4 py-3 tabular-nums">{l.comprimento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function InscricaoPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <FadeIn y={8} className="mb-10">
        <nav
          aria-label="Trilha"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45"
        >
          <Link href="/esportivo" className="hover:text-[#D6FF3F]">
            Corrida pela Consciência
          </Link>
          <span className="px-2">/</span>
          <span className="text-white">Inscrição</span>
        </nav>
      </FadeIn>

      <HeroHeading className="text-4xl font-extrabold uppercase italic leading-[0.95] tracking-tight sm:text-6xl">
        Garanta sua vaga<span className="text-[#FF5A1F]">.</span>
      </HeroHeading>

      <HeroBody className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
        Inscrição única de{' '}
        <strong className="text-white">{formatBRL(PRECO_BASE_CENTS)}</strong> —
        com kit Básico completo. Escolha sua categoria e o tamanho da camisa;
        tudo é confirmado assim que o pagamento for reconhecido.
      </HeroBody>

      <FadeIn delay={0.15} className="mt-12">
        <section>
          <SectionLabel className="mb-5 text-sm font-extrabold uppercase tracking-[0.25em] text-[#D6FF3F]">
            Tabela de tamanhos
          </SectionLabel>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            <div className="bg-[#0B0B0C] p-1">
              <TabelaTamanhos titulo="Masculino" linhas={TAMANHOS.masculino} />
            </div>
            <div className="bg-[#0B0B0C] p-1">
              <TabelaTamanhos titulo="Feminino · baby look" linhas={TAMANHOS.feminino} />
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Medidas aproximadas. Em caso de dúvida entre dois tamanhos, opte
            pelo maior.
          </p>
        </section>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-14">
        <section>
          <InscricaoForm />
        </section>
      </FadeIn>
    </main>
  )
}
