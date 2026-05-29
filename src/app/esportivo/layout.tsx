import type { Metadata } from 'next'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { BASE, INSCRICAO, PRECO_LABEL, sections } from './sections'
import { AnimatedNavbar } from './motion'

export const metadata: Metadata = {
  title: {
    default: 'Corrida pela Consciência 2026 — Florianópolis',
    template: '%s — Corrida pela Consciência 2026',
  },
  description:
    '5K, 10K e 21K à beira-mar em apoio ao Instituto Reviva. 12 de julho de 2026, Av. Beira-Mar Norte, Florianópolis/SC. Vagas limitadas por lote.',
}

export default function EsportivoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-archivo lp-grain min-h-screen bg-[#0B0B0C] text-white selection:bg-[#D6FF3F] selection:text-black">
      <AnimatedNavbar>
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href={BASE} className="text-lg font-extrabold uppercase italic tracking-tight">
            Corrida<span className="text-[#D6FF3F]">+</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden flex-1 items-center justify-center gap-7 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 lg:flex">
            {sections.map((s) => (
              <a key={s.id} href={`${BASE}#${s.id}`} className="transition-colors hover:text-[#D6FF3F]">
                {s.navLabel}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile menu — CSS-only via <details> */}
            <details className="group relative lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-center border border-white/20 p-2">
                <Menu size={18} className="group-open:hidden" />
                <X size={18} className="hidden group-open:block" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[200px] border border-white/10 bg-[#0B0B0C] py-2 shadow-2xl">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`${BASE}#${s.id}`}
                    className="block px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-[#D6FF3F]"
                  >
                    {s.navLabel}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/10 px-4 pb-2 pt-3">
                  <Link
                    href={INSCRICAO}
                    className="block bg-[#D6FF3F] py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-black"
                  >
                    Inscrever-se
                  </Link>
                </div>
              </div>
            </details>

            <Link
              href={INSCRICAO}
              className="bg-[#D6FF3F] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-black transition-transform hover:-translate-y-0.5"
            >
              Inscrever-se · {PRECO_LABEL}
            </Link>
          </div>
        </nav>
      </AnimatedNavbar>

      {children}

      <footer className="px-6 py-12 text-white/45">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={BASE} className="text-lg font-extrabold uppercase italic text-white">
            Corrida<span className="text-[#D6FF3F]">+</span>
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            © 2026 Corrida pela Consciência · Em apoio ao Instituto Reviva
          </p>
        </div>
      </footer>
    </div>
  )
}
