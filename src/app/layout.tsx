import type { Metadata } from 'next'
import './globals.css'
import { fontVariables } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Atelier de Landing Pages — Modelos por segmento',
  description:
    'Showcase de três linguagens visuais distintas: clínica estética, barbearia heritage e evento esportivo. Cada uma com seu próprio sistema de design.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
