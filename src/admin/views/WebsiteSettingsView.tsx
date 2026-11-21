import React, { useState } from 'react'
import {
  Settings,
  Save,
  CheckCircle2,
  Globe,
  Bell,
  Mail,
  Phone,
  MapPin,
  Share2,
  Shield,
  Layers,
  Palette,
} from 'lucide-react'
import { useSiteContent, SiteSettings } from '../../context/SiteContentContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const WebsiteSettingsView: React.FC = () => {
  const { settings, updateSettings, hasUnpublishedChanges } = useSiteContent()
  const { logAuditAction } = useAdminAuth()
  const [formData, setFormData] = useState<SiteSettings>({ ...settings })
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
    logAuditAction(
      'UPDATE_STORE_SETTINGS',
      'SITE_SETTINGS',
      'global-settings',
      `Updated Brand: ${formData.brandName}, Announcement: ${formData.announcementActive ? 'ON' : 'OFF'}`
    )
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-serif tracking-tight text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-neutral-300" />
          Global Website & Brand Settings
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Control public store identity, announcement bar messages, contact information, social links, and checkout fees without editing code.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Website settings updated in draft! Click "Publish Draft Changes" in the top bar to apply them immediately to the live site.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand & Identity */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            Brand Identity & Header
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Store / Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Navbar Logo Text</label>
              <input
                type="text"
                value={formData.logoText}
                onChange={(e) => handleChange('logoText', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none font-serif tracking-widest uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-neutral-400 block mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Top Announcement Bar
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => handleChange('announcementActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Announcement Banner Message</label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              placeholder="e.g. ✨ Free shipping on orders over ₹999 • Code: WELCOME10"
            />
          </div>
        </div>

        {/* Contact & Studio Details */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            Contact & Atelier Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Customer Support Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-neutral-400 block mb-1">Workshop / Studio Address</label>
              <input
                type="text"
                value={formData.workshopAddress}
                onChange={(e) => handleChange('workshopAddress', e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-neutral-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Store Operational Limits */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Operational & Checkout Safeguards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Free Shipping Cart Minimum (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Cash on Delivery (COD) Surcharge (₹)</label>
              <input
                type="number"
                value={formData.codHandlingFee}
                onChange={(e) => handleChange('codHandlingFee', Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2 border-t border-neutral-800/80 pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Store Maintenance Mode</h4>
                <p className="text-xs text-neutral-400">
                  Temporarily display a friendly maintenance notice to customers while making major catalog changes.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  )
}
