import { FeaturesSection } from '@/types/landing'
import { getIcon } from '@/lib/icons'

interface Props {
  data: FeaturesSection
}

export function Features({ data }: Props) {
  return (
    <section id="funcionalidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {data.badge && (
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full mb-4 border border-indigo-100">
              {data.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((feature) => {
            const Icon = getIcon(feature.icon)
            return (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Icon size={22} className="text-indigo-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
