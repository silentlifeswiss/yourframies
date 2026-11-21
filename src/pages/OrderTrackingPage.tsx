import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, ExternalLink, Loader2 } from 'lucide-react'
import { useOrders } from '../context/OrderContext'
import { formatINR } from '../utils/formatters'
import { api } from '../services/api'

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialOrderQuery = searchParams.get('order') || ''

  const { getOrderById } = useOrders()
  const [query, setQuery] = useState(initialOrderQuery)
  const [searchedOrder, setSearchedOrder] = useState<any>(null)
  const [liveTracking, setLiveTracking] = useState<any>(null)
  const [additionalOrders, setAdditionalOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialOrderQuery) {
      handleSearch(initialOrderQuery)
    }
  }, [initialOrderQuery])

  const handleSearch = async (targetQuery: string) => {
    setError('')
    const clean = targetQuery.trim()
    if (!clean) return

    setIsLoading(true)

    try {
      // 1. Query live database / serverless backend
      const res = await api.trackOrder(clean)

      if (res.success && res.data?.order) {
        setSearchedOrder(res.data.order)
        setLiveTracking(res.data.tracking)
        setAdditionalOrders(res.data.additionalOrders || [])
        setIsLoading(false)
        return
      }

      // 2. Fallback to local client order context if offline or newly created
      const localMatch = getOrderById(clean)
      if (localMatch) {
        setSearchedOrder(localMatch)
        setLiveTracking(null)
        setAdditionalOrders([])
        setIsLoading(false)
        return
      }

      setSearchedOrder(null)
      setLiveTracking(null)
      setAdditionalOrders([])
      setError(
        res.message ||
          `No order found matching "${clean}". Please verify your order number (e.g. YF-2026-XXXX) or registered 10-digit mobile number.`
      )
    } catch {
      const localMatch = getOrderById(clean)
      if (localMatch) {
        setSearchedOrder(localMatch)
        setLiveTracking(null)
      } else {
        setSearchedOrder(null)
        setError(`Unable to connect to tracking server. Please verify your order number and retry.`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isDelivered = searchedOrder?.status === 'DELIVERED'
  const isOutForDelivery = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(searchedOrder?.status)
  const isShipped = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(searchedOrder?.status)
  const isFraming = ['PROCESSING', 'PRINTING', 'FRAMING', 'PACKAGED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
    searchedOrder?.status
  )
  const isPrinting = ['PRINTING', 'FRAMING', 'PACKAGED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
    searchedOrder?.status
  )

  const trackingSteps = [
    { label: 'Order Confirmed', desc: 'Received & routed to framing atelier studio', done: true },
    {
      label: 'Archival Printing',
      desc: '12-color ultra-chrome giclée print on 300 GSM cotton rag',
      done: Boolean(searchedOrder && isPrinting),
    },
    {
      label: 'Moulding & Assembly',
      desc: 'Solid hardwood custom joinery with anti-glare glazing & acid-free matting',
      done: Boolean(searchedOrder && isFraming),
    },
    {
      label: 'Shipped via Courier Partner',
      desc: searchedOrder?.awbCode
        ? `Dispatched with protective casing. AWB: ${searchedOrder.awbCode}`
        : 'Dispatched with protective shockproof multi-layer casing',
      done: Boolean(searchedOrder && isShipped),
    },
    {
      label: 'Out for Delivery',
      desc: 'Express logistics courier executive out for delivery to destination',
      done: Boolean(searchedOrder && isOutForDelivery),
    },
    {
      label: 'Delivered',
      desc: 'Safely handed over to recipient with signature confirmation',
      done: Boolean(searchedOrder && isDelivered),
    },
  ]

  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Real-Time Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mt-1">
            Track Your Frame Package
          </h1>
          <p className="mt-2 text-xs text-neutral-500">
            Enter your order number or registered phone to check live transit status across India.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
            className="mt-6 flex gap-2"
          >
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. YF-2026-XXXX or 9876543210"
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 rounded text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black font-mono"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-neutral-950 text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isLoading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>

          {error && <p className="mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">{error}</p>}

          {additionalOrders.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-neutral-500 font-semibold uppercase">Other Orders Found:</span>
              {additionalOrders.map((ord: any) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => setSearchedOrder(ord)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    searchedOrder?.orderNumber === ord.orderNumber
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                  }`}
                >
                  {ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {searchedOrder ? (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-200 gap-4">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                  Tracking Order
                </span>
                <h2 className="text-xl font-bold text-neutral-900">{searchedOrder.orderNumber}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Recipient: <span className="font-semibold text-neutral-700">{searchedOrder.shippingAddress?.fullName}</span> • {searchedOrder.shippingAddress?.city}, {searchedOrder.shippingAddress?.state} ({searchedOrder.shippingAddress?.pincode})
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Payment: <span className="font-medium text-neutral-600">{searchedOrder.paymentMethod === 'PREPAID_RAZORPAY' ? 'Prepaid via Razorpay' : 'Cash on Delivery (COD)'}</span> • Total: {formatINR(searchedOrder.totalINR)}
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="px-3.5 py-1 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                  Status: {searchedOrder.status}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1.5 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-400" />
                  Courier: {searchedOrder.courierPartner || 'Delhivery Express'}
                  {searchedOrder.awbCode ? (
                    <a
                      href={`https://www.delhivery.com/track/package/${searchedOrder.awbCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-neutral-900 font-mono font-bold underline hover:text-black flex items-center gap-0.5"
                    >
                      (AWB: {searchedOrder.awbCode})
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-neutral-400 font-mono"> (AWB Pending Dispatch)</span>
                  )}
                </span>
              </div>
            </div>

            {/* Live Delhivery Scan Details if available */}
            {liveTracking && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Live Delhivery One Transit Status
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    {liveTracking.status || 'Active In-Transit'}
                  </span>
                </div>
                {liveTracking.scans && liveTracking.scans.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200 text-xs text-emerald-800 space-y-1">
                    {liveTracking.scans.slice(0, 3).map((scan: any, sIdx: number) => (
                      <p key={sIdx} className="text-[11px]">
                        • <span className="font-semibold">{scan.scanDateTime || scan.date}:</span> {scan.instructions || scan.activity} ({scan.location})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Visual Timeline */}
            <div className="py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-8">
                Fulfillment & Transit Milestones
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {trackingSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.done
                          ? 'bg-neutral-900 text-white ring-4 ring-white'
                          : 'bg-neutral-200 text-neutral-400 ring-4 ring-white'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider ${
                          step.done ? 'text-neutral-900' : 'text-neutral-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5 font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Items */}
            <div className="pt-6 border-t border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-3">
                Items in Consignment
              </h3>
              <div className="space-y-2">
                {searchedOrder.items.map((i: any) => (
                  <div
                    key={i.id}
                    className="flex justify-between items-center text-xs p-3 bg-neutral-50 rounded border border-neutral-100"
                  >
                    <div>
                      <p className="font-semibold text-neutral-900">{i.title}</p>
                      <p className="text-[11px] text-neutral-500">
                        {i.customization.frameSize}" • {i.customization.moulding} (Qty: {i.quantity})
                      </p>
                    </div>
                    <span className="font-bold text-neutral-900">
                      {formatINR(i.priceINR * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-3">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-800">Track Your Consignment</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Enter your Order Number (e.g. YF-2026-XXXX) or your registered 10-digit mobile number above to see real-time courier dispatch and delivery milestones.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
