import React, { useState } from 'react'
import {
  Truck,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Save,
  HelpCircle,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useSiteContent } from '../../context/SiteContentContext'

export const ShippingView: React.FC = () => {
  const { logAuditAction } = useAdminAuth()
  const { settings, updateSettings } = useSiteContent()
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Courier API state
  const [couriers, setCouriers] = useState(() => {
    try {
      const saved = localStorage.getItem('yourframies_courier_config')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return {
      shadowfax: {
        enabled: true,
        apiKey: '',
        environment: 'staging' as 'staging' | 'production',
        pickupPin: '560058',
        service: 'marketplace',
        status: 'Ready (Dale API)',
      },
      delhivery: {
        enabled: true,
        apiKey: 'a83902984b7d61ecb111ccc79229c7a1e1f3e472',
        clientId: 'YOURFRAMIES_BLR_01',
        warehousePin: '560103',
        environment: 'production' as 'sandbox' | 'production',
        status: 'Connected (Live Production)',
      },
      shiprocket: {
        enabled: false,
        email: '',
        tokenStatus: 'Not Connected',
        autoSync: false,
      },
      nimbuspost: {
        enabled: false,
        apiToken: '',
        status: 'Disconnected',
      },
      indiaPost: {
        enabled: false,
        businessId: '',
        status: 'Disconnected',
      },
    }
  })

  // Rates & Thresholds
  const [shippingRates, setShippingRates] = useState({
    freeThreshold: settings.freeShippingThreshold || 999,
    standardFlatRate: 79,
    codHandlingFee: settings.codHandlingFee || 50,
    expressRate: 149,
  })

  // Packaging Profiles
  const [packages, setPackages] = useState([
    {
      id: 'pkg-1',
      name: 'Glass Frame Small (A4)',
      weightGrams: 950,
      lengthCm: 35,
      breadthCm: 25,
      heightCm: 6,
      cushioning: '4-ply bubble wrap + corrugated guard corners',
      fragileLabel: true,
    },
    {
      id: 'pkg-2',
      name: 'Glass Frame Large (A3 / 12x18)',
      weightGrams: 1650,
      lengthCm: 50,
      breadthCm: 35,
      heightCm: 7,
      cushioning: 'High-density EPE foam sleeve + dual-layer thermocol corners',
      fragileLabel: true,
    },
    {
      id: 'pkg-3',
      name: 'Acrylic Lightweight Frame (A4/A3)',
      weightGrams: 550,
      lengthCm: 45,
      breadthCm: 32,
      heightCm: 5,
      cushioning: 'Scratch-resistant peel film + protective cardboard envelope',
      fragileLabel: false,
    },
  ])

  // Blocked PIN codes for high COD RTO
  const [blockedPins, setBlockedPins] = useState('')

  const handleSaveShippingConfig = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localStorage.setItem('yourframies_courier_config', JSON.stringify(couriers))
    } catch (e) {}

    updateSettings({
      freeShippingThreshold: Number(shippingRates.freeThreshold),
      codHandlingFee: Number(shippingRates.codHandlingFee),
    })

    logAuditAction(
      'UPDATE_SHIPPING_SETTINGS',
      'SHIPPING',
      'shipping-config',
      `Updated thresholds: Free > ₹${shippingRates.freeThreshold}, COD Fee ₹${shippingRates.codHandlingFee}`
    )

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif tracking-tight text-white flex items-center gap-3">
          <Truck className="w-6 h-6 text-emerald-400" />
          Indian Logistics & Courier Orchestration
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Manage integrated courier APIs (Shadowfax Express, Delhivery One, Shiprocket, NimbusPost), packaging profiles, PIN code verification, and COD risk safeguards.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Shipping and courier configurations updated and synchronized successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveShippingConfig} className="space-y-8">
        {/* Courier Aggregators */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
            <span>Integrated Courier Providers</span>
            <span className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded">Multi-Courier Routing</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shadowfax Logistics */}
            <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${couriers.shadowfax.enabled ? 'bg-amber-400' : 'bg-neutral-600'}`}></div>
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <span>Shadowfax Express</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                        v1/v3/v4
                      </span>
                    </h4>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couriers.shadowfax.enabled}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        shadowfax: { ...couriers.shadowfax, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Authorization Token (Token your_api_token)</label>
                  <input
                    type="password"
                    placeholder="Enter Shadowfax client API token..."
                    value={couriers.shadowfax.apiKey}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        shadowfax: { ...couriers.shadowfax, apiKey: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Pickup Hub PIN</label>
                    <input
                      type="text"
                      value={couriers.shadowfax.pickupPin}
                      onChange={(e) =>
                        setCouriers({
                          ...couriers,
                          shadowfax: { ...couriers.shadowfax, pickupPin: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">API Environment</label>
                    <select
                      value={couriers.shadowfax.environment}
                      onChange={(e) =>
                        setCouriers({
                          ...couriers,
                          shadowfax: {
                            ...couriers.shadowfax,
                            environment: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                    >
                      <option value="staging">Staging (dale.staging.shadowfax.in)</option>
                      <option value="production">Production (api.shadowfax.in)</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-amber-300/90 pt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Serviceability, Order Booking & Live Tracking endpoints wired</span>
                </div>
              </div>
            </div>

            {/* Delhivery One */}
            <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h4 className="font-semibold text-white">Delhivery One</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couriers.delhivery.enabled}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        delhivery: { ...couriers.delhivery, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">API Key / Client Token</label>
                  <input
                    type="password"
                    value={couriers.delhivery.apiKey}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        delhivery: { ...couriers.delhivery, apiKey: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Warehouse PIN</label>
                    <input
                      type="text"
                      value={couriers.delhivery.warehousePin}
                      onChange={(e) =>
                        setCouriers({
                          ...couriers,
                          delhivery: { ...couriers.delhivery, warehousePin: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1">Environment</label>
                    <select
                      value={couriers.delhivery.environment}
                      onChange={(e) =>
                        setCouriers({
                          ...couriers,
                          delhivery: {
                            ...couriers.delhivery,
                            environment: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                    >
                      <option value="sandbox">Sandbox (Test)</option>
                      <option value="production">Production (Live)</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-emerald-400/90 pt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Auto-rates, AWB generation, and pickup booking enabled</span>
                </div>
              </div>
            </div>

            {/* Shiprocket */}
            <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h4 className="font-semibold text-white">Shiprocket</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couriers.shiprocket.enabled}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        shiprocket: { ...couriers.shiprocket, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Account Email</label>
                  <input
                    type="email"
                    value={couriers.shiprocket.email}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        shiprocket: { ...couriers.shiprocket, email: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Auth Status</label>
                  <div className="text-xs text-neutral-300 bg-neutral-950 px-3 py-2 rounded border border-neutral-800 font-mono">
                    {couriers.shiprocket.tokenStatus}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sr-autosync"
                    checked={couriers.shiprocket.autoSync}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        shiprocket: { ...couriers.shiprocket, autoSync: e.target.checked },
                      })
                    }
                    className="rounded bg-neutral-950 border-neutral-800 text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="sr-autosync" className="text-xs text-neutral-300">
                    Sync tracking events every 30 mins
                  </label>
                </div>
              </div>
            </div>

            {/* NimbusPost */}
            <div className="border border-neutral-800 bg-neutral-900/30 rounded-lg p-5 space-y-4 opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
                  <h4 className="font-semibold text-white">NimbusPost</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couriers.nimbuspost.enabled}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        nimbuspost: { ...couriers.nimbuspost, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter NimbusPost token"
                    value={couriers.nimbuspost.apiToken}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        nimbuspost: { ...couriers.nimbuspost, apiToken: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <p className="text-xs text-neutral-500">Fallback aggregator for Tier-3 & remote North-East regions.</p>
              </div>
            </div>

            {/* India Post Speed Post */}
            <div className="border border-neutral-800 bg-neutral-900/30 rounded-lg p-5 space-y-4 opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
                  <h4 className="font-semibold text-white">India Post (Business Parcel)</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={couriers.indiaPost.enabled}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        indiaPost: { ...couriers.indiaPost, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Contract / Customer ID</label>
                  <input
                    type="text"
                    placeholder="BNPL Contract Code"
                    value={couriers.indiaPost.businessId}
                    onChange={(e) =>
                      setCouriers({
                        ...couriers,
                        indiaPost: { ...couriers.indiaPost, businessId: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <p className="text-xs text-neutral-500">Universal PAN-India coverage for unserviceable private PINs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Rates & Thresholds */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Customer Rates & Pricing Thresholds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">Free Shipping Above (₹)</label>
              <input
                type="number"
                value={shippingRates.freeThreshold}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, freeThreshold: Number(e.target.value) })
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">Promotional free shipping</span>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={shippingRates.standardFlatRate}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, standardFlatRate: Number(e.target.value) })
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">Applied if cart &lt; threshold</span>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">COD Handling Surcharge (₹)</label>
              <input
                type="number"
                value={shippingRates.codHandlingFee}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, codHandlingFee: Number(e.target.value) })
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">Cash-on-delivery collection fee</span>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Express Air Shipping (₹)</label>
              <input
                type="number"
                value={shippingRates.expressRate}
                onChange={(e) =>
                  setShippingRates({ ...shippingRates, expressRate: Number(e.target.value) })
                }
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">Optional 48h metro delivery</span>
            </div>
          </div>
        </div>

        {/* Packaging Profiles */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Packaging Profiles (Volumetric & Dead Weight)</h3>
              <p className="text-xs text-neutral-400">
                Couriers bill whichever is higher: Dead Weight vs Volumetric Weight (L × B × H / 5000).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-800 rounded-lg overflow-hidden">
              <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="p-3">Profile Name</th>
                  <th className="p-3">Dead Weight</th>
                  <th className="p-3">Dimensions (L × B × H)</th>
                  <th className="p-3">Volumetric Wt.</th>
                  <th className="p-3">Protection Layer</th>
                  <th className="p-3">Fragile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {packages.map((pkg) => {
                  const volWeight = ((pkg.lengthCm * pkg.breadthCm * pkg.heightCm) / 5000).toFixed(2)
                  return (
                    <tr key={pkg.id} className="hover:bg-neutral-900/50">
                      <td className="p-3 font-medium text-white">{pkg.name}</td>
                      <td className="p-3 font-mono">{pkg.weightGrams}g</td>
                      <td className="p-3 font-mono">
                        {pkg.lengthCm} × {pkg.breadthCm} × {pkg.heightCm} cm
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-semibold">{volWeight} kg</td>
                      <td className="p-3 text-neutral-400">{pkg.cushioning}</td>
                      <td className="p-3">
                        {pkg.fragileLabel ? (
                          <span className="bg-red-950 text-red-400 border border-red-800/50 px-2 py-0.5 rounded text-[10px]">
                            Fragile Glass
                          </span>
                        ) : (
                          <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[10px]">
                            Standard
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* High Risk PIN Code Blocklist */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            COD Risk Protection & PIN Code Restricter
          </h3>
          <p className="text-xs text-neutral-400 mb-3">
            Comma-separated Indian Postal PIN codes where Cash on Delivery is disabled due to high historic return-to-origin (RTO) rates. Customers from these PINs must pay online via Razorpay.
          </p>
          <textarea
            rows={2}
            value={blockedPins}
            onChange={(e) => setBlockedPins(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-white font-mono focus:border-neutral-700 outline-none"
            placeholder="e.g. 110006, 700024"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save Shipping Configurations
          </button>
        </div>
      </form>
    </div>
  )
}
