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

const DEFAULT_MEDIA_ITEMS: MediaItem[] = []

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
const CLEAN_MEDIA_KEY = 'yourframies_clean_media_v1'
const LEGACY_MEDIA_IDS = new Set(['med-01', 'med-02', 'med-03', 'med-04', 'med-05'])

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          if (!localStorage.getItem(CLEAN_MEDIA_KEY)) {
            const cleaned = parsed.filter((m) => !LEGACY_MEDIA_IDS.has(m.id))
            localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(cleaned))
            localStorage.setItem(CLEAN_MEDIA_KEY, '1')
            return cleaned
          }
          return parsed
        }
      }
      return DEFAULT_MEDIA_ITEMS
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

  const compressDataUrl = (rawDataUrl: string, maxDimension = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof Image === 'undefined') {
        resolve(rawDataUrl)
        return
      }
      const img = new window.Image()
      img.onload = () => {
        try {
          let { width, height } = img
          if (width <= maxDimension && height <= maxDimension && rawDataUrl.length < 250_000) {
            resolve(rawDataUrl)
            return
          }
          if (width > maxDimension || height > maxDimension) {
            if (width >= height) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            } else {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(rawDataUrl)
            return
          }
          ctx.drawImage(img, 0, 0, width, height)
          const compressed = canvas.toDataURL('image/jpeg', quality)
          resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl)
        } catch {
          resolve(rawDataUrl)
        }
      }
      img.onerror = () => resolve(rawDataUrl)
      img.src = rawDataUrl
    })
  }

  const uploadFile = async (
    file: File,
    folder: MediaItem['folder'] = 'general',
    altText: string = ''
  ): Promise<MediaItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const rawUrl = event.target?.result as string
        const dataUrl = await compressDataUrl(rawUrl)
        const approxBytes = Math.round((dataUrl.length * 3) / 4)
        const newItem: MediaItem = {
          id: `med-${Date.now()}`,
          filename: file.name,
          url: dataUrl,
          folder,
          altText: altText || file.name.replace(/\.[^/.]+$/, ''),
          fileSizeKB: Math.max(1, Math.round(approxBytes / 1024)),
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
