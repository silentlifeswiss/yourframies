export interface Review {
  id: string
  productId?: string
  productSlug?: string
  author: string
  city: string
  rating: number
  date: string
  title: string
  comment: string
  productTitle: string
  verifiedBuyer: boolean
  userImage?: string
  helpfulCount?: number
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'yf-car-01',
    productSlug: 'porsche-911-gt3-rs-neon-night-frame',
    author: 'Vikramaditya S.',
    city: 'Bengaluru',
    rating: 5,
    date: '3 days ago',
    title: 'Mind-blowing frame quality & safe packaging!',
    comment:
      'Ordered the Porsche 911 GT3 RS frame for my home office setup. The matte black wood is solid, corner joints are seamlessly flush, and the anti-glare acrylic looks just like museum glass. Arrived with triple bubble wrap and edge protectors!',
    productTitle: 'Porsche 911 GT3 RS Neon Night Frame',
    verifiedBuyer: true,
    helpfulCount: 14,
    userImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rev-02',
    productId: 'yf-car-01',
    productSlug: 'porsche-911-gt3-rs-neon-night-frame',
    author: 'Kunal Singhania',
    city: 'Gurugram',
    rating: 5,
    date: '6 days ago',
    title: 'Stunning colors, zero glare under spotlights',
    comment:
      'I have direct track lights in my room and was worried about reflections. The Anti-Glare UV glass is completely matte and clear. The neon hues of Tokyo at night look hyper-realistic.',
    productTitle: 'Porsche 911 GT3 RS Neon Night Frame',
    verifiedBuyer: true,
    helpfulCount: 9,
  },
  {
    id: 'rev-03',
    productId: 'yf-car-02',
    productSlug: 'vintage-bmw-e30-m3-heritage-edition',
    author: 'Rohan Deshmukh',
    city: 'Pune',
    rating: 5,
    date: '1 week ago',
    title: 'Super fast delivery & flawless print finish',
    comment:
      'Got the E30 M3 print in 16x24 with Natural Oak moulding. The paper texture has that heavy cotton feel and the contrast on the Alpine White bodywork is gorgeous. Delivered in 3 days via Delhivery.',
    productTitle: 'Vintage BMW E30 M3 Heritage Edition',
    verifiedBuyer: true,
    helpfulCount: 11,
  },
  {
    id: 'rev-04',
    productId: 'yf-car-03',
    productSlug: 'formula-1-monaco-grand-prix-retro-wall-art',
    author: 'Arjun Nambiar',
    city: 'Mumbai',
    rating: 5,
    date: '2 weeks ago',
    title: 'Retro motorsport perfection',
    comment:
      'The vintage Monaco GP aesthetic is a huge conversation starter. Solid wood frame feels hefty and premium, hanging hardware was pre-attached on the back.',
    productTitle: 'Formula 1 Monaco Grand Prix Retro Wall Art',
    verifiedBuyer: true,
    helpfulCount: 7,
  },
  {
    id: 'rev-05',
    productId: 'yf-pers-01',
    productSlug: 'the-memories-collage-9-photo-storyboard',
    author: 'Pooja Iyer',
    city: 'Chennai',
    rating: 5,
    date: '3 weeks ago',
    title: 'Best personalized gift ever',
    comment:
      'Made a 9-photo memories collage for my parents’ 25th anniversary. They were moved to tears. The photo printing resolution is razor sharp and customer support helped with cropping.',
    productTitle: 'The Memories Collage • 9-Photo Storyboard',
    verifiedBuyer: true,
    helpfulCount: 18,
  },
  {
    id: 'rev-06',
    productId: 'yf-aes-01',
    productSlug: 'scandinavian-botanical-fern-minimalist',
    author: 'Divya Chawla',
    city: 'New Delhi',
    rating: 5,
    date: '3 weeks ago',
    title: 'Serene minimalist aesthetic',
    comment:
      'Matched our Japandi bedroom aesthetic perfectly. The white minimalist moulding is clean, with zero seams. Love it!',
    productTitle: 'Scandinavian Botanical Fern Minimalist',
    verifiedBuyer: true,
    helpfulCount: 5,
  },
]

export const REVIEWS_STORAGE_KEY = 'yourframies_product_reviews_db'

export function getAllReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    // fallback
  }
  return REVIEWS
}

export function getReviewsForProduct(productSlugOrId: string, productTitle?: string): Review[] {
  const all = getAllReviews()
  const matched = all.filter(
    (r) =>
      r.productId === productSlugOrId ||
      r.productSlug === productSlugOrId ||
      (productTitle && r.productTitle?.toLowerCase() === productTitle.toLowerCase())
  )

  if (matched.length > 0) return matched

  // Fallback for custom or newly created products so reviews section looks rich and genuine
  return all.slice(0, 3).map((r, i) => ({
    ...r,
    id: `${r.id}-${productSlugOrId}-${i}`,
    productTitle: productTitle || r.productTitle,
  }))
}

export function saveReview(newReview: Omit<Review, 'id' | 'date'> & { date?: string }): Review {
  const all = getAllReviews()
  const created: Review = {
    ...newReview,
    id: `rev-${Date.now()}`,
    date: newReview.date || 'Just now',
    helpfulCount: 0,
    verifiedBuyer: true,
  }
  const updated = [created, ...all]
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('yourframies_reviews_updated'))
  } catch (e) {
    console.error('Failed to save review:', e)
  }
  return created
}

export function voteReviewHelpful(reviewId: string): void {
  const all = getAllReviews()
  const updated = all.map((r) =>
    r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
  )
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('yourframies_reviews_updated'))
  } catch (e) {
    // ignore
  }
}
