import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getStoreCategories, syncCategoriesFromApi, Category } from '../../data/categories'
import { getStoreProducts } from '../../data/products'

export const CategoryGrid: React.FC = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => getStoreCategories())
  const [productsList, setProductsList] = useState(() => getStoreProducts())

  useEffect(() => {
    const handleCatUpdate = () => setCategoriesList(getStoreCategories())
    const handleProdUpdate = () => setProductsList(getStoreProducts())
    window.addEventListener('yourframies_categories_updated', handleCatUpdate)
    window.addEventListener('yourframies_products_updated', handleProdUpdate)
    syncCategoriesFromApi().then(setCategoriesList)
    return () => {
      window.removeEventListener('yourframies_categories_updated', handleCatUpdate)
      window.removeEventListener('yourframies_products_updated', handleProdUpdate)
    }
  }, [])

  if (categoriesList.length === 0) {
    return null
  }

  return (
    <section className="py-10 sm:py-16 bg-neutral-950 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 md:mt-0 text-xs font-semibold uppercase tracking-widest text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5 min-h-[36px]"
          >
            <span>View All Frames</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {categoriesList.map((cat) => {
            const count = productsList.filter((p) => p.categoryId === cat.id && p.isActive !== false).length
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative h-48 sm:h-72 rounded-md overflow-hidden bg-neutral-900 flex flex-col justify-end p-3.5 sm:p-6"
              >
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-200 font-medium">
                    {count} {count === 1 ? 'Design' : 'Designs'}
                  </span>
                  <h3 className="font-serif text-base sm:text-2xl font-normal text-white mt-0.5 sm:mt-1 group-hover:translate-x-1 transition-transform leading-snug">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="hidden sm:block text-xs text-neutral-200 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
