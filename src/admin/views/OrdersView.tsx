import React, { useState } from 'react'
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { useOrders } from '../../context/OrderContext'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { formatINR } from '../../utils/formatters'
import { Order, OrderStatus } from '../../types'

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders()
  const { logAuditAction } = useAdminAuth()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [paymentFilter, setPaymentFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [awbInput, setAwbInput] = useState('')
  const [courierSelect, setCourierSelect] = useState('Delhivery Surface Express')

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false
    if (paymentFilter !== 'ALL' && o.paymentMethod !== paymentFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.shippingAddress.fullName.toLowerCase().includes(q) &&
        !o.shippingAddress.phone.includes(q)
      ) {
        return false
      }
    }
    return true
  })

  const handleUpdateStatus = (orderNumber: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderNumber, newStatus)
    logAuditAction('ORDER_STATUS_CHANGED', 'ORDER', orderNumber, `Status updated to ${newStatus}`)
    if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handleBookShipment = (order: Order) => {
    const generatedAwb = `DEL-${Math.floor(1000000 + Math.random() * 9000000)}`
    updateOrderStatus(order.orderNumber, 'SHIPPED', generatedAwb, courierSelect)
    logAuditAction('SHIPMENT_BOOKED', 'SHIPMENT', order.orderNumber, `Booked on ${courierSelect} with AWB: ${generatedAwb}`)
    alert(`Shipment booked successfully with ${courierSelect}!\nAssigned AWB Tracking: ${generatedAwb}`)
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status: 'SHIPPED' })
    }
  }

  const exportCSV = () => {
    const headers = 'Order Number,Date,Customer,Phone,Email,City,State,PIN,Payment Method,Payment Status,Total,Status\n'
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.createdAt}","${o.shippingAddress.fullName}","${o.shippingAddress.phone}","${o.shippingAddress.fullName}","${o.shippingAddress.city}","${o.shippingAddress.state}","${o.shippingAddress.pincode}","${o.paymentMethod}","${o.paymentStatus}",${o.totalINR},"${o.status}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Fulfillment & Consignments
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Orders Management ({orders.length})</h2>
          <p className="text-xs text-neutral-400">
            Update lifecycle statuses, generate courier AWBs, print packing slips, and monitor customer deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950/80 p-4 rounded-xl border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PRINTING">Printing</option>
            <option value="FRAMING">Framing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white outline-none"
          >
            <option value="ALL">All Payments</option>
            <option value="PREPAID_RAZORPAY">Razorpay Prepaid</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 uppercase tracking-wider text-[10px] text-neutral-400 font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-900/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
                    <p className="text-[11px] text-neutral-500">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {order.shippingAddress.city}, {order.shippingAddress.pincode}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white">
                      {order.paymentMethod === 'PREPAID_RAZORPAY' ? 'Prepaid' : 'COD'}
                    </span>
                    <span className="block text-[10px] text-neutral-500 font-mono">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{formatINR(order.totalINR)}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.orderNumber, e.target.value as OrderStatus)
                      }
                      className="p-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs font-semibold text-white outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="FRAMING">FRAMING</option>
                      <option value="PACKAGED">PACKAGED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Fulfillment Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 text-xs shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold font-mono">
                  Consignment Inspector
                </span>
                <h3 className="text-lg font-bold text-white">Order #{selectedOrder.orderNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            {/* Recipient info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Recipient & Contact
                </span>
                <p className="font-bold text-white mt-1">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-400">{selectedOrder.shippingAddress.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Delivery Destination
                </span>
                <p className="text-neutral-300 mt-1">{selectedOrder.shippingAddress.addressLine1}</p>
                <p className="text-neutral-300">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  <strong className="text-white font-mono">{selectedOrder.shippingAddress.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Order Items</span>
              <div className="divide-y divide-neutral-800 bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                {selectedOrder.items.map((i) => (
                  <div key={i.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{i.title}</p>
                      <p className="text-[11px] text-neutral-400">
                        Size: {i.customization.frameSize}" • Moulding: {i.customization.moulding} • Mat:{' '}
                        {i.customization.matColor || 'None'} • Glass: {i.customization.glassType}
                      </p>
                    </div>
                    <span className="font-bold text-white">{formatINR(i.priceINR * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Dispatch Actions */}
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-500">
                Logistics & Carrier Booking
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={courierSelect}
                  onChange={(e) => setCourierSelect(e.target.value)}
                  className="flex-1 p-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white outline-none"
                >
                  <option value="Delhivery Surface Express">Delhivery Surface Express (Cheapest Rate)</option>
                  <option value="Shiprocket Air Cargo">Shiprocket Air Priority</option>
                  <option value="NimbusPost Express">NimbusPost Logistics</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleBookShipment(selectedOrder)}
                  className="px-5 py-2.5 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-400"
                >
                  <Truck className="w-4 h-4" />
                  <span>Generate AWB & Label</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Packing Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-neutral-800 text-neutral-300 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
