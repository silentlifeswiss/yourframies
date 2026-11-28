export interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  itemCount: number
  featured?: boolean
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-car-frames',
    name: 'Car Photo Frames',
    slug: 'car-photo-frames',
    description: 'High-contrast supercars, Tokyo night shoots, and classic motorsport prints framed in A4.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    itemCount: 3,
    featured: true,
  },
  {
    id: 'cat-aesthetic-frames',
    name: 'Aesthetic Photo Frames',
    slug: 'aesthetic-photo-frames',
    description: 'Clean botanical prints and calm architectural art ready to hang in A4.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    featured: true,
  },
  {
    id: 'cat-personalised-frames',
    name: 'Personalised Photo Frames',
    slug: 'personalised-photo-frames',
    description: 'Turn your photos, collages, and song keepsakes into A4 wall frames.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    itemCount: 2,
    featured: true,
  },
  {
    id: 'cat-custom-frames',
    name: 'Custom Photo Frames',
    slug: 'custom-photo-frames',
    description: 'Upload any photo and preview it live in Deep Black or Minimalist White A4 frames.',
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    itemCount: 1,
    featured: true,
  },
  {
    id: 'cat-posters',
    name: 'Posters & Typography',
    slug: 'posters',
    description: 'Crisp typography quotes and graphic prints framed in standard A4.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    itemCount: 1,
    featured: false,
  },
  {
    id: 'cat-wall-art',
    name: 'Wall Art Collections',
    slug: 'wall-art',
    description: 'Matching 3-piece A4 frame sets built for clean bedroom and workspace walls.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    itemCount: 1,
    featured: false,
  },
]

export const CATEGORIES_STORAGE_KEY = 'yourframies_categories_db'

export function getStoreCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // fallback
  }
  return CATEGORIES
}

export function saveStoreCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    window.dispatchEvent(new Event('yourframies_categories_updated'))
  } catch (e) {
    console.error('Error saving categories:', e)
  }
}

export async function syncCategoriesFromApi(): Promise<Category[]> {
  try {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        saveStoreCategories(json.data)
        return json.data
      }
    }
  } catch {
    // Offline fallback
  }
  return getStoreCategories()
}
