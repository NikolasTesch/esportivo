import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAuthed } from '@/lib/admin-auth'
import { getSupabase, type Inscricao } from '@/lib/supabase'
import { LogoutButton } from './LogoutButton'
import { AdminDashboard } from './AdminDashboard'

export const metadata: Metadata = {
  title: 'Painel ADM — Pagamentos',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

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

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 pt-16">
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

      {dbError && (
        <p className="mx-auto mt-8 max-w-7xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-6 py-3 text-sm text-[#FF5A1F]">
          {dbError}. Verifique as variáveis do Supabase e se o schema foi
          aplicado.
        </p>
      )}

      <AdminDashboard rows={rows} />
    </>
  )
}
