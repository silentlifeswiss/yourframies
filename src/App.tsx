import React from 'react'
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
import { ScrollToTop } from './components/common/ScrollToTop'

// Public Store Pages
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CustomizerPage } from './pages/CustomizerPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { OrderTrackingPage } from './pages/OrderTrackingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/AccountPage'
import { WishlistPage } from './pages/WishlistPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { PolicyPage } from './pages/PolicyPage'

// Private Dedicated Admin Portal
import { AdminLayout } from './admin/AdminLayout'
import { AdminLogin } from './admin/AdminLogin'

const AppContent: React.FC = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith(ADMIN_CONFIG.basePath)

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path={`${ADMIN_CONFIG.basePath}/login`} element={<AdminLogin />} />
        <Route path={`${ADMIN_CONFIG.basePath}/*`} element={<AdminLayout />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
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
      </main>

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
