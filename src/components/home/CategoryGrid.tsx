import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../../data/categories'

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Curated Catalog
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 md:mt-0 text-xs font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors flex items-center gap-1.5"
          >
            <span>View All Frames</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-52 sm:h-80 rounded-sm overflow-hidden bg-neutral-200 flex flex-col justify-end p-3.5 sm:p-6"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-300 font-medium">
                  {cat.itemCount} Designs Available
                </span>
                <h3 className="font-serif text-sm sm:text-2xl font-light text-white mt-0.5 sm:mt-1 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="hidden sm:block text-xs text-neutral-300 mt-2 line-clamp-2 font-light">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
