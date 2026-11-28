import { Product } from '../types'

export const INITIAL_PRODUCTS: Product[] = []

export const PRODUCTS_STORAGE_KEY = 'yourframies_products_db'
const CLEAN_PRODS_MIGRATION_KEY = 'yourframies_clean_prods_v1'
const LEGACY_PROD_IDS = new Set([
  'yf-car-01',
  'yf-car-02',
  'yf-car-03',
  'yf-aes-01',
  'yf-aes-02',
  'yf-pers-01',
  'yf-pers-02',
  'yf-cust-01',
  'yf-post-01',
  'yf-wall-01',
])

export function normalizeProduct(p: Product): Product {
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
  }
}

export function getStoreProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        if (!localStorage.getItem(CLEAN_PRODS_MIGRATION_KEY)) {
          const cleaned = parsed.filter((p) => !LEGACY_PROD_IDS.has(p.id)).map(normalizeProduct)
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(cleaned))
          localStorage.setItem(CLEAN_PRODS_MIGRATION_KEY, '1')
          return cleaned
        }
        return parsed.map(normalizeProduct)
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_PRODUCTS.map(normalizeProduct)
}

export function saveStoreProducts(products: Product[]): void {
  try {
    const normalized = products.map(normalizeProduct)
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalized))
    localStorage.setItem(CLEAN_PRODS_MIGRATION_KEY, '1')
    window.dispatchEvent(new Event('yourframies_products_updated'))
  } catch (e) {
    console.error('Error saving products:', e)
  }
}

let inFlightProductsSync: Promise<Product[]> | null = null
let lastProductsSyncAt = 0

export async function syncProductsFromApi(force = false): Promise<Product[]> {
  const now = Date.now()
  if (!force && lastProductsSyncAt > 0 && now - lastProductsSyncAt < 15000) {
    return getStoreProducts()
  }
  if (inFlightProductsSync) {
    return inFlightProductsSync
  }

  inFlightProductsSync = (async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          const normalized = json.data.map(normalizeProduct)
          saveStoreProducts(normalized)
          lastProductsSyncAt = Date.now()
          return normalized
        }
      }
    } catch {
      // Offline fallback
    } finally {
      inFlightProductsSync = null
    }
    return getStoreProducts()
  })()

  return inFlightProductsSync
}
