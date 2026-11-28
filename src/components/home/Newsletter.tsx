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
    <section className="py-10 sm:py-16 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
          New Drops & Offers
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-1">
          Get ₹200 Off Your First Order
        </h2>
        <p className="mt-2 sm:mt-3 text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Subscribe for updates on new automotive prints, aesthetic drops, and subscriber discounts.
        </p>

        {submitted ? (
          <div className="mt-6 sm:mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg inline-flex items-center gap-2 text-emerald-800 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Use code <strong>WELCOME10</strong> at checkout for 10% off.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 text-base sm:text-xs text-neutral-900 rounded-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="px-6 py-3 min-h-[46px] bg-neutral-950 text-white text-xs uppercase tracking-widest font-semibold rounded-sm hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
