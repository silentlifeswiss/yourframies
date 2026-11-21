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
      frameSize: '12x18',
      moulding: 'Black Wood',
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
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            inWishlist
              ? 'bg-red-50 text-red-500'
              : 'bg-white/80 text-neutral-600 hover:text-black hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-900 text-white text-[10px] tracking-widest font-semibold uppercase rounded-xs">
            Save {discountPercent}%
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
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
      <div className="pt-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
            <Link to={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            {product.availableSizes.slice(0, 3).join(', ')} • {product.availableMouldings[0]}
          </p>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            {formatINR(product.basePriceINR)}
          </span>
          {product.compareAtPriceINR && (
            <span className="text-xs text-neutral-400 line-through">
              {formatINR(product.compareAtPriceINR)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
