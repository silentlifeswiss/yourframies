import React from 'react'
import { Shield, Sparkles, Truck, RefreshCcw } from 'lucide-react'

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <Shield className="w-7 h-7 text-neutral-900" />,
      title: 'Museum-Quality Craftsmanship',
      desc: 'Precision corner splines, FSC-certified solid pinewood, and archival 300 GSM fine art giclée printing.',
    },
    {
      icon: <Sparkles className="w-7 h-7 text-neutral-900" />,
      title: 'Shatterproof Anti-Glare Glaze',
      desc: 'Optical-grade acrylic that eliminates reflections and ensures 100% safe transit to your doorstep.',
    },
    {
      icon: <Truck className="w-7 h-7 text-neutral-900" />,
      title: 'Free Express Pan-India Delivery',
      desc: 'Dispatched via premium express couriers (Delhivery, Shiprocket) with end-to-end tracking updates.',
    },
    {
      icon: <RefreshCcw className="w-7 h-7 text-neutral-900" />,
      title: 'Zero-Risk Transit Guarantee',
      desc: 'If your frame arrives damaged or misaligned in any way, we ship a brand-new replacement within 48 hours.',
    },
  ]

  return (
    <section className="py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            The Atelier Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Why Discerning Collectors Choose Us
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500">
            Every frame is assembled by master framers with meticulous attention to joint geometry, colour depth, and preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col items-start hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center mb-5">
                {p.icon}
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
