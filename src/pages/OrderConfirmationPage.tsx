import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Package, Truck, Printer, ArrowRight, ShieldCheck } from 'lucide-react'
import { useOrders } from '../context/OrderContext'
import { formatINR } from '../utils/formatters'
import { api } from '../services/api'

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { getOrderById } = useOrders()
  const localOrder = orderNumber ? getOrderById(orderNumber) : undefined
  const [order, setOrder] = useState<any>(localOrder)
  const [loading, setLoading] = useState(!localOrder)

  useEffect(() => {
    if (!order && orderNumber) {
      api.getOrder(orderNumber).then((res) => {
        if (res.success && res.data) {
          setOrder(res.data)
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [order, orderNumber])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500">Retrieving your order #{orderNumber}...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif text-neutral-900">Order Not Found</h1>
        <p className="text-xs text-neutral-500 mt-2">
          Could not locate order details for #{orderNumber}.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Return to Store
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-neutral-200 shadow-sm text-center">
          {/* Success Checkmark */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
            Order Confirmed & Received
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Thank you, {order.shippingAddress.fullName}!
          </h1>
          <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto">
            Your handcrafted order <strong className="text-neutral-900">#{order.orderNumber}</strong> has been received by our workshop atelier.
          </p>

          {/* Quick Info Box */}
          <div className="mt-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200/80 text-left grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-neutral-400 uppercase text-[10px] font-bold">Order Number</span>
              <p className="font-bold text-neutral-900 mt-0.5">{order.orderNumber}</p>
            </div>
            <div>
              <span className="text-neutral-400 uppercase text-[10px] font-bold">Payment Method</span>
              <p className="font-bold text-neutral-900 mt-0.5">
                {order.paymentMethod === 'PREPAID_RAZORPAY' ? 'Prepaid (Razorpay)' : 'Cash on Delivery (COD)'}
              </p>
            </div>
            <div>
              <span className="text-neutral-400 uppercase text-[10px] font-bold">Estimated Delivery</span>
              <p className="font-bold text-neutral-900 mt-0.5">3 - 5 Business Days</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="mt-8 text-left border-t border-neutral-200 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-4">
              Items In This Order
            </h3>
            <div className="divide-y divide-neutral-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-neutral-500 text-[11px]">
                      {item.customization?.frameSize ? `Size: ${item.customization.frameSize === 'A4' ? 'A4' : `${item.customization.frameSize}"`} • ` : ''}
                      {item.customization?.moulding ? `Moulding: ${item.customization.moulding} ` : ''}
                      (x{item.quantity})
                    </p>
                  </div>
                  <span className="font-bold text-neutral-900">
                    {formatINR(item.priceINR * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-4 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Total Amount Paid / Payable</span>
                <span className="text-sm font-bold text-neutral-900">{formatINR(order.totalINR)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 text-left border-t border-neutral-200 pt-6 text-xs text-neutral-600">
            <h3 className="font-semibold uppercase tracking-wider text-neutral-800 mb-2">
              Shipping Destination
            </h3>
            <p className="font-medium text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="mt-1 text-neutral-500">Contact: {order.shippingAddress.phone}</p>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/track-order?order=${order.orderNumber}`}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Shipment</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-100 text-neutral-800 rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
