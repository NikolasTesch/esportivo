import { Star } from 'lucide-react'
import { TestimonialsSection } from '@/types/landing'

interface Props {
  data: TestimonialsSection
}

export function Testimonials({ data }: Props) {
  return (
    <section id="depoimentos" className="py-20 px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.author}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-gray-700 leading-relaxed text-sm mb-6 flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                    {item.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.author}</p>
                  <p className="text-gray-500 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
