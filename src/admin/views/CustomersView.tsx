import React, { useState } from 'react'
import { Users, Search, ShoppingBag, Phone, Mail, MapPin, Eye } from 'lucide-react'
import { useOrders } from '../../context/OrderContext'
import { formatINR } from '../../utils/formatters'

interface CustomerRecord {
  id: string
  name: string
  email: string
  phone: string
  city: string
  ordersCount: number
  totalSpentINR: number
  lastActive: string
}

export const CustomersView: React.FC = () => {
  const { orders } = useOrders()
  const [search, setSearch] = useState('')

  // Aggregate customers from orders
  const customerMap: Record<string, CustomerRecord> = {}

  orders.forEach((o) => {
    const key = o.shippingAddress.phone || o.shippingAddress.fullName
    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust-${key}`,
        name: o.shippingAddress.fullName,
        email: `${o.shippingAddress.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        phone: o.shippingAddress.phone,
        city: o.shippingAddress.city,
        ordersCount: 1,
        totalSpentINR: o.totalINR,
        lastActive: new Date(o.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }
    } else {
      customerMap[key].ordersCount += 1
      customerMap[key].totalSpentINR += o.totalINR
    }
  })

  const customersList = Object.values(customerMap)

  const filtered = customersList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
            Customer Directory
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Registered Patrons ({customersList.length})
          </h2>
          <p className="text-xs text-neutral-400">
            View customer purchase history, verified contact data, and review uploaded bespoke artwork.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, mobile, or city..."
          className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 uppercase tracking-wider text-[10px] text-neutral-400 font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Primary City</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Lifetime Value (LTV)</th>
                <th className="py-3 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-neutral-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{cust.name}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-400">{cust.phone}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{cust.city}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                      {cust.ordersCount} orders
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">
                    {formatINR(cust.totalSpentINR)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">{cust.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
