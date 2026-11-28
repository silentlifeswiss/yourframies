import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatINR } from '../../utils/formatters'

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotalINR,
    discountINR,
    shippingFeeINR,
    totalINR,
  } = useCart()

  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null)
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    const res = applyCoupon(couponCode)
    setCouponMsg({ success: res.success, text: res.message })
    if (res.success) setCouponCode('')
  }

  const freeShippingThreshold = 999
  const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotalINR)
  const freeShippingPercent = Math.min(100, (subtotalINR / freeShippingThreshold) * 100)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-semibold tracking-wider uppercase text-neutral-900">
                Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-md"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200">
            <div className="text-[11px] text-neutral-700 font-medium mb-1.5 flex justify-between">
              {amountNeededForFreeShip > 0 ? (
                <span>
                  Add <strong className="text-neutral-900">{formatINR(amountNeededForFreeShip)}</strong> more for <strong>Free Express Shipping</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  🎉 Congratulations! You have unlocked Free Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mb-3" />
                <p className="text-sm font-semibold text-neutral-800">Your bag is currently empty</p>
                <p className="text-xs text-neutral-500 max-w-xs mt-1">
                  Discover our bestselling car frames, aesthetic wall art, and bespoke customizer.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false)
                    navigate('/shop')
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-none">
                  {/* Thumbnail */}
                  <img
                    src={item.customization.photoUrl || item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-24 object-cover rounded border border-neutral-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 mt-1 space-y-0.5">
                        <p>
                          Size: <strong className="text-neutral-700">{item.customization.frameSize === 'A4' ? 'A4' : `${item.customization.frameSize}"`}</strong> • Timber: <strong className="text-neutral-700">{item.customization.moulding}</strong>
                        </p>
                        <p>
                          Mat: <span className="text-neutral-700">{item.customization.matColor || 'None'}</span> • Glass: <span className="text-neutral-700">{item.customization.glassType}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-600 active:bg-neutral-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-neutral-100 text-neutral-600 active:bg-neutral-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-900">
                        {formatINR(item.priceINR * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50/50 space-y-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              {/* Coupon Engine */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Discount Code (WELCOME10)"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-black uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-neutral-800"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && !appliedCoupon && (
                  <p className="mt-1 text-[11px] text-red-600">{couponMsg.text}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{formatINR(subtotalINR)}</span>
                </div>
                {discountINR > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatINR(discountINR)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {shippingFeeINR === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(shippingFeeINR)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Payable</span>
                  <span>{formatINR(totalINR)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false)
                  navigate('/checkout')
                }}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted Checkout • Razorpay & COD Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
