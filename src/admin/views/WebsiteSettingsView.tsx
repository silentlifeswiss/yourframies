import React, { useState, useEffect } from 'react'
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
  Database,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Server,
  Sparkles,
} from 'lucide-react'
import { useSiteContent, SiteSettings } from '../../context/SiteContentContext'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const WebsiteSettingsView: React.FC = () => {
  const { settings, updateSettings, hasUnpublishedChanges } = useSiteContent()
  const { logAuditAction } = useAdminAuth()
  const [formData, setFormData] = useState<SiteSettings>({ ...settings })
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Database Connection Diagnostics
  const [dbStatus, setDbStatus] = useState<{
    isLivePostgres: boolean
    mode: string
    connectionStringDetected?: boolean
    detectedUrlMasked?: string | null
    connectionError?: string | null
  } | null>(null)
  const [isCheckingDb, setIsCheckingDb] = useState(false)

  const checkDbConnection = async () => {
    setIsCheckingDb(true)
    try {
      const res = await fetch('/api/health')
      if (res.ok) {
        const data = await res.json()
        if (data.database) {
          setDbStatus(data.database)
        }
      }
    } catch {
      // Offline fallback
    } finally {
      setIsCheckingDb(false)
    }
  }

  useEffect(() => {
    checkDbConnection()
  }, [])

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

      {/* Supabase & PostgreSQL Database Status & Connection Diagnostics */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${dbStatus?.isLivePostgres ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Database Integration Status</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  dbStatus?.isLivePostgres
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {dbStatus?.isLivePostgres ? '🟢 Supabase Active' : '🟡 Storage Fallback'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {dbStatus?.isLivePostgres
                  ? 'Connected to live Supabase PostgreSQL. Tables auto-migrated and synchronized.'
                  : 'Operating seamlessly on zero-config persistent storage. To connect Supabase, see the 2-step setup below.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkDbConnection}
            disabled={isCheckingDb}
            className="self-start sm:self-auto px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded text-xs font-medium flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>{isCheckingDb ? 'Checking...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Diagnostics & Guidance */}
        {!dbStatus?.isLivePostgres && (
          <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Why is Supabase not connected yet?</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Connecting GitHub to Supabase links your code for migrations, but <strong>Netlify</strong> (where the website backend runs) does not receive database credentials automatically unless you paste the connection string into Netlify.
            </p>

            <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2.5">
              <p className="text-white font-semibold">Follow these 2 quick steps to connect Supabase in 60 seconds:</p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <div className="text-neutral-300">
                    In your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-400 underline font-medium">Supabase Dashboard</a>, click the green <strong>"Connect"</strong> button at top right (or Project Settings &gt; Database), and copy the <strong>Connection String (URI)</strong>.
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">Example: postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <div className="text-neutral-300">
                    In your <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-medium">Netlify Site Dashboard</a>, go to <strong>Site configuration &gt; Environment variables</strong>. Add:
                    <div className="mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] text-amber-300">
                      Variable name: <strong>DATABASE_URL</strong><br />
                      Value: [paste your Supabase URI with your password]
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {dbStatus?.connectionError && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-500/40 rounded text-red-300 text-[11px] space-y-1">
                <p className="font-semibold">Connection Diagnostic Error:</p>
                <p className="font-mono text-red-200">{dbStatus.connectionError}</p>
              </div>
            )}
          </div>
        )}

        {dbStatus?.isLivePostgres && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL Connection Active via {dbStatus.detectedUrlMasked || 'Supabase Pooler'}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-mono">Auto-Migrations OK</span>
          </div>
        )}
      </div>

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
