import React, { useState, useEffect, useRef } from 'react'
import { FolderTree, Plus, Edit2, Trash2, ExternalLink, CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import { getStoreCategories, saveStoreCategories, Category } from '../../data/categories'
import { getStoreProducts } from '../../data/products'
import { useMedia } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { api } from '../../services/api'

const slugify = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => getStoreCategories())
  const [productsCountMap, setProductsCountMap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImg, setIsUploadingImg] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { openMediaPicker, uploadFile } = useMedia()
  const { logAuditAction } = useAdminAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Compute live item counts & sync latest categories from backend
  useEffect(() => {
    const recomputeCounts = () => {
      const prods = getStoreProducts()
      const counts: Record<string, number> = {}
      prods.forEach((p) => {
        if (p.categoryId) {
          counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
        }
      })
      setProductsCountMap(counts)
    }

    recomputeCounts()
    window.addEventListener('yourframies_products_updated', recomputeCounts)

    let isMounted = true
    const fetchLatest = async () => {
      try {
        const res = await api.getCategories()
        if (res.success && Array.isArray(res.data) && isMounted) {
          setCategories(res.data)
          saveStoreCategories(res.data)
        }
      } catch (err) {
        console.warn('Could not fetch categories from server:', err)
      }
    }
    fetchLatest()

    return () => {
      isMounted = false
      window.removeEventListener('yourframies_products_updated', recomputeCounts)
    }
  }, [])

  const handleStartCreate = () => {
    setErrorMsg('')
    setEditingCat(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setShowModal(true)
  }

  const handleStartEdit = (cat: Category) => {
    setErrorMsg('')
    setEditingCat(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setImageUrl(cat.imageUrl || '')
    setShowModal(true)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setIsUploadingImg(true)
    try {
      const item = await uploadFile(file, 'general', name || file.name)
      setImageUrl(item.url)
    } catch {
      setErrorMsg('Failed to process cover image.')
    } finally {
      setIsUploadingImg(false)
    }
  }

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return
    }

    setErrorMsg('')
    try {
      const res = await api.adminDeleteCategory(cat.id)
      if (!res.success && res.message && res.message !== 'Category not found') {
        setErrorMsg(res.message)
        return
      }
      const nextCats = categories.filter((c) => c.id !== cat.id)
      setCategories(nextCats)
      saveStoreCategories(nextCats)
      logAuditAction('CATEGORY_DELETED', 'CATEGORY', cat.id, `Deleted category ${cat.name}`)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete category.')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanSlug = slugify(slug || cleanName)

    if (cleanName.length < 2) {
      setErrorMsg('Category name must be at least 2 characters.')
      return
    }
    if (cleanSlug.length < 2) {
      setErrorMsg('Category slug must be at least 2 characters.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const isEditing = Boolean(editingCat)
      const catPayload: Category = editingCat
        ? {
            ...editingCat,
            name: cleanName,
            slug: cleanSlug,
            description: description.trim(),
            imageUrl: imageUrl.trim(),
          }
        : {
            id: `cat-${cleanSlug}-${Date.now().toString().slice(-4)}`,
            name: cleanName,
            slug: cleanSlug,
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            itemCount: 0,
            featured: true,
          }

      const res = await api.adminSaveCategory(catPayload, isEditing)
      if (!res.success) {
        setErrorMsg(res.message || 'Could not save category to database. Try signing in again.')
        setIsLoading(false)
        return
      }

      const finalCat = res.data ? { ...catPayload, ...res.data } : catPayload
      const nextCats = isEditing
        ? categories.map((c) => (c.id === editingCat!.id ? finalCat : c))
        : [...categories, finalCat]

      setCategories(nextCats)
      saveStoreCategories(nextCats)
      logAuditAction(
        isEditing ? 'CATEGORY_UPDATED' : 'CATEGORY_CREATED',
        'CATEGORY',
        finalCat.id,
        `${isEditing ? 'Updated' : 'Created'} category ${cleanName}`
      )

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setShowModal(false)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error while saving category.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Category changes saved and synced across all product catalogs.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Taxonomy & Navigation
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Product Categories</h2>
          <p className="text-xs text-neutral-400">
            Manage your store collections, category slugs, descriptive banners, and featured showcases.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 p-10 bg-neutral-950/70 border border-dashed border-neutral-800 rounded-2xl text-center space-y-2">
            <FolderTree className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No categories created yet</p>
            <p className="text-xs text-neutral-400">
              Click "New Category" above to add your first store collection.
            </p>
          </div>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden bg-neutral-900">
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center">
                  <FolderTree className="w-10 h-10 text-neutral-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                  {cat.slug}
                </span>
                <h3 className="text-base font-bold text-white">{cat.name}</h3>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-neutral-400 line-clamp-2">{cat.description}</p>
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-neutral-400">
                  {productsCountMap[cat.id] ?? cat.itemCount ?? 0} Active Items
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-400 rounded transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded"
                    title="View on store"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {editingCat ? 'Edit Category' : 'Create Category'}
            </h3>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!editingCat) {
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

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Cover Image (Optional)</label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste URL, upload file, or browse library..."
                  className="flex-1 min-w-[180px] p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-[11px]"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImg}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingImg ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setImageUrl(url))}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold rounded-lg"
                >
                  Library
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
