import React, { useState } from 'react'
import { Tag, Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react'
import { AVAILABLE_COUPONS, Coupon } from '../../context/CartContext'
import { formatINR } from '../../utils/formatters'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const DiscountsView: React.FC = () => {
  const { logAuditAction } = useAdminAuth()
  const [coupons, setCoupons] = useState<Coupon[]>(AVAILABLE_COUPONS)

  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent')
  const [discountValue, setDiscountValue] = useState<number>(10)
  const [minOrder, setMinOrder] = useState<number>(999)
  const [description, setDescription] = useState('')

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      discountPercent: discountType === 'percent' ? Number(discountValue) : undefined,
      discountAmountINR: discountType === 'flat' ? Number(discountValue) : undefined,
      minOrderINR: Number(minOrder),
      description:
        description ||
        `${discountType === 'percent' ? `${discountValue}%` : `₹${discountValue}`} discount on orders above ₹${minOrder}`,
    }

    setCoupons((prev) => [newCoupon, ...prev])
    logAuditAction('COUPON_CREATED', 'MARKETING', newCoupon.code, `Created coupon ${newCoupon.code}`)
    setCode('')
    setDescription('')
  }

  const handleDeleteCoupon = (cCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== cCode))
    logAuditAction('COUPON_DELETED', 'MARKETING', cCode, `Deleted coupon ${cCode}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Promotions & Campaigns
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Coupons & Special Offers</h2>
          <p className="text-xs text-neutral-400">
            Create percentage discounts, flat cashbacks, free shipping triggers, and minimum order rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Create New Coupon</h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DIWALI25"
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono uppercase outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  Value ({discountType === 'percent' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Minimum Order Amount (INR)</label>
              <input
                type="number"
                required
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Offer Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Visible to customers in cart drawer"
                className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors"
            >
              Activate Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-7 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Active Store Discounts ({coupons.length})
          </h3>

          <div className="space-y-3">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-1">{c.description}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Min. Order: {formatINR(c.minOrderINR)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(c.code)}
                  className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800"
                  title="Remove coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
