import React from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useOrders } from '../../context/OrderContext'
import { useSiteContent } from '../../context/SiteContentContext'
import { formatINR } from '../../utils/formatters'
import { AdminViewType } from '../AdminLayout'

export const DashboardView: React.FC<{ onNavigate: (view: AdminViewType) => void }> = ({
  onNavigate,
}) => {
  const { orders } = useOrders()
  const { hasUnpublishedChanges } = useSiteContent()

  // Financial calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalINR, 0)
  const totalOrders = orders.length
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const pendingOrders = orders.filter((o) => ['PENDING', 'CONFIRMED', 'PRINTING'].includes(o.status)).length

  // Estimated Profit Calculation: Revenue - Estimated Material/Printing COGS (35%) - Estimated Shipping (₹90/order)
  const estimatedCOGS = Math.round(totalRevenue * 0.35)
  const estimatedShippingCosts = totalOrders * 90
  const estimatedNetProfit = Math.max(0, totalRevenue - estimatedCOGS - estimatedShippingCosts)

  const prepaidOrders = orders.filter((o) => o.paymentMethod === 'PREPAID_RAZORPAY').length
  const codOrders = orders.filter((o) => o.paymentMethod === 'COD').length

  // Dynamically compute past 6 months from real store orders
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const monthlyBuckets: Record<string, { month: string; sales: number; profit: number }> = {}

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    monthlyBuckets[key] = {
      month: monthNames[d.getMonth()],
      sales: 0,
      profit: 0,
    }
  }

  orders.forEach((o) => {
    const d = new Date(o.createdAt)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (monthlyBuckets[key]) {
      monthlyBuckets[key].sales += o.totalINR || 0
      const cogs = Math.round((o.totalINR || 0) * 0.35)
      monthlyBuckets[key].profit += Math.max(0, (o.totalINR || 0) - cogs - 90)
    }
  })

  const monthlyChartData = Object.values(monthlyBuckets)

  const paymentMixData =
    totalOrders > 0
      ? [
          { name: 'Razorpay Online', value: prepaidOrders, color: '#f59e0b' },
          { name: 'Cash on Delivery', value: codOrders, color: '#737373' },
        ].filter((p) => p.value > 0)
      : [{ name: 'Awaiting Orders', value: 1, color: '#404040' }]

  return (
    <div className="space-y-8">
      {/* Top Banner Alert for Unpublished Changes */}
      {hasUnpublishedChanges && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              You have unpublished visual edits in the draft queue. Click <strong>Publish Draft</strong> in the header to synchronize with the public store.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('homepage')}
            className="px-3 py-1 bg-amber-500 text-neutral-950 font-bold rounded hover:bg-amber-400"
          >
            Review Sections
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Gross Revenue
          </span>
          <p className="text-2xl font-bold text-white mt-1">{formatINR(totalRevenue)}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalOrders > 0 ? `${totalOrders} orders recorded in database` : 'Ready for live customer orders'}</span>
          </div>
        </div>

        <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Estimated Net Profit
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{formatINR(estimatedNetProfit)}</p>
          <p className="text-[10px] text-neutral-400 mt-2">
            After 35% estimated COGS & ₹90/shipment
          </p>
        </div>

        <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Total Orders Fulfilled
          </span>
          <p className="text-2xl font-bold text-white mt-1">{totalOrders}</p>
          <p className="text-[11px] text-neutral-400 mt-2">
            <strong className="text-amber-400">{pendingOrders}</strong> currently in studio production
          </p>
        </div>

        <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-bold text-white mt-1">{formatINR(aov)}</p>
          <p className="text-[11px] text-neutral-400 mt-2">Bespoke frame customizer driven</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Chart */}
        <div className="lg:col-span-8 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Monthly Revenue vs. Net Profit (INR)
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">Pan-India Sales</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="month" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '11px' }}
                  formatter={(val: any) => formatINR(Number(val))}
                />
                <Bar dataKey="sales" fill="#d97706" name="Gross Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10b981" name="Estimated Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Split Pie */}
        <div className="lg:col-span-4 bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200 mb-2">
              Payment Method Breakdown
            </h3>
            <p className="text-[11px] text-neutral-400">Prepaid orders minimize return-to-origin (RTO) costs.</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMixData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {paymentMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', color: '#a3a3a3' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex justify-between">
            <span>Prepaid: <strong>{prepaidOrders}</strong></span>
            <span>COD: <strong>{codOrders}</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="bg-neutral-950/80 p-6 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
          Operational Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('homepage')}
            className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
          >
            <Layers className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-xs font-bold text-white">Visual Editor</p>
            <p className="text-[11px] text-neutral-400">Reorder & edit homepage</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
          >
            <Package className="w-5 h-5 text-sky-400 mb-2" />
            <p className="text-xs font-bold text-white">Add Product</p>
            <p className="text-[11px] text-neutral-400">Create new frame artwork</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-xs font-bold text-white">Manage Orders</p>
            <p className="text-[11px] text-neutral-400">{pendingOrders} pending shipments</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('shipping')}
            className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors"
          >
            <Truck className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-xs font-bold text-white">Logistics & AWB</p>
            <p className="text-[11px] text-neutral-400">Delhivery & Shiprocket</p>
          </button>
        </div>
      </div>
    </div>
  )
}
