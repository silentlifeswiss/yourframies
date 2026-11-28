import React, { useState, useEffect } from 'react'
import { getStoreProducts, syncProductsFromApi } from '../../data/products'
import { ProductCard } from '../product/ProductCard'

export const ProductCarousel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new-arrivals'>('bestsellers')
  const [productsList, setProductsList] = useState(() => getStoreProducts())

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoreProducts())
    window.addEventListener('yourframies_products_updated', handleUpdate)
    syncProductsFromApi().then(setProductsList)
    return () => window.removeEventListener('yourframies_products_updated', handleUpdate)
  }, [])

  const activeProducts = productsList.filter((p) => p.isActive !== false)
  const productsToShow =
    activeTab === 'bestsellers'
      ? activeProducts.slice(0, 4)
      : activeProducts.slice(4, 8).length > 0
      ? activeProducts.slice(4, 8)
      : activeProducts.slice(0, 4)

  return (
    <section className="py-10 sm:py-16 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Popular Picks
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white mt-1">
              Popular A4 Frames
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-white/10 rounded-full border border-white/20 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Bestsellers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                activeTab === 'new-arrivals'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid - 2 cols on mobile */}
        {productsToShow.length === 0 ? (
          <div className="py-14 px-6 bg-white/5 border border-dashed border-white/20 rounded-xl text-center">
            <p className="text-sm font-semibold text-neutral-200">Catalog coming soon</p>
            <p className="text-xs text-neutral-400 mt-1">
              Frames published in the Admin Panel will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {productsToShow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
