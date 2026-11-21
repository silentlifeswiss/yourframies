import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What materials are used for the frames and prints?',
      a: 'We use 100% solid natural timber (FSC-certified pinewood, seasoned teak, and American walnut). Our prints are rendered with 12-color archival giclée inks on 300 GSM acid-free cotton rag paper, ensuring colors remain true for generations.',
    },
    {
      q: 'What is the difference between Acrylic Glaze and Anti-Glare Glass?',
      a: 'Our standard Acrylic Glaze is optical-grade, shatterproof, lightweight, and 100% transit-safe. The optional Museum Anti-Glare UV Glass features specialized optical coating that eliminates surface glare under room lights while filtering 99% of harmful UV rays.',
    },
    {
      q: 'How does the Live Customizer photo upload work?',
      a: 'You can upload high-resolution photos (JPG, PNG, WebP up to 15MB) directly from your phone or PC. Our visualizer lets you preview your image mounted in different frame mouldings, sizes, and matboard borders. Before printing, our master framers review resolution and aspect ratio.',
    },
    {
      q: 'What happens if my frame arrives damaged during transit?',
      a: 'We offer an unconditional Zero-Risk Transit Guarantee. Every frame is shipped in multi-layer bubble cushioning with corner caps and industrial double-fluted cardboard. In the rare event of transit damage, simply WhatsApp us a photo within 48 hours and we immediately dispatch a brand-new replacement free of cost.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across serviceable Indian PIN codes. To minimize RTO (Return to Origin) risks, COD orders are verified via phone/OTP and carry a nominal ₹50 handling charge.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'Standard dispatch takes 24 to 48 hours from our Bengaluru atelier. Delivery to metros (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai) takes 2 to 3 days, and rest of India takes 3 to 5 business days via Delhivery Surface Express.',
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
