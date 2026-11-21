import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react'

export const ContactPage: React.FC = () => {
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
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            We're Here to Help
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Get in Touch
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-light">
            Have a custom gallery wall requirement, bulk corporate order, or need framing advice? Reach out to our Bengaluru studio team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-white p-8 sm:p-12 rounded-2xl border border-neutral-200 shadow-sm">
          {/* Left Info */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-serif text-xl text-neutral-900">Atelier Studio</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Visit or contact our workshop for tailored framing sizes, custom mat cutting, and specialized exhibition commissions.
            </p>

            <div className="space-y-4 text-xs text-neutral-700 pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-neutral-900">Workshop & Fulfillment:</strong>
                  <span>Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-900 shrink-0" />
                <div>
                  <strong className="block text-neutral-900">Customer Support:</strong>
                  <span>support@yourframies.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neutral-900 shrink-0" />
                <div>
                  <strong className="block text-neutral-900">WhatsApp & Call Desk:</strong>
                  <span>+91 98765 43210 (Mon–Sat, 10 AM to 7 PM IST)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
              <p className="font-semibold text-neutral-900">B2B & Interior Designers:</p>
              <p className="mt-1">
                We partner with architects and hospitality projects. Inquire for trade discounts.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-xs">
                  Thank you, {name}. A member of our framing atelier will respond to your inquiry within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shaurya Prakash"
                    className="w-full p-2.5 border border-neutral-300 rounded outline-none focus:ring-1 focus:ring-black"
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
                      placeholder="name@domain.com"
                      className="w-full p-2.5 border border-neutral-300 rounded outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full p-2.5 border border-neutral-300 rounded outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Message or Custom Request *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the size, style, or specific artwork you'd like framed..."
                    className="w-full p-2.5 border border-neutral-300 rounded outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-950 text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
