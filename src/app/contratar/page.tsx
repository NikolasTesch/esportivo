import { PricingSection } from '@/components/PricingSection'

export const metadata = {
  title: 'Contratar — Atelier de Landing Pages',
  description: 'Escolha entre pagamento único ou assinatura.',
}

export default function ContratarPage() {
  return (
    <main className="min-h-screen bg-white font-[family-name:var(--font-inter)]">
      <PricingSection />
    </main>
  )
}
