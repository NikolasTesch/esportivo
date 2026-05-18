import Link from 'next/link'

export const metadata = {
  title: 'Pagamento cancelado',
}

export default function CanceladoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 font-[family-name:var(--font-inter)]">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">
          Pagamento cancelado
        </h1>
        <p className="mt-4 text-[#5D6D7E]">
          Nenhuma cobrança foi feita. Você pode tentar novamente quando quiser.
        </p>
        <Link
          href="/contratar"
          className="mt-8 inline-block rounded-xl bg-[#dd0b0e] px-6 py-3 font-medium text-white"
        >
          Tentar novamente
        </Link>
      </div>
    </main>
  )
}
