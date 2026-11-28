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

  // Customization State (A4 Exclusive & Deep Black / Minimalist White)
  const [frameSize] = useState<FrameCustomization['frameSize']>('A4')
  const [moulding, setMoulding] = useState<FrameCustomization['moulding']>('Deep Black')

  // Pricing configuration
  const basePrice = baseProduct ? baseProduct.basePriceINR : 1299
  const finalPrice = basePrice

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
      case 'Deep Black':
      case 'Black Wood':
        return 'bg-neutral-900 border-[16px] sm:border-[22px] border-neutral-900 shadow-2xl ring-1 ring-neutral-800'
      case 'Minimalist White':
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

  const handleAddToCart = () => {
    const targetProduct: Product = baseProduct || {
      id: 'custom-bespoke-frame',
      title: isCustomPhoto ? `Custom A4 Frame (${photoName})` : 'Custom A4 Photo Frame',
      slug: 'custom-studio-frame',
      description: `A4 frame in ${moulding}.`,
      basePriceINR: basePrice,
      images: [uploadedImage],
      availableSizes: ['A4'],
      availableMouldings: ['Deep Black', 'Minimalist White'],
      isCustomizable: true,
      isActive: true,
      stockQuantity: 999,
    }

    addToCart(
      targetProduct,
      {
        frameSize,
        moulding,
        photoUrl: uploadedImage,
      },
      1,
      finalPrice
    )

    if (onAddedToCart) onAddedToCart()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
      {/* Left: Interactive Real-Time Visualizer Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-neutral-100/80 rounded-2xl p-6 sm:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[480px] relative border border-neutral-200">
          {/* Wall Hanging Shadow & Direct A4 Frame (No Matboard Border) */}
          <div
            className={`transition-all duration-300 relative max-w-[85%] sm:max-w-[380px] w-full flex items-center justify-center ${getMouldingStyle()}`}
            style={{
              boxShadow: '0 22px 45px -12px rgba(0, 0, 0, 0.35), 0 8px 14px -3px rgba(0, 0, 0, 0.18)',
            }}
          >
            {/* Photo Area directly inside frame */}
            <div className="w-full relative overflow-hidden aspect-[3/4] bg-neutral-200">
              <img
                src={uploadedImage}
                alt="Customized Artwork Preview"
                className="w-full h-full object-cover transition-all"
              />
            </div>
          </div>

          {/* Quick Info Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 shadow-sm text-[11px] font-medium text-neutral-700 tracking-wider uppercase flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Live Preview • A4 • {moulding}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 px-1">
          <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors shadow-xs active:scale-[0.98]">
            <Upload className="w-4 h-4" />
            <span>Upload Your Photo (JPG/PNG)</span>
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
      <div className="lg:col-span-5 space-y-6 sm:space-y-7 bg-white p-4 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
            Custom Frame Builder
          </span>
          <h2 className="text-2xl font-serif text-neutral-900 mt-1">Frame Your Photo</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Upload your photo and choose between Deep Black or Minimalist White A4 finish.
          </p>
        </div>

        {/* 1. Frame Size Selector */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2">
            <span>1. Frame Size</span>
            <span className="text-neutral-500 normal-case font-normal text-xs">
              Standard A4 Only
            </span>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-900 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                A4
              </div>
              <div>
                <p className="font-bold text-sm text-neutral-900">A4 Frame</p>
                <p className="text-xs text-neutral-600 font-mono mt-0.5">21.0 × 29.7 cm (8.3 × 11.7 in)</p>
              </div>
            </div>
            <span className="text-[11px] bg-neutral-200 text-neutral-800 font-semibold px-2 py-0.5 rounded">
              Ready to Hang
            </span>
          </div>
        </div>

        {/* 2. Frame Color Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-2.5">
            2. Frame Color: <span className="text-neutral-900 font-bold">{moulding}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Deep Black', color: '#171717', desc: 'Matte black finish' },
              { name: 'Minimalist White', color: '#ffffff', desc: 'Clean white finish' },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setMoulding(item.name as any)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-medium text-left transition-all min-h-[56px] ${
                  moulding === item.name
                    ? 'border-neutral-900 bg-neutral-100 ring-2 ring-neutral-900 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shrink-0 shadow-inner"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <span className="block font-bold text-neutral-900">{item.name}</span>
                  <span className="block text-[11px] text-neutral-500">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Bag Button */}
        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400">Total Price</span>
            <div className="text-xl sm:text-2xl font-bold text-neutral-900">{formatINR(finalPrice)}</div>
            <p className="text-[10px] text-neutral-500">Taxes included • Free Pan-India Delivery</p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs py-3.5 px-6 rounded-md bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Add To Bag
          </button>
        </div>
      </div>
    </div>
  )
}
