import { NavbarSection } from '@/types/landing'

interface Props {
  data: NavbarSection
}

export function Navbar({ data }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href={data.logo.href} className="text-xl font-bold text-gray-900 tracking-tight">
            {data.logo.text}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {data.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {data.cta && (
            <a
              href={data.cta.href}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {data.cta.label}
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}
