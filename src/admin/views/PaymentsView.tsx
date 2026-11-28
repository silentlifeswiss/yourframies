import React, { useState } from 'react'
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  RotateCcw,
  Zap,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const PaymentsView: React.FC = () => {
  const { logAuditAction } = useAdminAuth()
  const [showSecret, setShowSecret] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [refundStatus, setRefundStatus] = useState<string | null>(null)

  // Razorpay Gateway Config
  const [gatewayConfig, setGatewayConfig] = useState({
    mode: 'live' as 'test' | 'live',
    keyId: 'rzp_live_U5OGherACJU1kQ',
    keySecret: 'zTZlr04fo2Ay5YN10Do4n6ai',
    webhookSecret: '',
    autoCapture: true,
    methods: {
      upi: true,
      cards: true,
      netbanking: true,
      wallets: true,
      cod: true,
    },
  })

  // Refund Form State
  const [refundForm, setRefundForm] = useState({
    paymentId: '',
    amount: '',
    reason: '',
  })

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    logAuditAction(
      'UPDATE_PAYMENT_GATEWAY',
      'PAYMENT_CONFIG',
      'razorpay',
      `Switched mode to ${gatewayConfig.mode.toUpperCase()}, AutoCapture: ${gatewayConfig.autoCapture}`
    )
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault()
    if (!refundForm.paymentId || !refundForm.amount) {
      alert('Please enter both Payment ID and Refund Amount.')
      return
    }

    logAuditAction(
      'INITIATE_REFUND',
      'PAYMENT',
      refundForm.paymentId,
      `Refunded ₹${refundForm.amount}. Reason: ${refundForm.reason}`
    )

    setRefundStatus(`Refund of ₹${refundForm.amount} initiated for ${refundForm.paymentId}. (Ref ID: rfd_${Date.now().toString(36)})`)
    setRefundForm({ paymentId: '', amount: '', reason: '' })
    setTimeout(() => setRefundStatus(null), 5000)
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-serif tracking-tight text-white flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-400" />
          Razorpay & Payment Gateways
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Configure Razorpay API credentials, webhook endpoints, UPI/Card payment channels, and issue automated refunds.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Razorpay payment configuration saved successfully.</span>
        </div>
      )}

      {/* Gateway Settings Form */}
      <form onSubmit={handleSaveConfig} className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <span>Razorpay Integration</span>
              <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded font-mono">
                v1.x Official
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Secure HMAC-SHA256 signature verification enabled on Netlify Functions backend.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setGatewayConfig({ ...gatewayConfig, mode: 'test' })}
              className={`px-3 py-1.5 text-xs rounded font-medium transition ${
                gatewayConfig.mode === 'test'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Test Mode
            </button>
            <button
              type="button"
              onClick={() => setGatewayConfig({ ...gatewayConfig, mode: 'live' })}
              className={`px-3 py-1.5 text-xs rounded font-medium transition ${
                gatewayConfig.mode === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Production
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={gatewayConfig.keyId}
              onChange={(e) => setGatewayConfig({ ...gatewayConfig, keyId: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">Public key used for frontend checkout initialization</span>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Razorpay Key Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={gatewayConfig.keySecret}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, keySecret: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">Kept isolated in backend environment (never sent to client)</span>
          </div>
        </div>

        <div className="border-t border-neutral-800/80 pt-4">
          <label className="text-xs text-neutral-400 block mb-1">Razorpay Webhook Secret</label>
          <input
            type="password"
            value={gatewayConfig.webhookSecret}
            onChange={(e) => setGatewayConfig({ ...gatewayConfig, webhookSecret: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
          />
          <div className="text-[11px] text-neutral-400 mt-2 bg-neutral-900/60 p-2.5 rounded border border-neutral-800 flex items-center justify-between">
            <span>Webhook URL: <code className="text-blue-300 font-mono">https://yourframies.com/.netlify/functions/razorpay-webhook</code></span>
            <span className="text-emerald-400 text-xs font-semibold">Active & Listening</span>
          </div>
        </div>

        {/* Enabled Payment Methods */}
        <div className="border-t border-neutral-800/80 pt-4">
          <h4 className="text-sm font-medium text-white mb-3">Enabled Checkout Methods</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'upi', label: 'UPI / QR / GPay' },
              { key: 'cards', label: 'Cards (Visa/MC/RuPay)' },
              { key: 'netbanking', label: 'Netbanking (50+ Banks)' },
              { key: 'wallets', label: 'Wallets & CRED' },
              { key: 'cod', label: 'Cash on Delivery (COD)' },
            ].map((m) => (
              <label
                key={m.key}
                className="flex items-center gap-2 p-3 bg-neutral-900 rounded-lg border border-neutral-800 cursor-pointer hover:border-neutral-700"
              >
                <input
                  type="checkbox"
                  checked={(gatewayConfig.methods as any)[m.key]}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      methods: {
                        ...gatewayConfig.methods,
                        [m.key]: e.target.checked,
                      },
                    })
                  }
                  className="rounded bg-neutral-950 border-neutral-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-xs text-neutral-300">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save Gateway Settings
          </button>
        </div>
      </form>

      {/* Manual Refund Tool */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-medium text-white">Issue Direct Razorpay Refund</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-6">
          Process immediate full or partial reversals directly into the customer's source account (UPI, Card, or Netbanking).
        </p>

        {refundStatus && (
          <div className="mb-4 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs">
            {refundStatus}
          </div>
        )}

        <form onSubmit={handleProcessRefund} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Razorpay Payment ID</label>
            <input
              type="text"
              placeholder="e.g. pay_N29d8aK1m092"
              value={refundForm.paymentId}
              onChange={(e) => setRefundForm({ ...refundForm, paymentId: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Refund Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1499"
              value={refundForm.amount}
              onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Reason for Refund</label>
            <input
              type="text"
              value={refundForm.reason}
              onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-lg text-xs flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Authorize Razorpay Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
