import React, { useState } from 'react'
import { Mail, Phone, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

export const ContactPage: React.FC = () => {
  const { settings } = useSiteContent()
  const contactEmail = settings.contactEmail || 'silentlifeswiss@gmail.com'
  const contactPhone = settings.contactPhone || '+91 79009 43025'
  const digitsOnly = contactPhone.replace(/\D/g, '').slice(-10) || '7900943025'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            Support & Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            Questions about an order, custom photo uploads, or bulk frame sets? Reach out directly via phone, WhatsApp, or email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
          {/* Left Info */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-serif text-2xl text-neutral-900">Contact Details</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We reply promptly during business hours and help verify photo quality for every custom frame order.
            </p>

            <div className="space-y-4 text-sm text-neutral-700 pt-2">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
                <Mail className="w-5 h-5 text-neutral-900 shrink-0" />
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-neutral-500">Email Support</strong>
                  <span className="font-medium text-neutral-900">{contactEmail}</span>
                </div>
              </a>

              <a href={`tel:+91${digitsOnly}`} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition-colors">
                <Phone className="w-5 h-5 text-neutral-900 shrink-0" />
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-neutral-500">Phone / Call Desk</strong>
                  <span className="font-medium text-neutral-900">{contactPhone}</span>
                  <span className="block text-xs text-neutral-500">Mon–Sat, 10 AM to 7 PM IST</span>
                </div>
              </a>

              <a
                href={`https://wa.me/91${digitsOnly}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-emerald-700">WhatsApp Chat</strong>
                  <span className="font-medium text-emerald-950">+91 {digitsOnly}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
                <p className="text-sm text-emerald-800 mt-1 max-w-xs">
                  Thank you, {name}. We will reply to your inquiry shortly at {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full p-2.5 border border-neutral-300 rounded text-base sm:text-sm outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full p-2.5 border border-neutral-300 rounded text-base sm:text-sm outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="7900943025"
                      className="w-full p-2.5 border border-neutral-300 rounded text-base sm:text-sm outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what frame or custom print you need help with..."
                    className="w-full p-2.5 border border-neutral-300 rounded text-base sm:text-sm outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 min-h-[48px] bg-neutral-950 text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
