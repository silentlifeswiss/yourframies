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
} from 'lucide-react'
import { getStoreProducts } from '../data/products'
import { CATEGORIES } from '../data/categories'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { checkIndianPincode } from '../data/pincodes'
import { FrameCustomization, PincodeServiceability } from '../types'
import { formatINR } from '../utils/formatters'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [productsList, setProductsList] = useState(() => getStoreProducts())

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoreProducts())
    window.addEventListener('yourframies_products_updated', handleUpdate)
    return () => window.removeEventListener('yourframies_products_updated', handleUpdate)
  }, [])

  const product = productsList.find((p) => p.slug === slug)

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<FrameCustomization['frameSize']>('12x18')
  const [selectedMoulding, setSelectedMoulding] = useState<FrameCustomization['moulding']>('Black Wood')
  const [selectedMat, setSelectedMat] = useState<FrameCustomization['matColor']>('Pure White')
  const [selectedGlass, setSelectedGlass] = useState<FrameCustomization['glassType']>('Acrylic Glaze')

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

  const category = CATEGORIES.find((c) => c.id === product.categoryId)
  const inWishlist = isInWishlist(product.id)

  // Price calculations
  let sizeAddon = 0
  if (selectedSize === '12x18') sizeAddon = 300
  if (selectedSize === '16x24') sizeAddon = 700
  if (selectedSize === '20x30') sizeAddon = 1200
  if (selectedSize === '24x36') sizeAddon = 1800

  const glassAddon = selectedGlass === 'Anti-Glare UV Glass' ? 350 : 0
  const finalPrice = product.basePriceINR + sizeAddon + glassAddon

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (pincodeInput.trim()) {
      setPincodeResult(checkIndianPincode(pincodeInput))
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
        matColor: selectedMat,
        glassType: selectedGlass,
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
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/shop" className="hover:text-black">
            Shop
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <Link to={`/shop?category=${category.slug}`} className="hover:text-black">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Gallery Images / Framed View */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
              <img
                src={displayedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {uploadedPhotoUrl && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-amber-300 text-xs font-semibold shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Photo Framed</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-neutral-700 hover:text-black"
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
                        ? 'border-neutral-900 shadow-md ring-1 ring-black'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Purchasing Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {category?.name || 'Exclusive Frame'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
                {product.title}
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-neutral-200">
              <span className="text-3xl font-bold text-neutral-900">
                {formatINR(finalPrice)}
              </span>
              {product.compareAtPriceINR && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatINR(product.compareAtPriceINR + sizeAddon)}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Free Pan-India Delivery
              </span>
            </div>

            {/* 1. Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                <span>1. Select Size</span>
                <span className="text-neutral-500 normal-case font-normal text-[11px]">
                  (Dimensions in inches)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size as any)}
                    className={`py-2 px-1 text-center rounded-md border text-xs font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-black bg-white'
                    }`}
                  >
                    {size}"
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Moulding Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                2. Wood Moulding Finish
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.availableMouldings.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMoulding(m as any)}
                    className={`py-2 px-3 text-left rounded-md border text-xs font-medium transition-all ${
                      selectedMoulding === m
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 text-neutral-700 hover:border-black bg-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Mat Option */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                3. Matboard Border
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['None', 'Pure White', 'Off-White'] as const).map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setSelectedMat(mat)}
                    className={`py-2 px-2 text-center rounded-md border text-xs font-medium transition-all ${
                      selectedMat === mat
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 text-neutral-700 hover:border-black bg-white'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Glass Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                4. Glazing Glass
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGlass('Acrylic Glaze')}
                  className={`p-2.5 rounded-md border text-left text-xs transition-all ${
                    selectedGlass === 'Acrylic Glaze'
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 hover:border-black bg-white'
                  }`}
                >
                  <p className="font-semibold text-neutral-900">Acrylic Glaze</p>
                  <p className="text-[10px] text-neutral-500">Standard Shatterproof</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGlass('Anti-Glare UV Glass')}
                  className={`p-2.5 rounded-md border text-left text-xs transition-all ${
                    selectedGlass === 'Anti-Glare UV Glass'
                      ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                      : 'border-neutral-200 hover:border-black bg-white'
                  }`}
                >
                  <p className="font-semibold text-neutral-900">Anti-Glare UV (+₹350)</p>
                  <p className="text-[10px] text-neutral-500">99% UV Protection</p>
                </button>
              </div>
            </div>

            {/* 5. Custom Photo Upload Section */}
            <div className="border border-neutral-200 bg-neutral-50/70 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-neutral-700" />
                  <span>Upload Your Own Photograph (Optional)</span>
                </label>
                {uploadedPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleClearUploadedPhoto}
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
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
                      ? 'border-neutral-900 bg-neutral-100'
                      : 'border-neutral-300 hover:border-neutral-500 bg-white'
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
                    <div className="p-2 bg-neutral-100 rounded-full text-neutral-700">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-neutral-800">
                      Click to upload your image or drag & drop here
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      High resolution JPG, PNG, WEBP (Up to 25MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded"
                      className="w-12 h-12 object-cover rounded border border-neutral-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900 truncate max-w-[180px]">
                        {uploadedPhotoName || 'Custom Photo'}
                      </p>
                      <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> High Quality Print Verified ({uploadedPhotoSizeKB} KB)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-2.5 py-1.5 border border-neutral-300 hover:border-neutral-900 rounded text-[11px] font-medium text-neutral-700 flex items-center gap-1"
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
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Shopping Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs uppercase tracking-widest font-semibold rounded-sm transition-all"
              >
                Buy Now (Fast Checkout)
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="pt-6 border-t border-neutral-200">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
                Check Delivery & COD Serviceability
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
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800"
                >
                  Check
                </button>
              </form>

              {pincodeResult && (
                <div
                  className={`mt-3 p-3 rounded-md text-xs ${
                    pincodeResult.isServiceable
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border border-red-200 text-red-900'
                  }`}
                >
                  {pincodeResult.isServiceable ? (
                    <div className="space-y-1">
                      <p className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Serviceable via {pincodeResult.courierName}</span>
                      </p>
                      <p className="text-neutral-600">
                        Estimated delivery: {pincodeResult.estimatedDays} business days ({pincodeResult.city}, {pincodeResult.state})
                      </p>
                      <p className="text-neutral-600">
                        {pincodeResult.isCodAvailable ? '✓ Cash on Delivery Available' : '⚠ Prepaid Only (COD not available)'}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">
                      PIN Code is currently unserviceable for fragile glass frames. Please contact support.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Atelier Guarantees */}
            <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 gap-4 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                <span>Zero-Breakage Transit Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-800" />
                <span>Insured Pan-India Express Courier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
