import React from 'react'
import { Shield, Sparkles, Truck, RefreshCcw } from 'lucide-react'

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <Shield className="w-6 h-6 text-neutral-900" />,
      title: 'Standard A4 Size',
      desc: 'Every artwork and custom photo arrives in a clean 21 × 29.7 cm A4 frame ready to hang on your wall or place on a desk.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-neutral-900" />,
      title: 'Deep Black & Minimalist White',
      desc: 'Focused on two clean finishes crafted to complement both bold automotive prints and quiet minimalist interiors.',
    },
    {
      icon: <Truck className="w-6 h-6 text-neutral-900" />,
      title: 'Express Pan-India Delivery',
      desc: 'Dispatched with protective packaging and live order tracking across serviceable Indian PIN codes.',
    },
    {
      icon: <RefreshCcw className="w-6 h-6 text-neutral-900" />,
      title: 'Damage Replacement Guarantee',
      desc: 'If a frame arrives damaged in transit, send us a photo within 48 hours and we ship a free replacement.',
    },
  ]

  return (
    <section className="py-10 sm:py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            Why Your Framies
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-1">
            Built Clean. Ready to Hang.
          </h2>
          <p className="mt-2 sm:mt-3 text-sm text-neutral-600 leading-relaxed">
            Consistent A4 sizing, crisp print clarity, and protective Pan-India shipping on every frame.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col items-start"
            >
              <div className="w-11 h-11 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
