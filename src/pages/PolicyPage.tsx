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
        'All orders are carefully hand-assembled and dispatched from our Bengaluru framing workshop within 24 to 48 hours of payment verification.',
        'We partner exclusively with tier-1 Indian courier aggregators including Delhivery One, Shiprocket, and NimbusPost.',
        'Standard transit times are 2-3 business days for tier-1 metro hubs (Bengaluru, Delhi NCR, Mumbai, Hyderabad, Chennai, Kolkata) and 3-5 business days for regional and tier-2 locations.',
        'Free Express Shipping is automatically applied on all orders totaling ₹999 and above. Orders under ₹999 incur a flat nominal shipping fee of ₹99.',
        'Tracking numbers (AWB) are dispatched via SMS and Email as soon as the consignment is scanned by the pickup courier.',
      ],
    },
    returns: {
      title: 'Return & Refund Policy',
      subtitle: 'Zero-Risk Transit Damage Guarantee',
      icon: <RefreshCw className="w-6 h-6 text-neutral-900" />,
      content: [
        'We stand behind our craftsmanship with an unconditional transit damage replacement warranty.',
        'Because custom and personalised frames are custom-cut to your specific photograph and dimensions, we do not accept arbitrary returns once production has started.',
        'Transit Damage Claim: If your frame arrives with damaged wood, cracked glass/acrylic, or print blemishes, take 2 clear photographs of the box and product, and WhatsApp us at +91 98765 43210 or email support@yourframies.com within 48 hours of delivery.',
        'Upon review, we immediately dispatch a 100% brand-new replacement frame free of any shipping charges.',
        'Prepaid refunds (if applicable for cancelled non-custom orders prior to printing) are refunded to the original payment source within 5 to 7 business days via Razorpay.',
      ],
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      subtitle: 'How we safeguard customer information',
      icon: <Lock className="w-6 h-6 text-neutral-900" />,
      content: [
        'Your Framies respects your privacy. We strictly comply with Indian Information Technology regulations and international data security standards.',
        'Uploaded Customer Photos: All personal photographs uploaded for custom framing are securely processed via encrypted storage and automatically purged from our production servers 30 days following successful delivery.',
        'Payment Data: We NEVER store your credit card numbers, CVVs, or UPI PINs. All payment transactions are securely handled by Razorpay through 256-bit SSL encryption.',
        'We never sell, rent, or trade your phone number or email address with third-party advertisers.',
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Store usage terms and commercial agreements',
      icon: <ShieldCheck className="w-6 h-6 text-neutral-900" />,
      content: [
        'By browsing, customizing, or placing an order on Your Framies, you agree to these terms of service.',
        'Color Accuracy: We make every effort to display the colors of our frames and mats accurately. However, actual printed colors may vary slightly due to individual screen calibration differences.',
        'Copyright & Intellectual Property: For personal photo uploads, the customer confirms they own or possess appropriate rights to print the uploaded artwork.',
        'All disputes are subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.',
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
