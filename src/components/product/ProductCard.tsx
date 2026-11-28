import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product } from '../../types'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/formatters'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()

  const inWishlist = isInWishlist(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product, {
      frameSize: 'A4',
      moulding: 'Deep Black',
      glassType: 'Acrylic Glaze',
    })
  }

  const discountPercent = product.compareAtPriceINR
    ? Math.round(((product.compareAtPriceINR - product.basePriceINR) / product.compareAtPriceINR) * 100)
    : 0

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Image Container with Frame Bevel */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 rounded-sm">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-neutral-600 hover:text-black hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 bg-neutral-900 text-white text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest font-semibold uppercase rounded-xs">
            Save {discountPercent}%
          </div>
        )}

        {/* Quick Add Overlay (Desktop) */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-white/95 backdrop-blur-md text-neutral-900 text-xs uppercase tracking-widest font-semibold shadow-md hover:bg-neutral-900 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-2 sm:pt-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
            <Link to={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-neutral-500 truncate">
            A4 Frame • Deep Black & Minimalist White
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {formatINR(product.basePriceINR)}
            </span>
            {product.compareAtPriceINR && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                {formatINR(product.compareAtPriceINR)}
              </span>
            )}
          </div>

          {/* Quick mobile 1-tap add button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden p-1.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            aria-label={`Add ${product.title} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
