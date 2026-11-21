import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'

// Layout Components
import { AnnouncementBar } from './components/layout/AnnouncementBar'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/cart/CartDrawer'
import { ScrollToTop } from './components/common/ScrollToTop'

// Pages
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
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { PolicyPage } from './pages/PolicyPage'

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <OrderProvider>
          <WishlistProvider>
            <CartProvider>
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
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faqs" element={<FaqPage />} />
                    <Route path="/policy/:type" element={<PolicyPage />} />
                    <Route path="/policy" element={<PolicyPage />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </CartProvider>
          </WishlistProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  )
}
