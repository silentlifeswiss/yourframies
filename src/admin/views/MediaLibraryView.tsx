import React, { useState } from 'react'
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Search, Filter } from 'lucide-react'
import { useMedia, MediaItem } from '../../context/MediaContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const MediaLibraryView: React.FC = () => {
  const { media, uploadFile, deleteMedia, updateMedia } = useMedia()
  const { logAuditAction } = useAdminAuth()

  const [activeFolder, setActiveFolder] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const folders: { id: string; label: string }[] = [
    { id: 'all', label: 'All Media' },
    { id: 'automotive', label: 'Automotive Frames' },
    { id: 'aesthetic', label: 'Aesthetic Prints' },
    { id: 'materials', label: 'Materials & Wood' },
    { id: 'banners', label: 'Banners & Hero' },
    { id: 'general', label: 'General Assets' },
  ]

  const filtered = media.filter((item) => {
    if (activeFolder !== 'all' && item.folder !== activeFolder) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!item.filename.toLowerCase().includes(q) && !item.altText.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const uploaded = await uploadFile(
        file,
        activeFolder === 'all' ? 'general' : (activeFolder as any)
      )
      setIsUploading(false)
      logAuditAction('MEDIA_UPLOADED', 'MEDIA', uploaded.id, `Uploaded ${uploaded.filename}`)
    }
  }

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this media asset from the central library?')) {
      deleteMedia(id)
      if (selectedItem?.id === id) setSelectedItem(null)
      logAuditAction('MEDIA_DELETED', 'MEDIA', id, 'Deleted asset')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Central Assets
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Media Library ({media.length} Files)</h2>
          <p className="text-xs text-neutral-400">
            Upload, preview, organize into folders, and reference images across products and homepage sections.
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-md">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Optimizing...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Folder Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolder(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFolder === f.id
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`group relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border cursor-pointer transition-all ${
              selectedItem?.id === item.id
                ? 'border-amber-400 ring-2 ring-amber-400'
                : 'border-neutral-800 hover:border-neutral-600'
            }`}
          >
            <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
              <p className="text-[11px] font-semibold text-white truncate">{item.filename}</p>
              <p className="text-[10px] text-neutral-400">{item.fileSizeKB} KB • {item.folder}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Details Drawer */}
      {selectedItem && (
        <div className="bg-neutral-950/90 border border-neutral-800 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start shadow-xl">
          <img
            src={selectedItem.url}
            alt=""
            className="w-32 h-32 object-cover rounded-xl border border-neutral-700 shrink-0"
          />

          <div className="flex-1 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedItem.filename}</h4>
                <p className="text-neutral-500 text-[11px]">
                  Uploaded {selectedItem.uploadedAt} • Size: {selectedItem.fileSizeKB} KB • Folder: {selectedItem.folder}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                value={selectedItem.altText}
                onChange={(e) => updateMedia(selectedItem.id, { altText: e.target.value })}
                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopyUrl(selectedItem)}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold rounded-lg flex items-center gap-1.5"
              >
                {copiedId === selectedItem.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === selectedItem.id ? 'Copied URL!' : 'Copy Asset Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3 py-2 text-neutral-400 hover:text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
