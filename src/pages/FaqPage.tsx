import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What frame sizes and colors do you offer?',
      a: 'We craft all our frames in standard A4 size (21.0 × 29.7 cm / 8.3 × 11.7 in) and offer two clean finishes: Deep Black and Minimalist White.',
    },
    {
      q: 'How does the Custom Photo Upload work?',
      a: 'Upload a high-resolution photo (JPG, PNG, or WebP) directly from your phone or computer on any customizable product or on the Custom Frame Builder page. You can preview how it looks in Deep Black or Minimalist White right away before ordering.',
    },
    {
      q: 'What happens if my frame arrives damaged during transit?',
      a: 'Every frame is packed in protective cushioning and corrugated boxes. If your frame arrives damaged, send a photo on WhatsApp (+91 79009 43025) or email silentlifeswiss@gmail.com within 48 hours of delivery and we will send a free replacement.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across serviceable Indian PIN codes with a nominal ₹50 handling fee. Orders of ₹999 or above qualify for free shipping.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'Orders dispatch within 24 to 48 hours. Delivery usually takes 2 to 3 business days in major metro cities and 3 to 5 business days across the rest of India.',
    },
  ]

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Help Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-light">
            Everything you need to know about our framing craftsmanship, ordering, shipping, and guarantees.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                )}
              </button>

              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-neutral-600 font-light leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
