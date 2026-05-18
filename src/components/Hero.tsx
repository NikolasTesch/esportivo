import { ArrowRight } from 'lucide-react'
import { HeroSection } from '@/types/landing'

interface Props {
  data: HeroSection
}

export function Hero({ data }: Props) {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {data.badge && (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full mb-6 border border-indigo-100">
            {data.badge}
          </span>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
          {data.headline}
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {data.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={data.primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            {data.primaryCta.label}
            <ArrowRight size={18} />
          </a>

          {data.secondaryCta && (
            <a
              href={data.secondaryCta.href}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {data.secondaryCta.label}
            </a>
          )}
        </div>

        {data.image && (
          <div className="mt-16 relative">
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
            <img
              src={data.image}
              alt="Prévia do produto"
              className="rounded-2xl shadow-2xl border border-gray-100 w-full"
            />
          </div>
        )}
      </div>
    </section>
  )
}
