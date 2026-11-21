import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { INITIAL_PRODUCTS } from '../data/products'
import { ProductCard } from '../components/product/ProductCard'

export const WishlistPage: React.FC = () => {
  const { wishlistIds, clearWishlist } = useWishlist()

  const wishlistProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id))

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <Heart className="w-16 h-16 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-serif text-neutral-900">Your Wishlist is Empty</h1>
        <p className="text-xs text-neutral-500 mt-2 max-w-sm">
          Save your favourite automotive frames and minimalist artwork here to easily purchase later.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-8 py-3 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Saved Pieces
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              My Wishlist ({wishlistProducts.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-neutral-500 hover:text-black underline"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
