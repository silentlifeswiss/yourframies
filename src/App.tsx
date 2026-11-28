import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'
import { SiteContentProvider } from './context/SiteContentContext'
import { MediaProvider } from './context/MediaContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ADMIN_CONFIG } from './config/adminConfig'

// Layout Components (Public Storefront)
import { AnnouncementBar } from './components/layout/AnnouncementBar'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/cart/CartDrawer'
import { MobileBottomNav } from './components/layout/MobileBottomNav'
import { ScrollToTop } from './components/common/ScrollToTop'

// Primary Home Route (eager for instant First Contentful Paint)
import { HomePage } from './pages/HomePage'

// Code-split secondary routes & admin portal for fast mobile loading
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const CustomizerPage = lazy(() => import('./pages/CustomizerPage').then((m) => ({ default: m.CustomizerPage })))
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })))
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const PolicyPage = lazy(() => import('./pages/PolicyPage').then((m) => ({ default: m.PolicyPage })))

// Private Dedicated Admin Portal (completely isolated from storefront bundle)
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminLogin = lazy(() => import('./admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))

const RouteFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" aria-label="Loading" />
  </div>
)

const AppContent: React.FC = () => {
  const location = useLocation()
  const isAdminRoute =
    location.pathname.startsWith(ADMIN_CONFIG.basePath) ||
    location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 text-xs">Loading admin...</div>}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path={`${ADMIN_CONFIG.basePath}/login`} element={<AdminLogin />} />
          <Route path={`${ADMIN_CONFIG.basePath}/*`} element={<AdminLayout />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pb-16">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/customize" element={<CustomizerPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/track-order" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/policy/:type" element={<PolicyPage />} />
            <Route path="/policy" element={<PolicyPage />} />
            {/* Catch-all unknown routes redirect to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AdminAuthProvider>
          <SiteContentProvider>
            <MediaProvider>
              <OrderProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </WishlistProvider>
              </OrderProvider>
            </MediaProvider>
          </SiteContentProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  )
}
