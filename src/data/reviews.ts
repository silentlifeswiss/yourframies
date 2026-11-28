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

export const REVIEWS: Review[] = []

export const REVIEWS_STORAGE_KEY = 'yourframies_product_reviews_db'

export function getAllReviews(): Review[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    // fallback
  }
  return REVIEWS
}

export function getReviewsForProduct(productSlugOrId: string, productTitle?: string): Review[] {
  const all = getAllReviews()
  return all.filter(
    (r) =>
      r.productId === productSlugOrId ||
      r.productSlug === productSlugOrId ||
      (productTitle && r.productTitle?.toLowerCase() === productTitle.toLowerCase())
  )
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
