import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

export interface HomepageSection {
  id: string
  type:
    | 'hero'
    | 'categories'
    | 'bestsellers'
    | 'customizer_banner'
    | 'why_choose_us'
    | 'reviews'
    | 'instagram'
    | 'newsletter'
    | 'custom_banner'
  title: string
  subtitle?: string
  isActive: boolean
  backgroundStyle: 'white' | 'neutral-50' | 'neutral-900'
  order: number
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
  badgeText?: string
  customContent?: string
}

export interface SiteSettings {
  brandName: string
  tagline: string
  logoText: string
  announcementText: string
  announcementActive: boolean
  contactEmail: string
  contactPhone: string
  workshopAddress: string
  instagramHandle: string
  whatsappNumber: string
  accentColor: string
  currencySymbol: string
  freeShippingThreshold: number
  codHandlingFee: number
  maintenanceMode: boolean
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'Your Framies',
  tagline: 'A4 Wall Art & Photo Frames',
  logoText: 'Your Framies',
  announcementText:
    'A4 Frames in Deep Black & Minimalist White • Free Shipping Above ₹999 • Use Code WELCOME10 for 10% Off',
  announcementActive: true,
  contactEmail: 'silentlifeswiss@gmail.com',
  contactPhone: '+91 79009 43025',
  workshopAddress: 'New Delhi, India',
  instagramHandle: '@yourframies',
  whatsappNumber: '+917900943025',
  accentColor: '#171717',
  currencySymbol: '₹',
  freeShippingThreshold: 999,
  codHandlingFee: 50,
  maintenanceMode: false,
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'A4 Wall Art & Custom Photo Frames.',
    subtitle:
      'Ready-to-hang A4 frames featuring iconic supercar photography, clean botanical prints, and your own personal memories — in Deep Black or Minimalist White.',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    badgeText: 'Standard A4 Frames • Black & White',
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Shop by Category',
    subtitle: 'Car frames, minimalist prints, and personalised photo gifts',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 1,
  },
  {
    id: 'sec-bestsellers',
    type: 'bestsellers',
    title: 'Popular A4 Frames',
    subtitle: 'Automotive legends, calm interiors, and custom photo keepsakes',
    isActive: true,
    backgroundStyle: 'white',
    order: 2,
  },
  {
    id: 'sec-customizer',
    type: 'customizer_banner',
    title: 'Frame Your Own Photo Live',
    subtitle:
      'Upload your photo and preview how it looks in our A4 Deep Black or Minimalist White frame before you order.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 3,
  },
  {
    id: 'sec-why-us',
    type: 'why_choose_us',
    title: 'Built Clean. Ready to Hang.',
    subtitle:
      'Consistent A4 sizing, clean finishes, and safe doorstep delivery across India.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 4,
  },
  {
    id: 'sec-instagram',
    type: 'instagram',
    title: 'Follow Us on Instagram',
    subtitle: '#YourFramies',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 5,
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Get ₹200 Off Your First Order',
    subtitle:
      'Sign up for new automotive frame drops and member offers.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 6,
  },
]

interface SiteContentContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  homepageSections: HomepageSection[]
  updateHomepageSections: (sections: HomepageSection[]) => void
  reorderSection: (fromIndex: number, toIndex: number) => void
  toggleSectionVisibility: (sectionId: string) => void
  updateSection: (sectionId: string, updates: Partial<HomepageSection>) => void
  addSection: (section: Omit<HomepageSection, 'id' | 'order'>) => void
  deleteSection: (sectionId: string) => void
  hasUnpublishedChanges: boolean
  publishChanges: () => void
  discardDraft: () => void
  resetToDefaults: () => void
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined)

const SETTINGS_STORAGE_KEY = 'yourframies_site_settings_published'
const SECTIONS_STORAGE_KEY = 'yourframies_homepage_sections_published'
const DRAFT_SECTIONS_STORAGE_KEY = 'yourframies_homepage_sections_draft'
const DRAFT_SETTINGS_STORAGE_KEY = 'yourframies_site_settings_draft'

