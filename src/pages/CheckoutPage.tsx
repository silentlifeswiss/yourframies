import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { checkIndianPincode } from '../data/pincodes'
import { formatINR } from '../utils/formatters'
import { PaymentMethod } from '../types'

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, subtotalINR, discountINR, shippingFeeINR, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { user, addresses } = useAuth()

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [landmark, setLandmark] = useState('')

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PREPAID_RAZORPAY')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Pincode lookup trigger
  const [pincodeStatus, setPincodeStatus] = useState<{
    isServiceable: boolean
    isCodAvailable: boolean
    city: string
    state: string
    courierName: string
  } | null>(null)

  const handlePincodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    setPincode(cleaned)

    if (cleaned.length === 6) {
      const check = checkIndianPincode(cleaned)
      setPincodeStatus(check)
      if (check.isServiceable) {
        setCity(check.city)
        setState(check.state)
      }
    } else {
      setPincodeStatus(null)
    }
  }

  // Cost Computations
  const codCharge = paymentMethod === 'COD' ? 50 : 0
  const totalPayable = subtotalINR - discountINR + shippingFeeINR + codCharge

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (items.length === 0) {
      navigate('/cart')
      return
    }

    if (!fullName || !email || !phone || !addressLine1 || !pincode) {
      setErrorMsg('Please complete all required shipping fields.')
      return
    }

    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    if (pincodeStatus && !pincodeStatus.isServiceable) {
      setErrorMsg('The entered PIN code is not serviceable by our courier partners.')
      return
    }

    if (paymentMethod === 'COD' && pincodeStatus && !pincodeStatus.isCodAvailable) {
      setErrorMsg('Cash on Delivery is not available for this PIN code. Please select Razorpay online payment.')
      return
    }

    setIsProcessing(true)

    // Simulate Payment / Serverless order creation
    setTimeout(() => {
      const order = createOrder({
        userId: user?.id,
        status: 'CONFIRMED',
        paymentMethod,
        paymentStatus: paymentMethod === 'PREPAID_RAZORPAY' ? 'CAPTURED' : 'PENDING',
        currency: 'INR',
        subtotalINR,
        discountINR,
        shippingFeeINR,
        codChargeINR: codCharge,
        totalINR: totalPayable,
        shippingAddress: {
          fullName,
          phone,
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          pincode,
        },
        items: items.map((i) => ({
          id: `item-${Date.now()}-${Math.random()}`,
          orderId: '',
          productId: i.productId,
          title: i.product.title,
          priceINR: i.priceINR,
          quantity: i.quantity,
          customization: i.customization,
        })),
      })

      clearCart()
      setIsProcessing(false)
      navigate(`/order-confirmation/${order.orderNumber}`)
    }, 1200)
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mb-8">
          Checkout & Shipping
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Contact & Delivery Details */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <MapPin className="w-5 h-5 text-neutral-800" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                  1. Shipping Address (India)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Recipient's Name"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210 (For Courier SMS & OTP)"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="For Order Receipt & Live Tracking"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  House / Flat / Building No. & Street *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 402, Prestige Towers, 8th Main"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Apartment / Area / Locality
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Indiranagar"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Metro Station"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    6-Digit Postal PIN *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="560001"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>

              {pincodeStatus && (
                <div
                  className={`p-3 rounded text-xs flex items-center gap-2 ${
                    pincodeStatus.isServiceable
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Serviceable via <strong>{pincodeStatus.courierName}</strong> to {pincodeStatus.city}. Cash on Delivery (COD) is{' '}
                    <strong>{pincodeStatus.isCodAvailable ? 'Available' : 'Unavailable'}</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <CreditCard className="w-5 h-5 text-neutral-800" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                  2. Select Payment Method
                </h2>
              </div>

              {/* Option A: Razorpay */}
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'PREPAID_RAZORPAY'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'PREPAID_RAZORPAY'}
                  onChange={() => setPaymentMethod('PREPAID_RAZORPAY')}
                  className="mt-1 accent-neutral-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-neutral-900">
                      Razorpay Online (UPI, Cards, NetBanking, Cred, Wallets)
                    </p>
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Fast & Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Instant confirmation. Free express shipping automatically applied.
                  </p>
                </div>
              </label>

              {/* Option B: COD */}
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-neutral-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-neutral-900">Cash on Delivery (COD)</p>
                    <span className="text-[10px] text-neutral-600 font-medium">+₹50 Handling Fee</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Pay in cash upon doorstep delivery by courier agent. Courier will verify delivery PIN.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column: Order Review & Submit */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200 space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Order Items ({items.length})
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {items.map((i) => (
                  <div key={i.id} className="py-3 flex items-center gap-3">
                    <img
                      src={i.customization.photoUrl || i.product.images[0]}
                      alt=""
                      className="w-12 h-14 object-cover rounded border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{i.product.title}</p>
                      <p className="text-[10px] text-neutral-500">
                        {i.customization.frameSize}" • {i.customization.moulding} (x{i.quantity})
                      </p>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">
                        {formatINR(i.priceINR * i.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
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
                {paymentMethod === 'COD' && (
                  <div className="flex justify-between text-amber-700 font-medium">
                    <span>COD Verification Fee</span>
                    <span>+{formatINR(codCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-4 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>{formatINR(totalPayable)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order ({formatINR(totalPayable)})</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-neutral-400 space-y-1">
                <p>🔒 256-Bit SSL Encrypted Bank Level Security</p>
                <p>By placing your order, you agree to Your Framies Terms & Policies.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
