import React, { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
          Privileged Access
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
          Receive ₹200 Off Your First Order
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-light leading-relaxed">
          Subscribe for early access to limited edition automotive prints, seasonal releases, and private studio promotions.
        </p>

        {submitted ? (
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg inline-flex items-center gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your promo code <strong>WELCOME10</strong> has been sent to your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 text-xs text-neutral-900 rounded-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-950 text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Join Atelier</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
