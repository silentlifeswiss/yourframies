import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, Sparkles, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export const MobileBottomNav: React.FC = () => {
  const location = useLocation()
  const { itemCount, isCartOpen, setIsCartOpen } = useCart()
  const { wishlistCount } = useWishlist()

  // Hide bottom bar during checkout or on admin pages
  const isHidden =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/order-confirmation')

  if (isHidden) return null

  const isActive = (path: string) => {
    if (isCartOpen) return false
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isCartActive = isCartOpen || location.pathname.startsWith('/cart')

  const handleNavClick = () => {
    if (isCartOpen) setIsCartOpen(false)
  }

  const handleBagClick = () => {
    if (location.pathname.startsWith('/cart')) {
      setIsCartOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setIsCartOpen(!isCartOpen)
  }

  return (
    <nav
      aria-label="Sticky bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-around h-16 px-2">
        {/* 1. Home */}
        <Link
          to="/"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/') ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-wider uppercase mt-1">Home</span>
        </Link>

        {/* 2. Shop Catalog */}
        <Link
          to="/shop"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/shop') ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Compass className={`w-5 h-5 ${isActive('/shop') ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-wider uppercase mt-1">Catalog</span>
        </Link>

        {/* 3. Custom Studio (Center Featured) */}
        <Link
          to="/customize"
          onClick={handleNavClick}
          className="flex flex-col items-center justify-center flex-1 py-1 -mt-3 group"
        >
          <div className="w-11 h-11 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-all border-2 border-neutral-800">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-white mt-1">
            Studio
          </span>
        </Link>

        {/* 4. Wishlist */}
        <Link
          to="/wishlist"
          onClick={handleNavClick}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isActive('/wishlist') ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'stroke-[2.25] fill-white' : 'stroke-[1.75]'}`} />
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
          onClick={handleBagClick}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isCartActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label="Open Shopping Bag"
          aria-pressed={isCartActive}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${isCartActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-white text-neutral-950 rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
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
