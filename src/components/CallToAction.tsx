import { ArrowRight } from 'lucide-react'
import { CtaSection } from '@/types/landing'

interface Props {
  data: CtaSection
}

export function CallToAction({ data }: Props) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center bg-indigo-600 rounded-3xl py-16 px-8 shadow-xl shadow-indigo-200">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          {data.headline}
        </h2>
        <p className="text-lg text-indigo-200 mb-10 max-w-xl mx-auto leading-relaxed">
          {data.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={data.primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition-colors"
          >
            {data.primaryCta.label}
            <ArrowRight size={18} />
          </a>

          {data.secondaryCta && (
            <a
              href={data.secondaryCta.href}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-indigo-400 rounded-xl hover:border-white transition-colors"
            >
              {data.secondaryCta.label}
            </a>
          )}
        </div>

        {data.note && (
          <p className="mt-6 text-sm text-indigo-300">{data.note}</p>
        )}
      </div>
    </section>
  )
}
