import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Truck,
  Frame,
  LogOut,
  ShieldAlert,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { getStoreProducts } from '../../data/products'

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const searchResults = searchQuery.trim()
    ? getStoreProducts().filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4)
    : []

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Trigger & Main Navigation */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-widest uppercase font-semibold text-neutral-700">
                <Link to="/shop" className="hover:text-black transition-colors">
                  Shop All
                </Link>
                <Link to="/shop?category=car-photo-frames" className="hover:text-black transition-colors">
                  Car Frames
                </Link>
                <Link to="/shop?category=aesthetic-photo-frames" className="hover:text-black transition-colors">
                  Aesthetic
                </Link>
                <Link to="/shop?category=personalised-photo-frames" className="hover:text-black transition-colors">
                  Personalised
                </Link>
                <Link
                  to="/customize"
                  className="text-neutral-900 border-b-2 border-black pb-0.5 hover:text-neutral-600 transition-colors"
                >
                  Custom Studio
                </Link>
                <Link to="/track-order" className="hover:text-black transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                  Track Order
                </Link>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-1 text-center lg:flex-initial">
              <Link to="/" className="inline-flex flex-col items-center group">
                <span className="font-serif text-2xl sm:text-3xl font-light tracking-widest text-neutral-900 uppercase">
                  Your Framies
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-600 font-sans mt-0.5">
                  Artisanal Wall Framing
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-neutral-700 hover:text-black transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white rounded-full text-[10px] font-medium flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    className="p-2 flex items-center gap-1.5 text-neutral-700 hover:text-black transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-200 shadow-xl rounded-md py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-neutral-100 text-xs text-neutral-500">
                      Signed in as <strong className="text-neutral-900">{user?.name}</strong>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                    >
                      My Profile & Orders
                    </Link>
                    <Link
                      to="/track-order"
                      className="block px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                    >
                      Track Package
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-xs text-amber-600 font-bold hover:bg-amber-50 border-t border-neutral-100 flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        Admin Control Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-neutral-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-neutral-700 hover:text-black transition-colors"
                  aria-label="Login or register"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-900 hover:opacity-80 transition-opacity"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white rounded-full text-[10px] font-medium flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50 py-4 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search frames by name, style, car model (e.g. Porsche, Minimalist, Collage)..."
                  className="w-full pl-12 pr-10 py-3 rounded-full border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Search Suggestions */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white border border-neutral-200 rounded-xl shadow-lg p-3 space-y-2">
                  <div className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 px-2">
                    Quick Results
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-neutral-500">₹{item.basePriceINR.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <span className="font-serif text-xl tracking-widest uppercase">Your Framies</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-5 text-sm uppercase tracking-wider font-semibold text-neutral-800">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-neutral-500"
                >
                  All Collections
                </Link>
                <Link
                  to="/shop?category=car-photo-frames"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-neutral-500"
                >
                  Car Photo Frames
                </Link>
                <Link
                  to="/shop?category=aesthetic-photo-frames"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-neutral-500"
                >
                  Aesthetic Frames
                </Link>
                <Link
                  to="/shop?category=personalised-photo-frames"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-neutral-500"
                >
                  Personalised Keepsakes
                </Link>
                <Link
                  to="/customize"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-black font-bold border-l-2 border-black pl-2"
                >
                  Custom Studio Visualizer
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-neutral-700"
                >
                  <Truck className="w-4 h-4" /> Track Package
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-neutral-700"
                >
                  <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-500">Hello, {user?.name}</div>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-wider font-semibold text-neutral-800"
                  >
                    My Profile & Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-xs uppercase tracking-wider text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold border border-neutral-900 rounded-sm text-neutral-900"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs uppercase tracking-wider font-semibold bg-neutral-900 text-white rounded-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
