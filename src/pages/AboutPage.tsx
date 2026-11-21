import React from 'react'
import { Award, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Our Heritage & Mission
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 mt-2">
            The Story Behind Your Framies
          </h1>
          <p className="mt-4 text-neutral-600 font-light max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Born out of a deep reverence for fine automotive design, architectural aesthetics, and the preservation of personal memory.
          </p>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
          <img
            src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=85"
            alt="Atelier Framing Workshop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-6 font-light">
          <p>
            In a world inundated with fleeting digital images on glowing glass screens, we believe that the moments, machines, and visual art that move you deserve physical permanence. At <strong>Your Framies</strong>, every frame is treated as an archival heirloom.
          </p>

          <h3 className="font-serif text-xl text-neutral-900 font-normal pt-4">
            Uncompromising Material Philosophy
          </h3>
          <p>
            Unlike mass-manufactured plastic or synthetic polymer frames that warp under Indian climate shifts, our mouldings are cut strictly from FSC-certified solid pinewood, natural teak, and rich American walnut. Each joint is joined with internal mechanical corner splines for lifetime rigidity.
          </p>

          <h3 className="font-serif text-xl text-neutral-900 font-normal pt-4">
            Museum-Grade Giclée Prints
          </h3>
          <p>
            We use 12-color aqueous pigment giclée printers delivering an astounding 2400 DPI resolution onto 300 GSM heavy cotton rag. The blacks are velvet-deep, the midtones are creamy, and colors remain vibrant for over 100 years without fading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-neutral-200 text-center">
          <div className="p-6 bg-neutral-50 rounded-xl">
            <Award className="w-8 h-8 text-neutral-900 mx-auto mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">100% Solid Hardwood</h4>
            <p className="text-[11px] text-neutral-500 mt-1">Zero synthetic polymers or MDF core.</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-neutral-900 mx-auto mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Zero-Risk Transit</h4>
            <p className="text-[11px] text-neutral-500 mt-1">Shatterproof acrylic glaze with replacement warranty.</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-xl">
            <Sparkles className="w-8 h-8 text-neutral-900 mx-auto mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Crafted in Bengaluru</h4>
            <p className="text-[11px] text-neutral-500 mt-1">Shipped across 28 states & union territories.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
