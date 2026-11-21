import React, { useState, useEffect, useRef } from 'react'
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
  Star,
  X,
  FileImage,
} from 'lucide-react'
import { getStoreProducts, saveStoreProducts } from '../../data/products'
import { CATEGORIES } from '../../data/categories'
import { formatINR } from '../../utils/formatters'
import { Product } from '../../types'
import { useMedia } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const ProductsView: React.FC = () => {
  const { openMediaPicker, uploadFile } = useMedia()
  const { logAuditAction } = useAdminAuth()
  const [products, setProducts] = useState<Product[]>(() => getStoreProducts())
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('cat-car-frames')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState<number>(1499)
  const [comparePrice, setComparePrice] = useState<number>(2199)
  const [stockQuantity, setStockQuantity] = useState<number>(50)
  const [productImages, setProductImages] = useState<string[]>([])
  const [manualUrl, setManualUrl] = useState('')
  const [isCustomizable, setIsCustomizable] = useState(true)
  const [isActive, setIsActive] = useState(true)

  // Save to persistent storage whenever products change
  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts)
    saveStoreProducts(newProducts)
  }

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
    setProductImages([
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85',
    ])
    setManualUrl('')
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
    setProductImages(prod.images && prod.images.length > 0 ? [...prod.images] : [])
    setManualUrl('')
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
    const updated = [dup, ...products]
    updateProductsState(updated)
    logAuditAction('PRODUCT_DUPLICATED', 'PRODUCT', dup.id, `Duplicated ${prod.title}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this product permanently?')) {
      const target = products.find((p) => p.id === id)
      const updated = products.filter((p) => p.id !== id)
      updateProductsState(updated)
      logAuditAction('PRODUCT_DELETED', 'PRODUCT', id, `Deleted ${target?.title}`)
    }
  }

  // Handle local file uploads (multiple images supported)
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    setIsUploading(true)

    const newUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue

      try {
        const item = await uploadFile(file, 'automotive', title || file.name)
        newUrls.push(item.url)
      } catch (err) {
        console.error('Failed to upload file:', err)
      }
    }

    if (newUrls.length > 0) {
      setProductImages((prev) => [...prev, ...newUrls])
    }
    setIsUploading(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      setProductImages((prev) => [...prev, manualUrl.trim()])
      setManualUrl('')
    }
  }

  const handleSetPrimaryImage = (index: number) => {
    setProductImages((prev) => {
      const copy = [...prev]
      const selected = copy.splice(index, 1)[0]
      return [selected, ...copy]
    })
  }

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) return

    const finalImages =
      productImages.length > 0
        ? productImages
        : ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85']

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
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
              images: finalImages,
              isCustomizable,
              isActive,
            }
          : p
      )
      updateProductsState(updated)
      logAuditAction('PRODUCT_UPDATED', 'PRODUCT', editingProduct.id, `Updated ${title} with ${finalImages.length} images`)
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
        images: finalImages,
        availableSizes: ['8x10', '12x18', '16x24', '20x30'],
        availableMouldings: ['Black Wood', 'White Minimalist', 'Natural Oak', 'Walnut'],
        isCustomizable,
        isActive,
      }
      const updated = [newProd, ...products]
      updateProductsState(updated)
      logAuditAction('PRODUCT_CREATED', 'PRODUCT', newProd.id, `Created ${title} with ${finalImages.length} images`)
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
            Upload custom artwork images, update prices, manage inventory, and toggle store availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Artwork</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 outline-none"
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
                <th className="py-3 px-4">Artwork</th>
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
                    <div className="relative group w-12 h-14">
                      <img
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80'}
                        alt=""
                        className="w-12 h-14 object-cover rounded border border-neutral-800"
                      />
                      {prod.images.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-neutral-950/90 text-amber-400 text-[9px] px-1 font-mono rounded-tl border-t border-l border-neutral-800">
                          +{prod.images.length - 1}
                        </span>
                      )}
                    </div>
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
            className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-xs shadow-2xl my-8"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                <span>{editingProduct ? 'Edit Product Artwork' : 'Add New Product Artwork'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Image Upload Box */}
            <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-neutral-200 font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Product Artwork Images ({productImages.length} uploaded)</span>
                </label>
                <span className="text-[11px] text-neutral-400">First image is primary cover</span>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 rounded-full bg-neutral-800 text-amber-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">
                      {isUploading
                        ? 'Uploading & Optimizing image...'
                        : 'Click to upload your image from computer, or drag and drop'}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Supports JPG, PNG, WEBP high-resolution photographs
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Thumbnails Preview */}
              {productImages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Gallery Previews:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {productImages.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 group ${
                          idx === 0 ? 'border-amber-400 shadow-md ring-1 ring-amber-400/50' : 'border-neutral-800'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />

                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-400 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                            <Star className="w-2.5 h-2.5 fill-neutral-950" /> Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-1.5 py-0.5 bg-amber-500 text-neutral-950 text-[9px] font-bold rounded"
                              title="Set as primary cover"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px]"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative: Media Library Picker or Direct URL */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-neutral-800/80">
                <input
                  type="text"
                  placeholder="Or paste external image URL..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-[11px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg"
                >
                  Add URL
                </button>
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setProductImages((prev) => [...prev, url]))}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <FileImage className="w-3.5 h-3.5" />
                  Media Library
                </button>
              </div>
            </div>

            {/* Title & Slug */}
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
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
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
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Base Price (INR)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
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
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-amber-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
                <span>Enable Bespoke Customizer & Photo Uploads</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
                <span>Published to Storefront</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition"
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
