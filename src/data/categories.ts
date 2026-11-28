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
    description: 'Iconic automotive photography, legendary supercars, and classic motorsport frames for enthusiasts.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    itemCount: 18,
    featured: true,
  },
  {
    id: 'cat-aesthetic-frames',
    name: 'Aesthetic Photo Frames',
    slug: 'aesthetic-photo-frames',
    description: 'Minimalist Scandinavian line art, soothing architectural geometry, and tranquil botanical prints.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    itemCount: 24,
    featured: true,
  },
  {
    id: 'cat-personalised-frames',
    name: 'Personalised Photo Frames',
    slug: 'personalised-photo-frames',
    description: 'Transform your cherished memories, wedding moments, and travel milestones into timeless framed art.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    itemCount: 15,
    featured: true,
  },
  {
    id: 'cat-custom-frames',
    name: 'Custom Photo Frames',
    slug: 'custom-photo-frames',
    description: 'Studio-grade bespoke framing. Choose custom sizes, handcrafted wood mouldings, mats, and museum glass.',
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    itemCount: 30,
    featured: true,
  },
  {
    id: 'cat-posters',
    name: 'Posters & Typography',
    slug: 'posters',
    description: 'Bold typographic quotes, retro cinema prints, and modern contemporary art on heavyweight paper.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    itemCount: 20,
    featured: false,
  },
  {
    id: 'cat-wall-art',
    name: 'Wall Art Collections',
    slug: 'wall-art',
    description: 'Curated 3-piece gallery wall sets, oversized canvas frames, and panoramic landscape series.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
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
