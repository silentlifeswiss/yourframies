import React, { useState, useEffect } from 'react'
import { FolderTree, Plus, Edit2, Trash2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { getStoreCategories, saveStoreCategories, Category } from '../../data/categories'
import { useMedia } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { api } from '../../services/api'

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => getStoreCategories())
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { openMediaPicker } = useMedia()
  const { logAuditAction } = useAdminAuth()

  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Sync latest categories from Neon DB on mount
  useEffect(() => {
    let isMounted = true
    const fetchLatest = async () => {
      try {
        const res = await api.getCategories()
        if (res.success && Array.isArray(res.data) && res.data.length > 0 && isMounted) {
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
    }
  }, [])

  const handleStartCreate = () => {
    setEditingCat(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80')
    setShowModal(true)
  }

  const handleStartEdit = (cat: Category) => {
    setEditingCat(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setImageUrl(cat.imageUrl || '')
    setShowModal(true)
  }

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return
    }

    const nextCats = categories.filter((c) => c.id !== cat.id)
    setCategories(nextCats)
    saveStoreCategories(nextCats)

    try {
      await api.adminDeleteCategory(cat.id)
      logAuditAction('CATEGORY_DELETED', 'CATEGORY', cat.id, `Deleted category ${cat.name}`)
    } catch (err) {
      console.warn('API category delete failed:', err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    setErrorMsg('')

    try {
      if (editingCat) {
        const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const updatedCat: Category = {
          ...editingCat,
          name: name.trim(),
          slug: cleanSlug,
          description: description.trim(),
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        }

        const nextCats = categories.map((c) => (c.id === editingCat.id ? updatedCat : c))
        setCategories(nextCats)
        saveStoreCategories(nextCats)

        await api.adminSaveCategory(updatedCat)
        logAuditAction('CATEGORY_UPDATED', 'CATEGORY', editingCat.id, `Updated category ${name}`)
      } else {
        const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const newCat: Category = {
          id: `cat-${cleanSlug || Date.now()}`,
          name: name.trim(),
          slug: cleanSlug,
          description: description.trim(),
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          itemCount: 0,
          featured: true,
        }

        const nextCats = [...categories, newCat]
        setCategories(nextCats)
        saveStoreCategories(nextCats)

        await api.adminSaveCategory(newCat)
        logAuditAction('CATEGORY_CREATED', 'CATEGORY', newCat.id, `Created category ${name}`)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setShowModal(false)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category to backend.')
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
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden bg-neutral-900">
              <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
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
                <span className="text-[11px] text-neutral-500">{cat.itemCount || 0} Active Items</span>
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
              <label className="block text-neutral-400 font-semibold mb-1">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => openMediaPicker((url) => setImageUrl(url))}
                  className="px-3 py-2 bg-neutral-800 text-amber-400 font-bold rounded-lg"
                >
                  Browse
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