function normalizeSettings(raw: Partial<SiteSettings>): SiteSettings {
  const merged = { ...DEFAULT_SITE_SETTINGS, ...raw }
  if (!raw.contactEmail || raw.contactEmail === 'support@yourframies.com') {
    merged.contactEmail = DEFAULT_SITE_SETTINGS.contactEmail
  }
  if (!raw.contactPhone || raw.contactPhone === '+91 98765 43210') {
    merged.contactPhone = DEFAULT_SITE_SETTINGS.contactPhone
  }
  if (!raw.whatsappNumber || raw.whatsappNumber === '+919876543210') {
    merged.whatsappNumber = DEFAULT_SITE_SETTINGS.whatsappNumber
  }
  if (raw.announcementText?.includes('Museum-Quality Frames')) {
    merged.announcementText = DEFAULT_SITE_SETTINGS.announcementText
  }
  if (raw.tagline === 'Artisanal Wall Framing') {
    merged.tagline = DEFAULT_SITE_SETTINGS.tagline
  }
  return merged
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Published State
  const [publishedSettings, setPublishedSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      return stored ? normalizeSettings(JSON.parse(stored)) : DEFAULT_SITE_SETTINGS
    } catch {
      return DEFAULT_SITE_SETTINGS
    }
  })

  const [publishedSections, setPublishedSections] = useState<HomepageSection[]>(() => {
    try {
      const stored = localStorage.getItem(SECTIONS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored).filter((s: HomepageSection) => s.type !== 'reviews')
        if (parsed.some((s: HomepageSection) => s.subtitle?.includes('5 handcrafted hardwood'))) {
          return DEFAULT_HOMEPAGE_SECTIONS
        }
        return parsed
      }
      return DEFAULT_HOMEPAGE_SECTIONS
    } catch {
      return DEFAULT_HOMEPAGE_SECTIONS
    }
  })

  // Working / Draft State
  const [draftSettings, setDraftSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(DRAFT_SETTINGS_STORAGE_KEY)
      return stored ? { ...publishedSettings, ...JSON.parse(stored) } : publishedSettings
    } catch {
      return publishedSettings
    }
  })

  const [draftSections, setDraftSections] = useState<HomepageSection[]>(() => {
    try {
      const stored = localStorage.getItem(DRAFT_SECTIONS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : publishedSections
    } catch {
      return publishedSections
    }
  })

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)

  // Sync draft to local storage
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_SETTINGS_STORAGE_KEY, JSON.stringify(draftSettings))
      localStorage.setItem(DRAFT_SECTIONS_STORAGE_KEY, JSON.stringify(draftSections))
      const settingsChanged = JSON.stringify(draftSettings) !== JSON.stringify(publishedSettings)
      const sectionsChanged = JSON.stringify(draftSections) !== JSON.stringify(publishedSections)
      setHasUnpublishedChanges(settingsChanged || sectionsChanged)
    } catch {
      // Ignore
    }
  }, [draftSettings, draftSections, publishedSettings, publishedSections])

  // Sync live published content from backend database
  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const [settingsRes, homepageRes] = await Promise.all([
          api.getSiteSettings(),
          api.getHomepageContent(),
        ])
        if (settingsRes.success && settingsRes.data) {
          setPublishedSettings((prev) => ({ ...prev, ...settingsRes.data }))
        }
        if (homepageRes.success && Array.isArray(homepageRes.data) && homepageRes.data.length > 0) {
          setPublishedSections(homepageRes.data)
        }
      } catch {
        // Fallback to local
      }
    }
    fetchLiveContent()
  }, [])

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setDraftSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const updateHomepageSections = (sections: HomepageSection[]) => {
    setDraftSections(sections.map((s, idx) => ({ ...s, order: idx })))
  }

  const reorderSection = (fromIndex: number, toIndex: number) => {
    const updated = [...draftSections]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setDraftSections(updated.map((s, idx) => ({ ...s, order: idx })))
  }

  const toggleSectionVisibility = (sectionId: string) => {
    setDraftSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isActive: !s.isActive } : s))
    )
  }

  const updateSection = (sectionId: string, updates: Partial<HomepageSection>) => {
    setDraftSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    )
  }

  const addSection = (section: Omit<HomepageSection, 'id' | 'order'>) => {
    const newId = `sec-${Date.now()}`
    const newSection: HomepageSection = {
      ...section,
      id: newId,
      order: draftSections.length,
    }
    setDraftSections((prev) => [...prev, newSection])
  }

  const deleteSection = (sectionId: string) => {
    setDraftSections((prev) =>
      prev.filter((s) => s.id !== sectionId).map((s, idx) => ({ ...s, order: idx }))
    )
  }

  const publishChanges = () => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(draftSettings))
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(draftSections))
      setPublishedSettings(draftSettings)
      setPublishedSections(draftSections)
      setHasUnpublishedChanges(false)

      // Sync to backend database
      api.adminUpdateDraftSections(draftSections)
        .then(() => api.adminPublishHomepage())
        .catch(() => {})
      api.adminUpdateSettings(draftSettings).catch(() => {})
    } catch {
      // Ignore
    }
  }

  const discardDraft = () => {
    setDraftSettings(publishedSettings)
    setDraftSections(publishedSections)
    setHasUnpublishedChanges(false)
  }

  const resetToDefaults = () => {
    setDraftSettings(DEFAULT_SITE_SETTINGS)
    setDraftSections(DEFAULT_HOMEPAGE_SECTIONS)
    publishChanges()
  }

  return (
    <SiteContentContext.Provider
      value={{
        // Storefront consumes publishedSettings & publishedSections
        settings: publishedSettings,
        updateSettings,
        homepageSections: draftSections, // admin editor works with draft
        updateHomepageSections,
        reorderSection,
        toggleSectionVisibility,
        updateSection,
        addSection,
        deleteSection,
        hasUnpublishedChanges,
        publishChanges,
        discardDraft,
        resetToDefaults,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  )
}

export const useSiteContent = () => {
  const context = useContext(SiteContentContext)
  if (!context) throw new Error('useSiteContent must be used within a SiteContentProvider')
  return context
}
