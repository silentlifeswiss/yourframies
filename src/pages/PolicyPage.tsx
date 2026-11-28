import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react'

export const PolicyPage: React.FC = () => {
  const { type } = useParams<{ type: string }>()

  const policyData: Record<
    string,
    { title: string; subtitle: string; icon: any; content: string[] }
  > = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      subtitle: 'Pan-India Express Dispatch Guidelines',
      icon: <Truck className="w-6 h-6 text-neutral-900" />,
      content: [
        'All orders are carefully prepared and dispatched within 24 to 48 hours of order confirmation.',
        'We deliver across serviceable Indian PIN codes through reliable express logistics partners.',
        'Estimated delivery is 2–3 business days for metro cities and 3–5 business days for other locations across India.',
        'Free Express Shipping applies automatically on orders totaling ₹999 and above. Orders under ₹999 carry a flat shipping fee of ₹99.',
        'Tracking details are updated as soon as your shipment is picked up and scanned.',
      ],
    },
    returns: {
      title: 'Return & Refund Policy',
      subtitle: 'Transit Damage Replacement Guarantee',
      icon: <RefreshCw className="w-6 h-6 text-neutral-900" />,
      content: [
        'Every frame comes with our transit damage replacement guarantee.',
        'Because custom and personalised photo frames are printed to order for your uploaded image, returns are not accepted once printing begins unless the product arrives damaged or incorrect.',
        'Transit Damage Claim: If your frame arrives damaged or with print defects, take clear photos of the package and frame and send them on WhatsApp at +91 79009 43025 or email silentlifeswiss@gmail.com within 48 hours of delivery.',
        'Once reviewed, we dispatch a free replacement frame with zero extra shipping cost.',
        'Approved refunds for cancelled prepaid orders prior to printing are processed back to the original payment method within 5 to 7 business days via Razorpay.',
      ],
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      subtitle: 'How we protect your personal data and photos',
      icon: <Lock className="w-6 h-6 text-neutral-900" />,
      content: [
        'Your Framies respects your privacy and keeps your contact details and uploaded images strictly confidential.',
        'Uploaded Photos: Photos uploaded for custom framing are used solely to print and fulfill your order.',
        'Payment Security: We never store your card details or UPI credentials. All online payments are handled securely via Razorpay.',
        'For privacy questions, contact us at silentlifeswiss@gmail.com.',
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Store usage terms and order guidelines',
      icon: <ShieldCheck className="w-6 h-6 text-neutral-900" />,
      content: [
        'By placing an order on Your Framies, you agree to these terms of service.',
        'All frames are standardized to A4 dimensions (21.0 × 29.7 cm) in Deep Black or Minimalist White finish.',
        'Color Accuracy: Minor tonal differences can occur between glowing phone/desktop screens and physical prints.',
        'Photo Rights: Customers uploading custom photos confirm they own or have permission to print those images.',
      ],
    },
  }

  const currentPolicy = policyData[type || 'shipping'] || policyData['shipping']

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
            {currentPolicy.icon}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Legal & Customer Assurance
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            {currentPolicy.title}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">{currentPolicy.subtitle}</p>
        </div>

        <div className="bg-neutral-50 p-8 sm:p-10 rounded-2xl border border-neutral-200/80 space-y-5 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
          {currentPolicy.content.map((paragraph, idx) => (
            <p key={idx} className="border-b border-neutral-200/60 pb-4 last:border-none last:pb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Policy quick switcher */}
        <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-wrap justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          <Link to="/policy/shipping" className="hover:text-black">
            Shipping Policy
          </Link>
          <span>•</span>
          <Link to="/policy/returns" className="hover:text-black">
            Returns & Refunds
          </Link>
          <span>•</span>
          <Link to="/policy/privacy" className="hover:text-black">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/policy/terms" className="hover:text-black">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}
