'use client'

export function LogoutButton() {
  async function logout() {
    await fetch('/api/esportivo/admin/logout', { method: 'POST' })
    window.location.href = '/esportivo/admin/login'
  }
  return (
    <button
      onClick={logout}
      className="border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
    >
      Sair
    </button>
  )
}
