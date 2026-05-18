import Link from 'next/link'
import { BASE, INSCRICAO, PRECO_LABEL, sections } from './sections'

export default function EsportivoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-archivo lp-grain min-h-screen bg-[#0B0B0C] text-white selection:bg-[#D6FF3F] selection:text-black">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0C]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link href={BASE} className="text-lg font-extrabold uppercase italic tracking-tight">
            Corrida<span className="text-[#D6FF3F]">+</span>
          </Link>
          <div className="hidden flex-1 items-center justify-center gap-7 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 lg:flex">
            {sections.map((s) => (
              <a key={s.id} href={`${BASE}#${s.id}`} className="transition-colors hover:text-[#D6FF3F]">
                {s.navLabel}
              </a>
            ))}
          </div>
          <Link
            href={INSCRICAO}
            className="bg-[#D6FF3F] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5"
          >
            Inscrever-se · {PRECO_LABEL}
          </Link>
        </nav>
      </header>

      {children}

      <footer className="px-6 py-12 text-white/45">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={BASE} className="text-lg font-extrabold uppercase italic text-white">
            Corrida<span className="text-[#D6FF3F]">+</span>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            © 2026 Corrida pela Consciência · Em apoio ao Instituto Reviva
          </p>
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-white">
            ← Modelos
          </Link>
        </div>
      </footer>
    </div>
  )
}
