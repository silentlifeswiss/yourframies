import React from 'react'
import { FrameCustomizer } from '../components/product/FrameCustomizer'
import { ShieldCheck, Sparkles, Truck, Check } from 'lucide-react'

export const CustomizerPage: React.FC = () => {
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Artisanal Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-1">
            Bespoke Custom Framing Studio
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Upload your personal photography, wedding portraits, or digital artwork. Experience real-time visualization across our handcrafted mouldings and mats.
          </p>
        </div>

        {/* Main Customizer Canvas */}
        <FrameCustomizer />

        {/* Steps Guide */}
        <div className="mt-20 pt-16 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">01</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              High-Res Upload & Auto Crop
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Upload from mobile or desktop. Our team checks DPI and color calibration prior to printing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">02</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              Handcrafted Wood Joinery
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              FSC-certified pine and teak frames cut and mitered with precision corner splines.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">03</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              Reinforced Pan-India Transit
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Encased in double-fluted industrial cartons with edge foam and anti-shatter acrylic.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
