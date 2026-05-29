import Link from 'next/link'
import { BASE } from '../sections'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-archivo min-h-screen bg-[#0B0B0C] text-white selection:bg-[#D6FF3F] selection:text-black">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0C]/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href={BASE} className="text-lg font-extrabold uppercase italic tracking-tight">
            Corrida<span className="text-[#D6FF3F]">+</span>
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
            Painel Admin
          </span>
        </nav>
      </header>

      {children}

      <footer className="border-t border-white/10 px-6 py-8 text-white/30">
        <div className="mx-auto max-w-7xl text-center text-xs font-semibold uppercase tracking-[0.2em]">
          © 2026 Corrida pela Consciência · Painel interno
        </div>
      </footer>
    </div>
  )
}
