import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Sparkles, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export const MobileBottomNav: React.FC = () => {
  const location = useLocation()
  const { itemCount, setIsCartOpen } = useCart()
  const { wishlistCount } = useWishlist()

  // Hide bottom bar during checkout or on admin pages
  const isHidden =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/order-confirmation')

  if (isHidden) return null

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      aria-label="Sticky bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around h-16 px-2">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/') ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-wider uppercase mt-1">Home</span>
        </Link>

        {/* 2. Shop Catalog */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/shop') ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${isActive('/shop') ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-wider uppercase mt-1">Catalog</span>
        </Link>

        {/* 3. Custom Studio (Center Featured) */}
        <Link
          to="/customize"
          className="flex flex-col items-center justify-center flex-1 py-1 -mt-3 group"
        >
          <div className="w-11 h-11 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-all border-2 border-white">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-950 mt-1">
            Studio
          </span>
        </Link>

        {/* 4. Wishlist */}
        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/wishlist') ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'stroke-[2.25] fill-neutral-950' : 'stroke-[1.75]'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase mt-1">Saved</span>
        </Link>

        {/* 5. Cart / Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center flex-1 py-1 text-neutral-500 hover:text-neutral-800 transition-colors"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-neutral-950 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase mt-1">Bag</span>
        </button>
      </div>
    </nav>
  )
}
