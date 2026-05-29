import Link from 'next/link'
import { XCircle } from 'lucide-react'

export const metadata = {
  title: 'Pagamento cancelado',
}

export default function CanceladoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-6 font-[family-name:var(--font-inter)]">
      <div className="max-w-md text-center">
        <XCircle size={48} className="mx-auto text-[#1A1A1A]/40" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-semibold text-[#1A1A1A]">
          Pagamento não concluído
        </h1>
        <p className="mt-4 text-[#5D6D7E]">
          Nenhuma cobrança foi efetuada. Você pode tentar novamente quando quiser.
        </p>
        <Link
          href="/contratar"
          className="mt-8 inline-flex items-center gap-2 bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          Tentar novamente
        </Link>
        <p className="mt-4 text-xs text-[#5D6D7E]">
          Dúvidas?{' '}
          <Link href="/" className="underline hover:text-[#1A1A1A]">
            Voltar ao início
          </Link>
        </p>
      </div>
    </main>
  )
}
