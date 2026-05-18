import Link from 'next/link'

export const metadata = {
  title: 'Pagamento confirmado',
}

export default function SucessoPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 font-[family-name:var(--font-inter)]">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-[#16A34A]">
          Pagamento confirmado
        </h1>
        <p className="mt-4 text-[#5D6D7E]">
          Obrigado! Recebemos seu pagamento e enviamos a confirmação por email.
          Em breve entraremos em contato para dar continuidade ao projeto.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-[#1A1A1A] px-6 py-3 font-medium text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
