import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ShieldCheck, RefreshCw, Truck } from 'lucide-react'

export const Footer: React.FC = () => {
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
                100% Solid Wood Craftsmanship
              </h4>
              <p className="mt-1 text-neutral-500">
                Sustainably sourced pinewood & teak moulding with archival cotton rag prints.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                Pan-India Safe Transit
              </h4>
              <p className="mt-1 text-neutral-500">
                Multi-layer protective bubble wrap & shatter-resistant museum acrylic glaze.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-200">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
                Zero-Risk Damage Guarantee
              </h4>
              <p className="mt-1 text-neutral-500">
                Any transit damage? We send an instant, hassle-free replacement within 48 hours.
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
          <p className="text-neutral-500 max-w-sm leading-relaxed">
            India's destination for contemporary automotive wall art, bespoke photo preservation, and studio-grade custom framing.
          </p>
          <div className="pt-2 text-neutral-400 space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span>Studio & Workshop: Outer Ring Road, Bengaluru, Karnataka 560103</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>support@yourframies.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-500" />
              <span>+91 98765 43210 (Mon-Sat, 10 AM - 7 PM IST)</span>
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
              <Link to="/shop?category=car-photo-frames" className="hover:text-white transition-colors">
                Car Photo Frames
              </Link>
            </li>
            <li>
              <Link to="/shop?category=aesthetic-photo-frames" className="hover:text-white transition-colors">
                Aesthetic Prints
              </Link>
            </li>
            <li>
              <Link to="/shop?category=personalised-photo-frames" className="hover:text-white transition-colors">
                Personalised Frames
              </Link>
            </li>
            <li>
              <Link to="/customize" className="hover:text-white transition-colors">
                Custom Framing Studio
              </Link>
            </li>
            <li>
              <Link to="/shop?category=posters" className="hover:text-white transition-colors">
                Posters & Typography
              </Link>
            </li>
            <li>
              <Link to="/shop?category=wall-art" className="hover:text-white transition-colors">
                Gallery Wall Sets
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
          <p className="text-neutral-600">
            &copy; {new Date().getFullYear()} Your Framies Pvt. Ltd. All rights reserved. Designed & hand-assembled in India.
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
