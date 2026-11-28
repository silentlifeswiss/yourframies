import { Product } from '../types'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'yf-car-01',
    categoryId: 'cat-car-frames',
    title: 'Porsche 911 GT3 RS Neon Night Frame',
    slug: 'porsche-911-gt3-rs-neon-night-frame',
    description: 'High-definition shot of the legendary GT3 RS bathed in atmospheric Tokyo night lights. Encased in a handcrafted A4 frame with shatterproof anti-glare acrylic.',
    basePriceINR: 1499,
    compareAtPriceINR: 2199,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Iconic box-flare silhouette of the E30 M3 in classic Alpine White. Printed on archival 300 GSM lustre paper in an A4 precision-crafted frame.',
    basePriceINR: 1599,
    compareAtPriceINR: 2299,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Vintage circuit racing illustration celebrating the Casino hairpin in Monte Carlo. A standout A4 gallery piece for motorsport lovers.',
    basePriceINR: 1399,
    compareAtPriceINR: 1999,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Crisp, organic Scandinavian fern study in classic A4 size with clean ivory matting. Understated calm and elegance for modern interiors.',
    basePriceINR: 1199,
    compareAtPriceINR: 1799,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Warm terracotta and soft neutral arches inspired by Mediterranean architecture in an A4 exhibition mount.',
    basePriceINR: 1299,
    compareAtPriceINR: 1899,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Upload 9 of your favorite photos. We professionally color-correct, crop, print on fine art satin, and frame in an A4 multi-window layout.',
    basePriceINR: 1999,
    compareAtPriceINR: 2899,
    images: [
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=85',
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
    description: 'Frame your couple song, wedding vow, or first dance in an A4 frame with a scannable Spotify code and soundwave overlay.',
    basePriceINR: 1699,
    compareAtPriceINR: 2399,
    images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=85',
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
    title: 'Bespoke Studio Custom Frame (Upload Your Photo)',
    slug: 'bespoke-studio-custom-frame',
    description: 'Design your own A4 frame from scratch. Upload any photo, select Deep Black or Minimalist White finish, and choose premium glass.',
    basePriceINR: 1299,
    compareAtPriceINR: 1899,
    images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
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
    title: 'Typographic "Do Good & Be Kind" Archival Print',
    slug: 'typographic-do-good-and-be-kind-archival-print',
    description: 'High-contrast Swiss typographic layout printed on heavy 310 GSM paper in an A4 minimalist frame.',
    basePriceINR: 899,
    compareAtPriceINR: 1299,
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
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
    title: 'Nordic Forest Triptych (3-Piece Gallery Set)',
    slug: 'nordic-forest-triptych-3-piece-gallery-set',
    description: 'A cohesive three-frame A4 collection capturing misty pine forests. Handcrafted in Deep Black or Minimalist White.',
    basePriceINR: 3499,
    compareAtPriceINR: 4999,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=85',
    ],
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
    isCustomizable: false,
    isActive: true,
    stockQuantity: 25,
  },
]

export const PRODUCTS_STORAGE_KEY = 'yourframies_products_db'

export function getStoreProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          availableSizes: ['A4'],
          availableMouldings: ['Deep Black', 'Minimalist White'],
        }))
      }
    }
  } catch (e) {
    // fallback
  }
  return INITIAL_PRODUCTS.map((p) => ({
    ...p,
    availableSizes: ['A4'],
    availableMouldings: ['Deep Black', 'Minimalist White'],
  }))
}

export function saveStoreProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    window.dispatchEvent(new Event('yourframies_products_updated'))
  } catch (e) {
    console.error('Error saving products:', e)
  }
}

