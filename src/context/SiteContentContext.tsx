import React, { createContext, useContext, useState, useEffect } from 'react'

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
  tagline: 'Artisanal Wall Framing',
  logoText: 'Your Framies',
  announcementText:
    '✨ Handcrafted Museum-Quality Frames • Free Express Shipping on Orders Above ₹999 • Use Code WELCOME10 for 10% Off',
  announcementActive: true,
  contactEmail: 'support@yourframies.com',
  contactPhone: '+91 98765 43210',
  workshopAddress: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
  instagramHandle: '@yourframies',
  whatsappNumber: '+919876543210',
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
    title: 'Artisanal Frames. Timeless Preservation.',
    subtitle:
      'Bespoke solid wood framing for automotive photography, contemporary minimalist art, and your most treasured personal memories. Handcrafted with museum-grade precision in India.',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    badgeText: "India's Premier Framing Atelier",
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Shop by Category',
    subtitle: 'Explore our specialized frame and artwork collections',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 1,
  },
  {
    id: 'sec-bestsellers',
    type: 'bestsellers',
    title: 'Curated for Modern Spaces',
    subtitle: 'Popular automotive legends and serene aesthetic studies',
    isActive: true,
    backgroundStyle: 'white',
    order: 2,
  },
  {
    id: 'sec-customizer',
    type: 'customizer_banner',
    title: 'Customize Your Own Frame Live',
    subtitle:
      'Upload personal photos, choose from 5 handcrafted hardwood mouldings, custom matting and museum-grade anti-glare glass.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 3,
  },
  {
    id: 'sec-why-us',
    type: 'why_choose_us',
    title: 'Why Discerning Collectors Choose Us',
    subtitle:
      'Every frame is assembled by master framers with meticulous attention to joint geometry, colour depth, and preservation.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 4,
  },
  {
    id: 'sec-reviews',
    type: 'reviews',
    title: 'Loved in 10,000+ Indian Homes',
    subtitle: 'Read genuine verified reviews from collectors across India',
    isActive: true,
    backgroundStyle: 'white',
    order: 5,
  },
  {
    id: 'sec-instagram',
    type: 'instagram',
    title: 'Follow Our Journey on Instagram',
    subtitle: '#YourFramiesInTheWild',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 6,
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Receive ₹200 Off Your First Order',
    subtitle:
      'Subscribe for early access to limited edition automotive prints, seasonal releases, and private studio promotions.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 7,
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

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Published State
  const [publishedSettings, setPublishedSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      return stored ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SITE_SETTINGS
    } catch {
      return DEFAULT_SITE_SETTINGS
    }
  })

  const [publishedSections, setPublishedSections] = useState<HomepageSection[]>(() => {
    try {
      const stored = localStorage.getItem(SECTIONS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_HOMEPAGE_SECTIONS
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
