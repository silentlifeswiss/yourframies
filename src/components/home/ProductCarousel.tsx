import React, { useState, useEffect } from 'react'
import { getStoreProducts } from '../../data/products'
import { ProductCard } from '../product/ProductCard'

export const ProductCarousel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new-arrivals'>('bestsellers')
  const [productsList, setProductsList] = useState(() => getStoreProducts())

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoreProducts())
    window.addEventListener('yourframies_products_updated', handleUpdate)
    return () => window.removeEventListener('yourframies_products_updated', handleUpdate)
  }, [])

  const productsToShow =
    activeTab === 'bestsellers'
      ? productsList.slice(0, 4)
      : productsList.slice(4, 8)

  return (
    <section className="py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Popular Picks
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              Curated for Modern Spaces
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-full border border-neutral-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('bestsellers')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              Bestsellers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full transition-all ${
                activeTab === 'new-arrivals'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
