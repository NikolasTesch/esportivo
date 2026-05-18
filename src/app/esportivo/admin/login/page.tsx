import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAuthed } from '@/lib/admin-auth'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Painel ADM — Login',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const jar = await cookies()
  if (isAuthed(jar.get(ADMIN_COOKIE)?.value)) redirect('/esportivo/admin')

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-20">
      <h1 className="text-3xl font-extrabold uppercase italic tracking-tight">
        Painel ADM<span className="text-[#FF5A1F]">.</span>
      </h1>
      <p className="mb-8 mt-3 text-sm text-white/55">
        Acesso restrito à organização da corrida.
      </p>
      <LoginForm />
    </main>
  )
}
