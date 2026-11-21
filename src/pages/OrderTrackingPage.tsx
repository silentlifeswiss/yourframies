import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from 'lucide-react'
import { useOrders } from '../context/OrderContext'
import { formatINR } from '../utils/formatters'

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialOrderQuery = searchParams.get('order') || ''

  const { orders, getOrderById } = useOrders()
  const [query, setQuery] = useState(initialOrderQuery)
  const [searchedOrder, setSearchedOrder] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialOrderQuery) {
      handleSearch(initialOrderQuery)
    }
  }, [initialOrderQuery])

  const handleSearch = (targetQuery: string) => {
    setError('')
    const clean = targetQuery.trim()
    if (!clean) return

    const match = getOrderById(clean)
    if (match) {
      setSearchedOrder(match)
    } else {
      setSearchedOrder(null)
      setError(`No order found matching "${clean}". Please verify your order number (e.g. YF-2026-1042).`)
    }
  }

  const trackingSteps = [
    { label: 'Order Confirmed', desc: 'Received & routed to framing studio', done: true },
    {
      label: 'Archival Printing',
      desc: '12-color giclée print on 300 GSM cotton rag',
      done: searchedOrder ? searchedOrder.status !== 'PENDING' : false,
    },
    {
      label: 'Moulding & Assembly',
      desc: 'Solid hardwood cut and corner-joined with glazing',
      done: searchedOrder
        ? ['PROCESSING', 'PRINTING', 'FRAMING', 'PACKAGED', 'SHIPPED', 'DELIVERED'].includes(
            searchedOrder.status
          )
        : false,
    },
    {
      label: 'Shipped via Delhivery',
      desc: 'Dispatched with protective shockproof casing',
      done: searchedOrder ? ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(searchedOrder.status) : false,
    },
    {
      label: 'Out for Delivery',
      desc: 'Courier executive arriving at your destination',
      done: searchedOrder ? ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(searchedOrder.status) : false,
    },
    {
      label: 'Delivered',
      desc: 'Safely handed over to recipient',
      done: searchedOrder ? searchedOrder.status === 'DELIVERED' : false,
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
              placeholder="e.g. YF-2026-1042"
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 rounded text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-black font-mono"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-950 text-white rounded text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
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
                <p className="text-xs text-neutral-500">
                  Recipient: {searchedOrder.shippingAddress.fullName} • {searchedOrder.shippingAddress.city}
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                  Status: {searchedOrder.status}
                </span>
                <span className="text-[11px] text-neutral-400 mt-1">
                  Courier: Delhivery Surface Express (AWB: DEL-8894210)
                </span>
              </div>
            </div>

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
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-4">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-800">Quick Demo Search</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              You can test the tracker immediately with sample orders in the system:
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSearch('YF-2026-1042')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono rounded"
              >
                YF-2026-1042 (Shipped)
              </button>
              <button
                type="button"
                onClick={() => handleSearch('YF-2026-1043')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono rounded"
              >
                YF-2026-1043 (Confirmed)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
