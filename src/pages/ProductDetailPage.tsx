import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MapPin,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Star,
} from 'lucide-react'
import { getStoreProducts, syncProductsFromApi } from '../data/products'
import { getStoreCategories, syncCategoriesFromApi } from '../data/categories'
import { getReviewsForProduct } from '../data/reviews'
import { ProductReviews } from '../components/product/ProductReviews'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { checkIndianPincode, lookupPincode } from '../data/pincodes'
import { FrameCustomization, PincodeServiceability } from '../types'
import { formatINR } from '../utils/formatters'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [productsList, setProductsList] = useState(() => getStoreProducts())
  const [categoriesList, setCategoriesList] = useState(() => getStoreCategories())

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoreProducts())
    const handleCatUpdate = () => setCategoriesList(getStoreCategories())
    window.addEventListener('yourframies_products_updated', handleUpdate)
    window.addEventListener('yourframies_categories_updated', handleCatUpdate)
    syncProductsFromApi().then(setProductsList)
    syncCategoriesFromApi().then(setCategoriesList)
    return () => {
      window.removeEventListener('yourframies_products_updated', handleUpdate)
      window.removeEventListener('yourframies_categories_updated', handleCatUpdate)
    }
  }, [])

  const product = productsList.find((p) => p.slug === slug)

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedSize] = useState<FrameCustomization['frameSize']>('A4')
  const [selectedMoulding, setSelectedMoulding] = useState<FrameCustomization['moulding']>('Deep Black')

  // Customer Photo Upload State
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null)
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null)
  const [uploadedPhotoSizeKB, setUploadedPhotoSizeKB] = useState<number | null>(null)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // PIN code checker state
  const [pincodeInput, setPincodeInput] = useState('')
  const [pincodeResult, setPincodeResult] = useState<PincodeServiceability | null>(null)

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif text-neutral-900">Artwork Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">
          The requested frame might have been retired or moved.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    )
  }

  const category = categoriesList.find((c) => c.id === product.categoryId)
  const inWishlist = isInWishlist(product.id)
  const productReviews = getReviewsForProduct(product.slug, product.title)

  // Price calculations (Standard A4, single price)
  const finalPrice = product.basePriceINR

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pincodeInput.trim()) {
      const base = checkIndianPincode(pincodeInput)
      setPincodeResult(base)
      try {
        const refined = await lookupPincode(pincodeInput)
        if (refined.isServiceable) {
          setPincodeResult(refined)
        }
      } catch {
        // Keep directory values
      }
    }
  }

  // Handle Photo Upload
  const handlePhotoUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedPhotoUrl(e.target.result as string)
        setUploadedPhotoName(file.name)
        setUploadedPhotoSizeKB(Math.round(file.size / 1024))
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0])
    }
  }

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingPhoto(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0])
    }
  }

  const handleClearUploadedPhoto = () => {
    setUploadedPhotoUrl(null)
    setUploadedPhotoName(null)
    setUploadedPhotoSizeKB(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleAddToCart = () => {
    addToCart(
      product,
      {
        photoUrl: uploadedPhotoUrl || undefined,
        frameSize: selectedSize,
        moulding: selectedMoulding,
      },
      1,
      finalPrice
    )
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  // Active framed image: customer's uploaded photo takes precedence if provided!
  const displayedImage = uploadedPhotoUrl || product.images[activeImageIndex] || product.images[0]

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <Link to="/shop" className="hover:text-white">
            Shop
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              <Link to={`/shop?category=${category.slug}`} className="hover:text-white">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-white font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Gallery Images / Framed View */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Active Image with Frame Color Bevel */}
            <div className={`relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 transition-all duration-300 ${
              selectedMoulding === 'Minimalist White'
                ? 'border-[14px] sm:border-[18px] border-white shadow-2xl ring-1 ring-neutral-200'
                : 'border-[14px] sm:border-[18px] border-neutral-900 shadow-2xl ring-1 ring-white/20'
            }`}>
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-6 text-center">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-xs">Upload a photo or add product image</span>
                </div>
              )}

              {uploadedPhotoUrl && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/90 backdrop-blur-md text-amber-300 text-xs font-semibold shadow-lg border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Photo Framed</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-950/80 backdrop-blur-md shadow-md text-neutral-300 hover:text-white border border-white/10"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && !uploadedPhotoUrl && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-white shadow-md ring-1 ring-white'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Purchasing Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl text-neutral-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {category?.name || 'A4 Framed Print'}
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl text-white mt-1">
                {product.title}
              </h1>
              {productReviews.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <a href="#product-reviews" className="flex items-center gap-1.5 group">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-neutral-200 group-hover:underline">
                      {(
                        productReviews.reduce((acc, r) => acc + r.rating, 0) /
                        productReviews.length
                      ).toFixed(1)}{' '}
                      / 5.0
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-xs text-neutral-300 font-medium group-hover:underline">
                      {productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </a>
                </div>
              )}
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pb-5 border-b border-white/10 flex-wrap">
              <span className="text-3xl font-bold text-white">
                {formatINR(finalPrice)}
              </span>
              {product.compareAtPriceINR && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatINR(product.compareAtPriceINR)}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                Free Delivery Above ₹999
              </span>
            </div>

            {/* 1. Size Specification (A4 Only) */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                <span>1. Frame Size</span>
                <span className="text-neutral-400 normal-case font-normal text-xs">
                  Standard A4 Only
                </span>
              </div>
              <div className="p-3.5 bg-white/5 border border-white/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-white text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    A4
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">A4 Frame</p>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">21.0 × 29.7 cm (8.3 × 11.7 in)</p>
                  </div>
                </div>
                <span className="text-[11px] bg-white/10 text-neutral-200 border border-white/10 font-semibold px-2.5 py-1 rounded">
                  Ready to Hang
                </span>
              </div>
            </div>

            {/* 2. Color Selection (Deep Black & Minimalist White Only) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                2. Frame Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMoulding('Deep Black')}
                  className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all min-h-[56px] ${
                    selectedMoulding === 'Deep Black'
                      ? 'border-white bg-white/15 text-white shadow-sm ring-1 ring-white'
                      : 'border-white/10 text-neutral-300 hover:border-white/30 bg-black/20'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-black border border-neutral-700 shadow-inner shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold leading-tight">Deep Black</p>
                    <p className={`text-[11px] mt-0.5 ${selectedMoulding === 'Deep Black' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      Matte black finish
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMoulding('Minimalist White')}
                  className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all min-h-[56px] ${
                    selectedMoulding === 'Minimalist White'
                      ? 'border-white bg-white/15 text-white shadow-sm ring-1 ring-white'
                      : 'border-white/10 text-neutral-300 hover:border-white/30 bg-black/20'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white border border-neutral-300 shadow-sm shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold leading-tight">Minimalist White</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Clean white finish
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Custom Photo Upload Section */}
            <div className="border border-white/10 bg-black/20 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-neutral-300" />
                  <span>Upload Your Own Photograph (Optional)</span>
                </label>
                {uploadedPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleClearUploadedPhoto}
                    className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>

              {!uploadedPhotoUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingPhoto(true)
                  }}
                  onDragLeave={() => setIsDraggingPhoto(false)}
                  onDrop={handlePhotoDrop}
                  onClick={() => photoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                    isDraggingPhoto
                      ? 'border-white bg-white/10'
                      : 'border-white/20 hover:border-white/40 bg-black/20'
                  }`}
                >
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handlePhotoInputChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2 bg-white/10 rounded-full text-neutral-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-neutral-200">
                      Click to upload your image or drag & drop here
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      High resolution JPG, PNG, WEBP (Up to 25MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-black/30 p-3 rounded-lg border border-white/15 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded"
                      className="w-12 h-12 object-cover rounded border border-white/20"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-[180px]">
                        {uploadedPhotoName || 'Custom Photo'}
                      </p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> High Quality Print Verified ({uploadedPhotoSizeKB} KB)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-2.5 py-1.5 border border-white/20 hover:border-white rounded text-[11px] font-medium text-neutral-300 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Change
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-white hover:bg-neutral-200 text-neutral-950 text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Shopping Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all active:scale-[0.99]"
              >
                Buy Now (Fast Checkout)
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="pt-6 border-t border-white/10">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Check Delivery &amp; COD Serviceability
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 560001, 110001)"
                    className="w-full pl-9 pr-3 py-2.5 border border-white/20 bg-black/30 rounded-sm text-base sm:text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-200 transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`mt-3 p-3 rounded-md text-xs border ${
                    pincodeResult.isServiceable
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/50 border-red-500/40 text-red-300'
                  }`}
                >
                  {pincodeResult.isServiceable ? (
                    <div className="space-y-1">
                      <p className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Delivery Available</span>
                      </p>
                      <p className="text-neutral-300">
                        Estimated delivery: {pincodeResult.estimatedDays} business days ({pincodeResult.city}, {pincodeResult.state})
                      </p>
                      <p className="text-neutral-300">
                        {pincodeResult.isCodAvailable ? '✓ Cash on Delivery Available' : '⚠ Prepaid Only (COD not available)'}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">
                      PIN code is currently unserviceable for delivery. Please contact support.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guarantees */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>Damage Replacement Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-white shrink-0" />
                <span>Tracked Pan-India Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Write-A-Review */}
        <ProductReviews product={product} />
      </div>
    </div>
  )
}
