export interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  itemCount: number
  featured?: boolean
}

export const CATEGORIES: Category[] = []

export const CATEGORIES_STORAGE_KEY = 'yourframies_categories_db'
const CLEAN_CATS_MIGRATION_KEY = 'yourframies_clean_cats_v1'
const LEGACY_CAT_IDS = new Set([
  'cat-car-frames',
  'cat-aesthetic-frames',
  'cat-personalised-frames',
  'cat-custom-frames',
  'cat-posters',
  'cat-wall-art',
])

export function getStoreCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        if (!localStorage.getItem(CLEAN_CATS_MIGRATION_KEY)) {
          const cleaned = parsed.filter((c) => !LEGACY_CAT_IDS.has(c.id))
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cleaned))
          localStorage.setItem(CLEAN_CATS_MIGRATION_KEY, '1')
          return cleaned
        }
        return parsed
      }
    }
  } catch (e) {
    // fallback
  }
  return CATEGORIES
}

export function saveStoreCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    localStorage.setItem(CLEAN_CATS_MIGRATION_KEY, '1')
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
      if (json.success && Array.isArray(json.data)) {
        saveStoreCategories(json.data)
        return json.data
      }
    }
  } catch {
    // Offline fallback
  }
  return getStoreCategories()
}
