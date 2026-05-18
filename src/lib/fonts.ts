import {
  Inter,
  Fraunces,
  Oswald,
  Archivo,
  Space_Grotesk,
  Bricolage_Grotesque,
  Anton,
  Spectral,
} from 'next/font/google'

// Corpo neutro compartilhado por todos os templates
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Clínica estética — serifa display editorial
export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

// Barbearia — condensada heritage
export const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// Esportivo — grotesca atlética
export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['400', '600', '800', '900'],
})

// Educacional — geométrica de catálogo
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Comunitário — display expressiva
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

// Academia — condensada pesada
export const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
  weight: ['400'],
})

// Clínica médica — serifa sóbria
export const spectral = Spectral({
  subsets: ['latin'],
  variable: '--font-spectral',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const fontVariables = [
  inter.variable,
  fraunces.variable,
  oswald.variable,
  archivo.variable,
  spaceGrotesk.variable,
  bricolage.variable,
  anton.variable,
  spectral.variable,
].join(' ')
