import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Award } from 'lucide-react'

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center">
      {/* Background Photography with subtle dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85"
          alt="Gallery Wall with Minimalist Frames"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-start justify-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200 text-xs tracking-widest uppercase font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>India's Premier Framing Atelier</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight max-w-3xl leading-[1.1] text-white">
          Artisanal Frames. <br />
          <span className="italic font-normal text-neutral-300">Timeless Preservation.</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-xl font-light leading-relaxed">
          Bespoke solid wood framing for automotive photography, contemporary minimalist art, and your most treasured personal memories. Handcrafted with museum-grade precision in India.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <Link
            to="/shop"
            className="px-8 py-4 bg-white text-neutral-900 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors text-center shadow-xl flex items-center justify-center gap-2 rounded-xs"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/customize"
            className="px-8 py-4 bg-transparent border border-white/40 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors text-center rounded-xs backdrop-blur-sm"
          >
            Open Custom Studio
          </Link>
        </div>

        {/* Value Micro-Points */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>300 GSM Archival Cotton</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Solid Teak & Pine</span>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Free Delivery Above ₹999</span>
          </div>
        </div>
      </div>
    </section>
  )
}
