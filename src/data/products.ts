import { Product } from '../types'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'yf-car-01',
    categoryId: 'cat-car-frames',
    title: 'Porsche 911 GT3 RS Neon Night Frame',
    slug: 'porsche-911-gt3-rs-neon-night-frame',
    description: 'Sharp night photography of the Porsche 911 GT3 RS under neon street lights, framed in standard A4.',
    basePriceINR: 1499,
    compareAtPriceINR: 2199,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 45,
  },
  {
    id: 'yf-car-02',
    categoryId: 'cat-car-frames',
    title: 'Vintage BMW E30 M3 Heritage Edition',
    slug: 'vintage-bmw-e30-m3-heritage-edition',
    description: 'Classic Alpine White BMW E30 M3 print in an A4 frame. Clean desk or garage wall statement.',
    basePriceINR: 1599,
    compareAtPriceINR: 2299,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 30,
  },
  {
    id: 'yf-car-03',
    categoryId: 'cat-car-frames',
    title: 'Formula 1 Monaco Grand Prix Retro Wall Art',
    slug: 'formula-1-monaco-grand-prix-retro-wall-art',
    description: 'Retro Monte Carlo circuit racing illustration printed crisp in A4.',
    basePriceINR: 1399,
    compareAtPriceINR: 1999,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: false,
    isActive: true,
    stockQuantity: 60,
  },
  {
    id: 'yf-aes-01',
    categoryId: 'cat-aesthetic-frames',
    title: 'Serene Botanical Fern Minimalist Frame',
    slug: 'serene-botanical-fern-minimalist-frame',
    description: 'Clean botanical fern print in A4 size. Fits bedrooms, studies, and bright workspaces.',
    basePriceINR: 1199,
    compareAtPriceINR: 1799,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 50,
  },
  {
    id: 'yf-aes-02',
    categoryId: 'cat-aesthetic-frames',
    title: 'Abstract Architectural Arches in Sandstone',
    slug: 'abstract-architectural-arches-in-sandstone',
    description: 'Warm terracotta and neutral geometric arches printed for clean A4 framing.',
    basePriceINR: 1299,
    compareAtPriceINR: 1899,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 40,
  },
  {
    id: 'yf-pers-01',
    categoryId: 'cat-personalised-frames',
    title: 'The Memories Collage • 9-Photo Storyboard',
    slug: 'the-memories-collage-9-photo-storyboard',
    description: 'Upload your favourite photos and arrange them in a crisp A4 multi-photo storyboard frame.',
    basePriceINR: 1999,
    compareAtPriceINR: 2899,
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 100,
  },
  {
    id: 'yf-pers-02',
    categoryId: 'cat-personalised-frames',
    title: 'Custom Soundwave & Spotify Code Keepsake',
    slug: 'custom-soundwave-and-spotify-code-keepsake',
    description: 'Pair your favorite photo with a scannable song code inside a clean A4 Deep Black or Minimalist White frame.',
    basePriceINR: 1699,
    compareAtPriceINR: 2399,
    images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 80,
  },
  {
    id: 'yf-cust-01',
    categoryId: 'cat-custom-frames',
    title: 'Custom A4 Photo Frame (Upload Your Photo)',
    slug: 'bespoke-studio-custom-frame',
    description: 'Upload any photo from your phone or computer and choose Deep Black or Minimalist White A4 finish.',
    basePriceINR: 1299,
    compareAtPriceINR: 1899,
    images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 200,
  },
  {
    id: 'yf-post-01',
    categoryId: 'cat-posters',
    title: 'Typographic "Do Good & Be Kind" Framed Print',
    slug: 'typographic-do-good-and-be-kind-archival-print',
    description: 'Bold monochrome typography printed crisp on heavy art paper and fitted into a clean A4 frame.',
    basePriceINR: 899,
    compareAtPriceINR: 1299,
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: false,
    isActive: true,
    stockQuantity: 75,
  },
  {
    id: 'yf-wall-01',
    categoryId: 'cat-wall-art',
    title: 'Nordic Forest Triptych (3-Piece A4 Set)',
    slug: 'nordic-forest-triptych-3-piece-gallery-set',
    description: 'Set of three coordinated A4 wall frames capturing misty pine forests, ready to hang together.',
    basePriceINR: 3499,
    compareAtPriceINR: 4999,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: false,
    isActive: true,
    stockQuantity: 25,
  },
]

export const PRODUCTS_STORAGE_KEY = 'yourframies_products_db'

export function normalizeProduct(p: Product): Product {
  return {
    ...p,
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
  }
}

export function getStoreProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
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
    window.dispatchEvent(new Event('yourframies_products_updated'))
  } catch (e) {
    console.error('Error saving products:', e)
  }
}

export async function syncProductsFromApi(): Promise<Product[]> {
  try {
    const res = await fetch('/api/products')
    if (res.ok) {
      const json = await res.json()
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const normalized = json.data.map(normalizeProduct)
        saveStoreProducts(normalized)
        return normalized
      }
    }
  } catch {
    // Offline fallback
  }
  return getStoreProducts()
}

