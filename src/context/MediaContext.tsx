import React, { createContext, useContext, useState, useEffect } from 'react'

export interface MediaItem {
  id: string
  filename: string
  url: string
  folder: 'automotive' | 'aesthetic' | 'materials' | 'banners' | 'general'
  altText: string
  fileSizeKB: number
  uploadedAt: string
}

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-01',
    filename: 'porsche-gt3rs-night.jpg',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=85',
    folder: 'automotive',
    altText: 'Porsche 911 GT3 RS Neon Night Frame Artwork',
    fileSizeKB: 480,
    uploadedAt: '2026-11-15',
  },
  {
    id: 'med-02',
    filename: 'vintage-bmw-m3.jpg',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
    folder: 'automotive',
    altText: 'Vintage BMW E30 M3 Heritage Edition Frame',
    fileSizeKB: 512,
    uploadedAt: '2026-11-16',
  },
  {
    id: 'med-03',
    filename: 'scandinavian-fern.jpg',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
    folder: 'aesthetic',
    altText: 'Serene Botanical Fern Minimalist Frame Art',
    fileSizeKB: 390,
    uploadedAt: '2026-11-17',
  },
  {
    id: 'med-04',
    filename: 'studio-workshop-craft.jpg',
    url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85',
    folder: 'materials',
    altText: 'Solid Wood Moulding Workshop Craftsmanship',
    fileSizeKB: 720,
    uploadedAt: '2026-11-18',
  },
  {
    id: 'med-05',
    filename: 'hero-gallery-banner.jpg',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85',
    folder: 'banners',
    altText: 'Main Storefront Hero Gallery Wall Background',
    fileSizeKB: 940,
    uploadedAt: '2026-11-19',
  },
]

interface MediaContextType {
  media: MediaItem[]
  uploadFile: (file: File, folder?: MediaItem['folder'], altText?: string) => Promise<MediaItem>
  deleteMedia: (id: string) => void
  updateMedia: (id: string, updates: Partial<MediaItem>) => void
  isMediaPickerOpen: boolean
  openMediaPicker: (onSelect: (url: string) => void) => void
  closeMediaPicker: () => void
  selectMediaCallback: ((url: string) => void) | null
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

const MEDIA_STORAGE_KEY = 'yourframies_media_library'

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_MEDIA_ITEMS
    } catch {
      return DEFAULT_MEDIA_ITEMS
    }
  })

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [selectMediaCallback, setSelectMediaCallback] = useState<((url: string) => void) | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(media))
    } catch {
      // Ignore
    }
  }, [media])

  const uploadFile = async (
    file: File,
    folder: MediaItem['folder'] = 'general',
    altText: string = ''
  ): Promise<MediaItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        const newItem: MediaItem = {
          id: `med-${Date.now()}`,
          filename: file.name,
          url: dataUrl,
          folder,
          altText: altText || file.name.replace(/\.[^/.]+$/, ''),
          fileSizeKB: Math.round(file.size / 1024),
          uploadedAt: new Date().toISOString().slice(0, 10),
        }
        setMedia((prev) => [newItem, ...prev])
        resolve(newItem)
      }
      reader.readAsDataURL(file)
    })
  }

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setSelectMediaCallback(() => onSelect)
    setIsMediaPickerOpen(true)
  }

  const closeMediaPicker = () => {
    setIsMediaPickerOpen(false)
    setSelectMediaCallback(null)
  }

  return (
    <MediaContext.Provider
      value={{
        media,
        uploadFile,
        deleteMedia,
        updateMedia,
        isMediaPickerOpen,
        openMediaPicker,
        closeMediaPicker,
        selectMediaCallback,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (!context) throw new Error('useMedia must be used within a MediaProvider')
  return context
}
