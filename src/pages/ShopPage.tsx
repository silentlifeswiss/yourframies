import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { getStoreProducts, syncProductsFromApi } from '../data/products'
import { getStoreCategories, syncCategoriesFromApi, Category } from '../data/categories'
import { ProductCard } from '../components/product/ProductCard'

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategorySlug = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''

  const [productsList, setProductsList] = useState(() => getStoreProducts())
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => getStoreCategories())

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoreProducts())
    const handleCatUpdate = () => setCategoriesList(getStoreCategories())

    window.addEventListener('yourframies_products_updated', handleUpdate)
    window.addEventListener('yourframies_categories_updated', handleCatUpdate)

    syncProductsFromApi().then(setProductsList)
    syncCategoriesFromApi().then(setCategoriesList)

    return () => {
      window.removeEventListener('yourframies_products_updated', handleUpdate)
      window.removeEventListener('yourframies_categories_updated', handleCatUpdate)
    }
  }, [])

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured')
  const [selectedSize, setSelectedSize] = useState<string>('all')

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (product.isActive === false) return false

      // Category Filter
      if (activeCategorySlug !== 'all') {
        const cat = categoriesList.find((c) => c.slug === activeCategorySlug)
        if (cat && product.categoryId !== cat.id) return false
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = product.title.toLowerCase().includes(q)
        const matchesDesc = product.description.toLowerCase().includes(q)
        if (!matchesTitle && !matchesDesc) return false
      }

      // Finish / Size Filter
      if (selectedSize !== 'all') {
        const matchesMoulding = product.availableMouldings.includes(selectedSize)
        const matchesSize = product.availableSizes.includes(selectedSize)
        if (!matchesMoulding && !matchesSize) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceINR - b.basePriceINR
      if (sortBy === 'price-desc') return b.basePriceINR - a.basePriceINR
      if (sortBy === 'name') return a.title.localeCompare(b.title)
      return 0
    })
  }, [productsList, categoriesList, activeCategorySlug, searchQuery, sortBy, selectedSize])

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', slug)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="border-b border-neutral-200 pb-5 sm:pb-8 mb-5 sm:mb-8">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Catalog & Artworks
          </span>
          <h1 className="font-serif text-2xl sm:text-5xl text-neutral-900 mt-1">
            {activeCategorySlug === 'all'
              ? 'All A4 Framed Prints'
              : categoriesList.find((c) => c.slug === activeCategorySlug)?.name || 'Collection'}
          </h1>
          {searchQuery && (
            <p className="mt-1.5 text-xs text-neutral-500">
              Showing search results for "<strong className="text-neutral-900">{searchQuery}</strong>" (
              {filteredProducts.length} items)
            </p>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 mb-5 sm:mb-8 scrollbar-none touch-scroll">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategorySlug === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            All Collections
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategorySlug === cat.slug
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filters and Sorting Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 mb-6 sm:mb-8 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full text-base sm:text-xs bg-neutral-50 border border-neutral-300 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All Finishes (A4 Frame)</option>
              <option value="Deep Black">Deep Black</option>
              <option value="Minimalist White">Minimalist White</option>
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-base sm:text-xs bg-neutral-50 border border-neutral-300 rounded px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-neutral-200">
            <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800">No frames found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search query, or resetting sizes.
            </p>
            <button
              type="button"
              onClick={() => {
                handleCategoryChange('all')
                setSearchParams({})
                setSelectedSize('all')
              }}
              className="mt-5 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
