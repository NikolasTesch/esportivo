import type { Metadata } from 'next'
import { Hero, DepoimentosEsporte, CtaFinal, sections } from './sections'

export const metadata: Metadata = {
  title: 'Corrida pela Consciência 2026 — 5K · 10K · 21K · Florianópolis',
  description:
    'Corrida beneficente pela saúde mental. 12 de julho de 2026, Florianópolis. Três distâncias à beira-mar, kit completo e parte da renda ao Instituto Reviva. Inscrições abertas.',
}

export default function EsportivoPage() {
  return (
    <>
      <Hero />
      {sections.map(({ id, Section }, i) => (
        <div key={id}>
          <Section />
          {i === sections.length - 1 && <DepoimentosEsporte />}
        </div>
      ))}
      <CtaFinal />
    </>
  )
}
