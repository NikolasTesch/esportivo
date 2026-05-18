import { FooterSection } from '@/types/landing'

interface Props {
  data: FooterSection
}

export function Footer({ data }: Props) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg tracking-tight">{data.logo}</p>
            {data.tagline && (
              <p className="text-sm mt-1 max-w-xs leading-relaxed">{data.tagline}</p>
            )}
          </div>

          {data.links && data.links.length > 0 && (
            <nav className="flex flex-wrap items-center gap-6">
              {data.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          {data.copyright}
        </div>
      </div>
    </footer>
  )
}
