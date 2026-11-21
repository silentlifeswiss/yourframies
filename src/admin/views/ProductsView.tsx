import React, { useState } from 'react'
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Search,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'
import { INITIAL_PRODUCTS } from '../../data/products'
import { CATEGORIES } from '../../data/categories'
import { formatINR } from '../../utils/formatters'
import { Product } from '../../types'
import { useMedia } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const ProductsView: React.FC = () => {
  const { openMediaPicker } = useMedia()
  const { logAuditAction } = useAdminAuth()
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('cat-car-frames')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState<number>(1499)
  const [comparePrice, setComparePrice] = useState<number>(2199)
  const [stockQuantity, setStockQuantity] = useState<number>(50)
  const [imageUrl, setImageUrl] = useState('')
  const [isCustomizable, setIsCustomizable] = useState(true)
  const [isActive, setIsActive] = useState(true)

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false
    }
    return true
  })

  const handleStartCreate = () => {
    setEditingProduct(null)
    setTitle('')
    setSlug('')
    setCategoryId('cat-car-frames')
    setDescription('')
    setBasePrice(1299)
    setComparePrice(1899)
    setStockQuantity(50)
    setImageUrl('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85')
    setIsCustomizable(true)
    setIsActive(true)
    setIsCreating(true)
  }

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod)
    setTitle(prod.title)
    setSlug(prod.slug)
    setCategoryId(prod.categoryId || 'cat-car-frames')
    setDescription(prod.description)
    setBasePrice(prod.basePriceINR)
    setComparePrice(prod.compareAtPriceINR || 0)
    setStockQuantity(prod.stockQuantity)
    setImageUrl(prod.images[0] || '')
    setIsCustomizable(prod.isCustomizable)
    setIsActive(prod.isActive)
    setIsCreating(true)
  }

  const handleDuplicate = (prod: Product) => {
    const dup: Product = {
      ...prod,
      id: `yf-dup-${Date.now()}`,
      title: `${prod.title} (Copy)`,
      slug: `${prod.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
    }
    setProducts((prev) => [dup, ...prev])
    logAuditAction('PRODUCT_DUPLICATED', 'PRODUCT', dup.id, `Duplicated ${prod.title}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this product permanently?')) {
      const target = products.find((p) => p.id === id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      logAuditAction('PRODUCT_DELETED', 'PRODUCT', id, `Deleted ${target?.title}`)
    }
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    if (editingProduct) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title,
                slug,
                categoryId,
                description,
                basePriceINR: Number(basePrice),
                compareAtPriceINR: Number(comparePrice) || undefined,
                stockQuantity: Number(stockQuantity),
                images: [imageUrl, ...(p.images.slice(1) || [])],
                isCustomizable,
                isActive,
              }
            : p
        )
      )
      logAuditAction('PRODUCT_UPDATED', 'PRODUCT', editingProduct.id, `Updated ${title}`)
    } else {
      // Create
      const newProd: Product = {
        id: `yf-${Date.now()}`,
        title,
        slug,
        categoryId,
        description,
        basePriceINR: Number(basePrice),
        compareAtPriceINR: Number(comparePrice) || undefined,
        stockQuantity: Number(stockQuantity),
        images: [imageUrl],
        availableSizes: ['8x10', '12x18', '16x24', '20x30'],
        availableMouldings: ['Black Wood', 'White Minimalist', 'Natural Oak', 'Walnut'],
        isCustomizable,
        isActive,
      }
      setProducts((prev) => [newProd, ...prev])
      logAuditAction('PRODUCT_CREATED', 'PRODUCT', newProd.id, `Created ${title}`)
    }

    setIsCreating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Catalog Management
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Products & Artwork Inventory</h2>
          <p className="text-xs text-neutral-400">
            Create, duplicate, update prices, manage stock, and toggle store availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Artwork</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or slug..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-neutral-400 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 uppercase tracking-wider text-[10px] text-neutral-400 font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Discount</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-900/40">
                  <td className="py-3 px-4">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-12 h-14 object-cover rounded border border-neutral-800"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{prod.title}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">{prod.slug}</p>
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {CATEGORIES.find((c) => c.id === prod.categoryId)?.name || 'Custom'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white">{formatINR(prod.basePriceINR)}</span>
                    {prod.compareAtPriceINR && (
                      <span className="block text-[10px] text-neutral-500 line-through">
                        {formatINR(prod.compareAtPriceINR)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stockQuantity > 10
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {prod.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.isActive ? 'text-emerald-400' : 'text-neutral-500'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(prod)}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(prod)}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 bg-neutral-800 hover:bg-red-950 text-red-400 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/product/${prod.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-xs shadow-2xl my-8"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingProduct ? 'Edit Product Artwork' : 'Add New Product Artwork'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (!editingProduct) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                    }
                  }}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Base Price (INR)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  Compare At Price (INR)
                </label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Primary Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setImageUrl(url))}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold rounded-lg"
                >
                  Media Library
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Enable Bespoke Customizer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-amber-500"
                />
                <span>Published to Storefront</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider rounded-lg"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
