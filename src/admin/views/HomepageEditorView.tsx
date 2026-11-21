import React, { useState } from 'react'
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { useSiteContent, HomepageSection } from '../../context/SiteContentContext'
import { useMedia } from '../../context/MediaContext'

export const HomepageEditorView: React.FC = () => {
  const {
    homepageSections,
    reorderSection,
    toggleSectionVisibility,
    updateSection,
    deleteSection,
    addSection,
    publishChanges,
    discardDraft,
    hasUnpublishedChanges,
    resetToDefaults,
  } = useSiteContent()

  const { openMediaPicker } = useMedia()

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New Section Form
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newType, setNewType] = useState<HomepageSection['type']>('custom_banner')
  const [newBg, setNewBg] = useState<HomepageSection['backgroundStyle']>('neutral-50')
  const [newCtaText, setNewCtaText] = useState('')
  const [newCtaLink, setNewCtaLink] = useState('')
  const [newImage, setNewImage] = useState('')

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    addSection({
      type: newType,
      title: newTitle,
      subtitle: newSubtitle,
      backgroundStyle: newBg,
      isActive: true,
      imageUrl: newImage,
      ctaText: newCtaText,
      ctaLink: newCtaLink,
    })

    setShowAddModal(false)
    setNewTitle('')
    setNewSubtitle('')
    setNewCtaText('')
    setNewCtaLink('')
    setNewImage('')
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Visual Block CMS
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Homepage Section Manager</h2>
          <p className="text-xs text-neutral-400">
            Reorder, toggle, and customize every section of your public homepage without touching source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {homepageSections.map((sec, index) => {
          const isEditing = editingSectionId === sec.id

          return (
            <div
              key={sec.id}
              className={`p-5 rounded-xl border transition-all ${
                sec.isActive
                  ? 'bg-neutral-950/80 border-neutral-800'
                  : 'bg-neutral-950/40 border-neutral-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Order controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderSection(index, index - 1)}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === homepageSections.length - 1}
                      onClick={() => reorderSection(index, index + 1)}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-500 font-bold">#{index + 1}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300">
                        {sec.type}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{sec.title}</h4>
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{sec.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Section Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      sec.isActive
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                    title={sec.isActive ? 'Hide on live store' : 'Display on live store'}
                  >
                    {sec.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{sec.isActive ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSectionId(isEditing ? null : sec.id)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isEditing ? 'Close' : 'Edit Content'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove section "${sec.title}"?`)) deleteSection(sec.id)
                    }}
                    className="p-2 bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 rounded-lg"
                    title="Delete section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inline Editor Form */}
              {isEditing && (
                <div className="mt-5 pt-5 border-t border-neutral-800 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Section Title</label>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                        className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">
                        Background Tone
                      </label>
                      <select
                        value={sec.backgroundStyle}
                        onChange={(e) =>
                          updateSection(sec.id, { backgroundStyle: e.target.value as any })
                        }
                        className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
                      >
                        <option value="white">Crisp White</option>
                        <option value="neutral-50">Warm Off-White / Cream</option>
                        <option value="neutral-900">Dark Gallery Contrast</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">
                      Subtitle / Descriptive Text
                    </label>
                    <textarea
                      rows={2}
                      value={sec.subtitle || ''}
                      onChange={(e) => updateSection(sec.id, { subtitle: e.target.value })}
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  {sec.imageUrl !== undefined && (
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Image Asset</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sec.imageUrl || ''}
                          onChange={(e) => updateSection(sec.id, { imageUrl: e.target.value })}
                          placeholder="Image URL"
                          className="flex-1 p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => updateSection(sec.id, { imageUrl: url }))}
                          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold rounded-lg"
                        >
                          Choose from Library
                        </button>
                      </div>
                    </div>
                  )}

                  {sec.ctaText !== undefined && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Button Text</label>
                        <input
                          type="text"
                          value={sec.ctaText || ''}
                          onChange={(e) => updateSection(sec.id, { ctaText: e.target.value })}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Button Link</label>
                        <input
                          type="text"
                          value={sec.ctaLink || ''}
                          onChange={(e) => updateSection(sec.id, { ctaLink: e.target.value })}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingSectionId(null)}
                      className="px-4 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-md"
                    >
                      Done Editing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateSection}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Create New Homepage Section
            </h3>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Section Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
              >
                <option value="custom_banner">Custom Promotional Banner</option>
                <option value="categories">Category Showcase</option>
                <option value="bestsellers">Product Highlights</option>
                <option value="why_choose_us">Why Choose Us Pillars</option>
                <option value="instagram">Instagram Showcase</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Autumn Automotive Collection"
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Subtitle</label>
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Brief description"
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">CTA Button</label>
                <input
                  type="text"
                  value={newCtaText}
                  onChange={(e) => setNewCtaText(e.target.value)}
                  placeholder="e.g. Shop Now"
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">CTA Route</label>
                <input
                  type="text"
                  value={newCtaLink}
                  onChange={(e) => setNewCtaLink(e.target.value)}
                  placeholder="/shop"
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider rounded-lg"
              >
                Insert Section
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
