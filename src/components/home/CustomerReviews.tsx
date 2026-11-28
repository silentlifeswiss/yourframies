import React from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { REVIEWS } from '../../data/reviews'

export const CustomerReviews: React.FC = () => {
  if (REVIEWS.length === 0) return null

  return (
    <section className="py-12 sm:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Real Customer Stories
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-1">
            Loved in 10,000+ Indian Homes
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-2 sm:mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-semibold text-neutral-800 ml-1.5">4.9 / 5.0 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-6 bg-neutral-50 rounded-xl border border-neutral-200/60 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="text-xs font-bold text-neutral-900 mb-2">"{rev.title}"</h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{rev.comment}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                <div>
                  <p className="font-semibold text-neutral-900 flex items-center gap-1">
                    {rev.author}
                    {rev.verifiedBuyer && (
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    )}
                  </p>
                  <p className="text-neutral-400">{rev.city} • {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
