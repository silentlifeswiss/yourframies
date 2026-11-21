import React from 'react'
import { Link } from 'react-router-dom'
import { HeroBanner } from '../components/home/HeroBanner'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { ProductCarousel } from '../components/home/ProductCarousel'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { FrameCustomizer } from '../components/product/FrameCustomizer'
import { CustomerReviews } from '../components/home/CustomerReviews'
import { InstagramSection } from '../components/home/InstagramSection'
import { Newsletter } from '../components/home/Newsletter'

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Bestsellers & New Arrivals */}
      <ProductCarousel />

      {/* 4. Interactive Custom Studio Section */}
      <section className="py-20 bg-neutral-100/60 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Interactive 2D Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
              Customize Your Own Frame Live
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-light">
              Upload personal photos, choose from 5 handcrafted hardwood mouldings, custom matting and museum-grade anti-glare glass.
            </p>
          </div>

          <FrameCustomizer />
        </div>
      </section>

      {/* 5. The Atelier Standards (Why Choose Us) */}
      <WhyChooseUs />

      {/* 6. Customer Reviews */}
      <CustomerReviews />

      {/* 7. Instagram Community */}
      <InstagramSection />

      {/* 8. Newsletter Signup */}
      <Newsletter />
    </div>
  )
}
