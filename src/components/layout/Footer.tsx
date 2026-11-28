import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, ShieldCheck, RefreshCw, Truck } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'
import { getStoreCategories, Category } from '../../data/categories'

export const Footer: React.FC = () => {
  const { settings } = useSiteContent()
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => getStoreCategories())

  useEffect(() => {
    const handleCats = () => setCategoriesList(getStoreCategories())
    window.addEventListener('yourframies_categories_updated', handleCats)
    return () => window.removeEventListener('yourframies_categories_updated', handleCats)
  }, [])
  const contactEmail = settings.contactEmail || 'silentlifeswiss@gmail.com'
  const contactPhone = settings.contactPhone || '+91 79009 43025'
  const telHref = `tel:${contactPhone.replace(/[^+\d]/g, '')}`

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800 pb-20 lg:pb-0">
      {/* Value Badges Banner */}
      <div className="border-b border-neutral-900 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                Standard A4 • Black & White
              </h4>
              <p className="mt-1 text-neutral-400">
                Clean A4 frames (21 × 29.7 cm) finished in Deep Black and Minimalist White.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                Pan-India Express Shipping
              </h4>
              <p className="mt-1 text-neutral-400">
                Packed with protective layers for safe delivery across India.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-200">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                Transit Damage Replacement
              </h4>
              <p className="mt-1 text-neutral-400">
                Damaged on arrival? Send us a photo within 48 hours for a free replacement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <span className="font-serif text-2xl tracking-widest text-neutral-100 uppercase">
            Your Framies
          </span>
          <p className="text-neutral-400 max-w-sm leading-relaxed text-xs sm:text-sm">
            A4 framed automotive prints, minimalist wall art, and custom personal photo frames delivered across India.
          </p>
          <div className="pt-2 text-neutral-300 space-y-2.5 text-xs">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                {contactEmail}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
              <a href={telHref} className="hover:text-white transition-colors">
                {contactPhone} (Mon–Sat, 10 AM – 7 PM IST)
              </a>
            </p>
          </div>
        </div>

        {/* Col 2: Collections */}
        <div>
          <h4 className="text-neutral-200 font-semibold uppercase tracking-wider mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                Shop All Frames
              </Link>
            </li>
            {categoriesList.map((cat) => (
              <li key={cat.id}>
                <Link to={`/shop?category=${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/customize" className="hover:text-white transition-colors">
                Frame Your Photo
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div>
          <h4 className="text-neutral-200 font-semibold uppercase tracking-wider mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/track-order" className="hover:text-white transition-colors">
                Track Your Shipment
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-white transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-white transition-colors">
                FAQs & Frame Care
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact & Custom Queries
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Our Story & Materials
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Policies */}
        <div>
          <h4 className="text-neutral-200 font-semibold uppercase tracking-wider mb-4">
            Legal & Policies
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/policy/shipping" className="hover:text-white transition-colors">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link to="/policy/returns" className="hover:text-white transition-colors">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/policy/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/policy/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="border-t border-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} Your Framies. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500">
              Verified Secured By
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">Razorpay</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">UPI</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
