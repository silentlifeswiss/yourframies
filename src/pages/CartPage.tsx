import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/formatters'

export const CartPage: React.FC = () => {
  const {
    items,
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

  const [couponInput, setCouponInput] = React.useState('')
  const [couponError, setCouponError] = React.useState('')
  const navigate = useNavigate()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    const res = applyCoupon(couponInput)
    if (!res.success) {
      setCouponError(res.message)
    } else {
      setCouponError('')
      setCouponInput('')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-serif text-neutral-900">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-neutral-500 mt-2 max-w-sm">
          Explore our collection of automotive frames, aesthetic artwork, or build a custom frame.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-8 py-3 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900 mb-6 sm:mb-8">
          Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 bg-white p-4 sm:p-8 rounded-xl border border-neutral-200 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-row gap-3.5 sm:gap-6 pb-6 border-b border-neutral-100 last:border-none last:pb-0"
              >
                <img
                  src={item.customization.photoUrl || item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-24 sm:w-24 sm:h-32 object-cover rounded border border-neutral-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                        {item.product.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                      <p className="truncate">
                        Frame: <strong className="text-neutral-800">{item.customization.frameSize}"</strong> • <strong className="text-neutral-800">{item.customization.moulding}</strong>
                      </p>
                      <p className="truncate">
                        Mat: <span className="text-neutral-800">{item.customization.matColor || 'None'}</span> • Glass: <span className="text-neutral-800">{item.customization.glassType}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <div className="flex items-center border border-neutral-300 rounded">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 sm:p-1.5 hover:bg-neutral-100 text-neutral-600 active:bg-neutral-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 sm:px-3 text-xs font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 sm:p-1.5 hover:bg-neutral-100 text-neutral-600 active:bg-neutral-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatINR(item.priceINR * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] sm:text-[11px] text-neutral-400">
                          {formatINR(item.priceINR)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 space-y-6">
              <h2 className="text-base font-semibold uppercase tracking-wider text-neutral-900">
                Order Summary
              </h2>

              {/* Coupon Engine */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
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
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded text-xs uppercase focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 pt-4 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatINR(subtotalINR)}</span>
                </div>
                {discountINR > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatINR(discountINR)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFeeINR === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(shippingFeeINR)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-4 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span>{formatINR(totalINR)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encryption • Transit Damage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
