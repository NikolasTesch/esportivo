import type { MetadataRoute } from 'next'

const SITE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://exemplo.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE}/`, lastModified: now },
    { url: `${SITE}/esportivo`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/esportivo/inscricao`, lastModified: now, priority: 0.7 },
  ]
}
