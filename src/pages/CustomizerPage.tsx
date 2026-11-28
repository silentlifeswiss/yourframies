import React from 'react'
import { FrameCustomizer } from '../components/product/FrameCustomizer'
import { ShieldCheck, Sparkles, Truck, Check } from 'lucide-react'

export const CustomizerPage: React.FC = () => {
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            Custom Frame Builder
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-1">
            Frame Your Own Photo
          </h1>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            Upload your favourite photo and preview how it looks in our A4 Deep Black or Minimalist White frame before ordering.
          </p>
        </div>

        {/* Main Customizer Canvas */}
        <FrameCustomizer />

        {/* Steps Guide */}
        <div className="mt-16 pt-12 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">01</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              Upload Your Photo
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Upload from phone or computer in seconds and preview it straight inside the frame.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">02</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              Pick Black or White A4
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Standard A4 size (21.0 × 29.7 cm) finished cleanly in Deep Black or Minimalist White.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200/80 shadow-xs">
            <span className="text-2xl font-serif text-neutral-900 font-bold">03</span>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mt-2">
              Safe Pan-India Delivery
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Packed securely with corner protection and delivered with full order tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
