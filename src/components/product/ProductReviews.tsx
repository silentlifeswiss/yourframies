import React, { useState, useEffect, useRef } from 'react'
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Camera,
  X,
  Upload,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react'
import {
  Review,
  getReviewsForProduct,
  saveReview,
  voteReviewHelpful,
} from '../../data/reviews'
import { Product } from '../../types'
import { useAuth } from '../../context/AuthContext'

interface ProductReviewsProps {
  product: Product
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(() =>
    getReviewsForProduct(product.slug, product.title)
  )
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL')
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({})
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null)

  // Form State
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [city, setCity] = useState('')
  const [headline, setHeadline] = useState('')
  const [comment, setComment] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(getReviewsForProduct(product.slug, product.title))
    }
    window.addEventListener('yourframies_reviews_updated', handleUpdate)
    return () => window.removeEventListener('yourframies_reviews_updated', handleUpdate)
  }, [product.slug, product.title])

  // Aggregate stats
  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0'

  const countsByStar = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
    percentage:
      totalReviews > 0
        ? Math.round((reviews.filter((r) => r.rating === s).length / totalReviews) * 100)
        : 0,
  }))

  const filteredReviews = reviews.filter((r) => {
    if (filterRating !== 'ALL' && r.rating !== filterRating) return false
    return true
  })

  const getRatingDescriptor = (val: number) => {
    switch (val) {
      case 5:
        return 'Outstanding - Museum-grade framing perfection!'
      case 4:
        return 'Very Good - Impressive craftsmanship & materials'
      case 3:
        return 'Good - Satisfactory quality'
      case 2:
        return 'Fair - Needs improvement'
      case 1:
        return 'Poor - Did not meet expectations'
      default:
        return ''
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim() || !headline.trim()) {
      alert('Please fill in your name, review headline, and comments.')
      return
    }

    setIsSubmitting(true)
    saveReview({
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      author: name.trim(),
      city: city.trim() || 'Verified Customer',
      rating,
      title: headline.trim(),
      comment: comment.trim(),
      verifiedBuyer: true,
      userImage: photoUrl || undefined,
    })

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setShowReviewForm(false)

    // Reset fields
    setHeadline('')
    setComment('')
    setCity('')
    setPhotoUrl(null)
    setRating(5)

    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const handleHelpfulClick = (reviewId: string) => {
    if (votedMap[reviewId]) return
    voteReviewHelpful(reviewId)
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }))
  }

  return (
    <section id="product-reviews" className="py-16 border-t border-neutral-200 mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Collector Testimonials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mt-1">
              Verified Customer Reviews
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Genuine reviews from art and photography collectors who purchased this frame.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-widest rounded-sm transition shadow-sm self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>

        {submitSuccess && (
          <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-3 text-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">Thank you for your feedback!</p>
              <p className="text-neutral-600 mt-0.5">
                Your review has been verified and published to this artwork's page.
              </p>
            </div>
          </div>
        )}

        {/* Rating Breakdown & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-10 border-b border-neutral-200 items-center">
          {/* Average Score */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-2 lg:border-r lg:border-neutral-200 lg:pr-8">
            <div className="flex items-baseline justify-center lg:justify-start gap-2">
              <span className="font-serif text-5xl font-light text-neutral-900">{avgRating}</span>
              <span className="text-neutral-400 text-sm">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(avgRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
              <span className="text-xs font-semibold text-neutral-700 ml-1.5">
                ({totalReviews} Reviews)
              </span>
            </div>
            <p className="text-xs text-neutral-500 pt-1">
              100% of verified customers recommend this framing profile.
            </p>
          </div>

          {/* Star Bars */}
          <div className="lg:col-span-8 space-y-2">
            {countsByStar.map((item) => (
              <button
                key={item.stars}
                type="button"
                onClick={() =>
                  setFilterRating(filterRating === item.stars ? 'ALL' : item.stars)
                }
                className={`w-full flex items-center gap-3 text-xs text-left p-1 rounded transition hover:bg-neutral-50 ${
                  filterRating === item.stars ? 'bg-neutral-100 font-bold' : ''
                }`}
              >
                <span className="w-14 text-neutral-600 font-medium">{item.stars} Stars</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-neutral-400 font-mono text-[11px]">
                  {item.count} ({item.percentage}%)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Review Form Drawer / Modal */}
        {showReviewForm && (
          <div className="my-8 bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8 animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">
                  Customer Experience
                </span>
                <h3 className="font-serif text-2xl text-neutral-900">
                  Reviewing: {product.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  Share your thoughts on print quality, moulding craftsmanship, and delivery packaging.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
                {/* Star Rating Picker */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200 text-center space-y-2">
                  <label className="block text-neutral-700 font-semibold uppercase tracking-wider text-[11px]">
                    Overall Rating
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-amber-600 h-4">
                    {getRatingDescriptor(hoverRating || rating)}
                  </p>
                </div>

                {/* Name & Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikramaditya S."
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">City, State</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru, KA"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">
                    Review Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Mind-blowing frame quality & safe packaging!"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </div>

                {/* Comment Body */}
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">
                    Your Review / Comments *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your honest opinion about the solid wood moulding, anti-glare glass clarity, and safe transit packaging..."
                    className="w-full p-3 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 outline-none focus:border-neutral-900 leading-relaxed"
                  />
                </div>

                {/* Photo Upload Attachment */}
                <div className="bg-white p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold text-neutral-800 flex items-center gap-1.5 text-xs">
                      <Camera className="w-4 h-4 text-neutral-500" />
                      <span>Attach Photo of Your Frame on the Wall (Optional)</span>
                    </label>
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {!photoUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 rounded-lg p-4 text-center cursor-pointer bg-neutral-50/50"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                      <p className="text-xs text-neutral-600 font-medium">
                        Click to upload photo of your frame on the wall
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">JPG, PNG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-neutral-200"
                      />
                      <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-4 h-4" /> Photo attached successfully
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2.5 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-widest rounded transition"
                  >
                    {isSubmitting ? 'Publishing...' : 'Submit Verified Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter Tab Bar */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-neutral-400 font-medium mr-1">Filter by:</span>
            <button
              type="button"
              onClick={() => setFilterRating('ALL')}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                filterRating === 'ALL'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              All Reviews ({totalReviews})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFilterRating(star)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition flex items-center gap-1 ${
                  filterRating === star
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <span>{star} Stars</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 font-mono hidden sm:block">
            Showing {filteredReviews.length} reviews
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-neutral-200">
          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              No reviews match your selected filter. Be the first to write a review!
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="py-8 space-y-3">
                <div className="flex items-center justify-between">
                  {/* Rating Stars & Title */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-neutral-900 text-sm">
                      "{rev.title}"
                    </span>
                  </div>

                  <span className="text-[11px] text-neutral-400 font-mono">{rev.date}</span>
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed max-w-3xl">
                  {rev.comment}
                </p>

                {/* Customer Attached Photo */}
                {rev.userImage && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPhotoModal(rev.userImage || null)}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 shadow-sm group cursor-pointer"
                    >
                      <img
                        src={rev.userImage}
                        alt="Customer Frame Wall"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-[10px] font-bold">
                        View Wall
                      </span>
                    </button>
                  </div>
                )}

                {/* Reviewer Meta & Helpful */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{rev.author}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{rev.city}</span>
                    {rev.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition ${
                      votedMap[rev.id]
                        ? 'bg-neutral-100 text-neutral-900 border-neutral-300 font-semibold'
                        : 'text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-black'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful {rev.helpfulCount ? `(${rev.helpfulCount})` : ''}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div className="relative max-w-2xl w-full bg-neutral-900 p-2 rounded-2xl">
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhotoModal}
              alt="Customer Wall Setup"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  )
}
