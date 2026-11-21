import React, { useState } from 'react'
import { FolderTree, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { CATEGORIES as INITIAL_CATS, Category } from '../../data/categories'
import { useMedia } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATS)
  const { openMediaPicker } = useMedia()
  const { logAuditAction } = useAdminAuth()

  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleStartCreate = () => {
    setEditingCat(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setShowModal(true)
  }

  const handleStartEdit = (cat: Category) => {
    setEditingCat(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description)
    setImageUrl(cat.imageUrl)
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCat.id ? { ...c, name, slug, description, imageUrl } : c
        )
      )
      logAuditAction('CATEGORY_UPDATED', 'CATEGORY', editingCat.id, `Updated category ${name}`)
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        imageUrl,
        itemCount: 0,
        featured: true,
      }
      setCategories((prev) => [...prev, newCat])
      logAuditAction('CATEGORY_CREATED', 'CATEGORY', newCat.id, `Created category ${name}`)
    }

    setShowModal(false)
  }

  return (
    <div className="space-y-6">
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
                <span className="text-[11px] text-neutral-500">{cat.itemCount} Active Items</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
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
                className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider rounded-lg"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
