import React from 'react'
import { Award, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            About Your Framies
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 mt-2">
            Clean A4 Frames for Every Wall
          </h1>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            We build ready-to-hang A4 photo frames and wall art — combining iconic automotive photography, minimalist botanical prints, and your own personal memories.
          </p>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80"
            alt="Your Framies A4 Wall Frames"
            className="w-full h-full object-cover"
            decoding="async"
          />
        </div>

        <div className="prose prose-neutral max-w-none text-sm sm:text-base text-neutral-700 leading-relaxed space-y-5">
          <p>
            Great photos belong on your desk, shelf, or bedroom wall — not buried in a phone gallery. At <strong>Your Framies</strong>, we keep things simple so every frame feels sharp, consistent, and effortless to style.
          </p>

          <h3 className="font-serif text-2xl text-neutral-900 font-normal pt-2">
            Why One Size & Two Finishes?
          </h3>
          <p>
            Rather than overwhelming you with dozens of confusing sizes and trim options, we focus exclusively on the classic <strong>A4 format (21 × 29.7 cm)</strong> in two timeless colors: <strong>Deep Black</strong> and <strong>Minimalist White</strong>. Whether you are pairing a Porsche 911 GT3 RS night print with an E30 M3 frame or building a photo collage gift, every piece lines up cleanly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-neutral-200 text-center">
          <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <Award className="w-7 h-7 text-neutral-900 mx-auto mb-2.5" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Standard A4 Size</h4>
            <p className="text-xs text-neutral-600 mt-1">Deep Black & Minimalist White finishes.</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <ShieldCheck className="w-7 h-7 text-neutral-900 mx-auto mb-2.5" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Transit Protection</h4>
            <p className="text-xs text-neutral-600 mt-1">Multi-layer wrapping with 48-hr damage replacement.</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <Sparkles className="w-7 h-7 text-neutral-900 mx-auto mb-2.5" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Pan-India Delivery</h4>
            <p className="text-xs text-neutral-600 mt-1">Prepaid & Cash on Delivery across India.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
