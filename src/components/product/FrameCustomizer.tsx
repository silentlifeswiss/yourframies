import React, { useState } from 'react'
import { Upload, Check, Sparkles, RefreshCw, Info } from 'lucide-react'
import { FrameCustomization, Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/formatters'

interface FrameCustomizerProps {
  baseProduct?: Product
  onAddedToCart?: () => void
}

const DEFAULT_SAMPLE_PHOTO =
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=85'

export const FrameCustomizer: React.FC<FrameCustomizerProps> = ({
  baseProduct,
  onAddedToCart,
}) => {
  const { addToCart } = useCart()

  const [uploadedImage, setUploadedImage] = useState<string>(DEFAULT_SAMPLE_PHOTO)
  const [isCustomPhoto, setIsCustomPhoto] = useState(false)
  const [photoName, setPhotoName] = useState<string>('sample-artwork.jpg')

  // Customization State
  const [frameSize, setFrameSize] = useState<FrameCustomization['frameSize']>('12x18')
  const [moulding, setMoulding] = useState<FrameCustomization['moulding']>('Black Wood')
  const [matColor, setMatColor] = useState<FrameCustomization['matColor']>('Pure White')
  const [glassType, setGlassType] = useState<FrameCustomization['glassType']>('Acrylic Glaze')

  // Pricing configuration
  const basePrice = baseProduct ? baseProduct.basePriceINR : 1299
  let sizeAddon = 0
  if (frameSize === '12x18') sizeAddon = 300
  if (frameSize === '16x24') sizeAddon = 700
  if (frameSize === '20x30') sizeAddon = 1200
  if (frameSize === '24x36') sizeAddon = 1800

  let glassAddon = glassType === 'Anti-Glare UV Glass' ? 350 : 0
  const finalPrice = basePrice + sizeAddon + glassAddon

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB limit. Please upload a smaller high-res photo.')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string)
          setIsCustomPhoto(true)
          setPhotoName(file.name)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Frame Border Styles
  const getMouldingStyle = () => {
    switch (moulding) {
      case 'Black Wood':
        return 'bg-neutral-900 border-[16px] sm:border-[22px] border-neutral-900 shadow-2xl ring-1 ring-neutral-800'
      case 'White Minimalist':
        return 'bg-neutral-100 border-[16px] sm:border-[22px] border-neutral-200 shadow-2xl ring-1 ring-neutral-300'
      case 'Natural Oak':
        return 'bg-[#d2b48c] border-[16px] sm:border-[22px] border-[#c49a6c] shadow-2xl ring-1 ring-[#b28758]'
      case 'Walnut':
        return 'bg-[#4a2e18] border-[16px] sm:border-[22px] border-[#3b220e] shadow-2xl ring-1 ring-[#2c1706]'
      case 'Gold Leaf':
        return 'bg-[#d4af37] border-[16px] sm:border-[22px] border-[#c59b27] shadow-2xl ring-1 ring-[#a88118]'
      default:
        return 'bg-neutral-900 border-[18px] border-neutral-900 shadow-2xl'
    }
  }

  // Mat Board Padding & Background
  const getMatStyle = () => {
    switch (matColor) {
      case 'None':
        return 'p-0'
      case 'Pure White':
        return 'p-5 sm:p-8 bg-neutral-50 shadow-inner'
      case 'Off-White':
        return 'p-5 sm:p-8 bg-[#f7f5f0] shadow-inner'
      case 'Jet Black':
        return 'p-5 sm:p-8 bg-neutral-950 shadow-inner'
      default:
        return 'p-6 bg-white'
    }
  }

  const handleAddToCart = () => {
    const targetProduct: Product = baseProduct || {
      id: 'custom-bespoke-frame',
      title: isCustomPhoto ? `Personalised Studio Frame (${photoName})` : 'Bespoke Studio Custom Frame',
      slug: 'custom-studio-frame',
      description: `Custom ${frameSize} frame crafted in ${moulding} with ${matColor} matting and ${glassType}.`,
      basePriceINR: basePrice,
      images: [uploadedImage],
      availableSizes: ['8x10', '12x18', '16x24', '20x30', '24x36'],
      availableMouldings: ['Black Wood', 'White Minimalist', 'Natural Oak', 'Walnut', 'Gold Leaf'],
      isCustomizable: true,
      isActive: true,
      stockQuantity: 999,
    }

    addToCart(
      targetProduct,
      {
        frameSize,
        moulding,
        matColor,
        glassType,
        photoUrl: uploadedImage,
      },
      1,
      finalPrice
    )

    if (onAddedToCart) onAddedToCart()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left: Interactive Real-Time Visualizer Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-neutral-100/80 rounded-2xl p-6 sm:p-12 flex items-center justify-center min-h-[460px] sm:min-h-[580px] relative border border-neutral-200">
          {/* Wall Hanging Shadow & 2D Realistic Frame Bevel */}
          <div
            className={`transition-all duration-300 relative max-w-[92%] sm:max-w-[440px] w-full flex items-center justify-center ${getMouldingStyle()}`}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Matboard Mount */}
            <div className={`w-full transition-all duration-300 ${getMatStyle()}`}>
              {/* Photo Area */}
              <div className="relative overflow-hidden aspect-[3/4] bg-neutral-200 shadow-sm">
                <img
                  src={uploadedImage}
                  alt="Customized Artwork Preview"
                  className="w-full h-full object-cover transition-all"
                />

                {/* Glaze Reflection Simulation */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    glassType === 'Anti-Glare UV Glass'
                      ? 'opacity-10 bg-gradient-to-tr from-transparent via-sky-200 to-transparent'
                      : 'opacity-25 bg-gradient-to-tr from-transparent via-white to-transparent'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Quick Info Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-sm text-[11px] font-medium text-neutral-600 tracking-wider uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Live Preview • {frameSize}" • {moulding}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-4 w-full flex items-center justify-between text-xs text-neutral-500 px-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload Your Photo (PNG/JPG up to 15MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          {isCustomPhoto && (
            <button
              type="button"
              onClick={() => {
                setUploadedImage(DEFAULT_SAMPLE_PHOTO)
                setIsCustomPhoto(false)
                setPhotoName('sample-artwork.jpg')
              }}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to sample
            </button>
          )}
        </div>
      </div>

      {/* Right: Customization Controls */}
      <div className="lg:col-span-5 space-y-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
            Bespoke Customizer
          </span>
          <h2 className="text-2xl font-serif text-neutral-900 mt-1">Design Your Perfect Frame</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Hand-assembled with sustainably sourced wood and archival cotton giclée prints.
          </p>
        </div>

        {/* 1. Frame Size Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
            1. Select Size (Inches)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(['8x10', '12x18', '16x24', '20x30', '24x36'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFrameSize(size)}
                className={`py-2 px-1 text-center rounded-md border text-xs font-semibold transition-all ${
                  frameSize === size
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                }`}
              >
                {size}"
              </button>
            ))}
          </div>
        </div>

        {/* 2. Moulding Timber Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
            2. Wood Moulding Finish: <span className="text-neutral-900">{moulding}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(
              [
                { name: 'Black Wood', color: '#171717' },
                { name: 'White Minimalist', color: '#f5f5f5' },
                { name: 'Natural Oak', color: '#d2b48c' },
                { name: 'Walnut', color: '#4a2e18' },
                { name: 'Gold Leaf', color: '#d4af37' },
              ] as const
            ).map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setMoulding(item.name)}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  moulding === item.name
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Mat / Mount Board Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
            3. Passe-Partout Matting: <span className="text-neutral-900">{matColor}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['None', 'Pure White', 'Off-White', 'Jet Black'] as const).map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => setMatColor(mat)}
                className={`py-2 px-2 text-center rounded-md border text-xs font-medium transition-all ${
                  matColor === mat
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Glazing Glass Option */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
            4. Protective Glazing
          </label>
          <div className="space-y-2">
            <label
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                glassType === 'Acrylic Glaze'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="glass"
                  checked={glassType === 'Acrylic Glaze'}
                  onChange={() => setGlassType('Acrylic Glaze')}
                  className="accent-neutral-900"
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    Shatterproof Acrylic Glaze
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Lightweight, 100% transit-safe & ultra clear (Standard)
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-500">Included</span>
            </label>

            <label
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                glassType === 'Anti-Glare UV Glass'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="glass"
                  checked={glassType === 'Anti-Glare UV Glass'}
                  onChange={() => setGlassType('Anti-Glare UV Glass')}
                  className="accent-neutral-900"
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    Museum Anti-Glare UV Glass (+₹350)
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Zero reflections under room lighting & 99% UV fade resistance
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-neutral-900">+₹350</span>
            </label>
          </div>
        </div>

        {/* Price and Add to Bag Button */}
        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Total Price</span>
            <div className="text-2xl font-bold text-neutral-900">{formatINR(finalPrice)}</div>
            <p className="text-[10px] text-neutral-500">Taxes included • Free Pan-India Delivery</p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 max-w-xs py-3.5 px-6 rounded-md bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Add To Bag
          </button>
        </div>
      </div>
    </div>
  )
}
