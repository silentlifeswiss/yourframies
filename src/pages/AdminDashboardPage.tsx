import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Download,
  CheckCircle2,
  AlertCircle,
  Tag,
  Settings,
  Search,
  ExternalLink,
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
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { INITIAL_PRODUCTS } from '../data/products'
import { getStoreCategories } from '../data/categories'
import { AVAILABLE_COUPONS, Coupon } from '../context/CartContext'
import { formatINR } from '../utils/formatters'
import { OrderStatus, Product } from '../types'

export const AdminDashboardPage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'shipping'>('overview')

  // Products State
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS)
  const [searchOrderQuery, setSearchOrderQuery] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL')

  // Coupons State
  const [couponsList, setCouponsList] = useState<Coupon[]>(AVAILABLE_COUPONS)
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10)
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(999)

  // Shipping API Settings State
  const [delhiveryToken, setDelhiveryToken] = useState('del_live_••••••••••••••••')
  const [shiprocketEmail, setShiprocketEmail] = useState('shipping@yourframies.com')
  const [standardShippingFee, setStandardShippingFee] = useState(99)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999)
  const [codFee, setCodFee] = useState(50)
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false)

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalINR, 0)
  const totalOrders = orders.length
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const pendingOrders = orders.filter((o) => ['PENDING', 'CONFIRMED'].includes(o.status)).length
  const prepaidCount = orders.filter((o) => o.paymentMethod === 'PREPAID_RAZORPAY').length
  const codCount = orders.filter((o) => o.paymentMethod === 'COD').length

  // Monthly Chart Mock Data
  const salesChartData = [
    { month: 'Jun', sales: 42000, orders: 28 },
    { month: 'Jul', sales: 58000, orders: 39 },
    { month: 'Aug', sales: 74000, orders: 48 },
    { month: 'Sep', sales: 89000, orders: 56 },
    { month: 'Oct', sales: 112000, orders: 74 },
    { month: 'Nov', sales: 145000, orders: 92 },
  ]

  const paymentPieData = [
    { name: 'Razorpay Prepaid', value: prepaidCount || 1, color: '#09090b' },
    { name: 'Cash on Delivery', value: codCount || 1, color: '#d97706' },
  ]

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false
    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase()
      const matchNum = o.orderNumber.toLowerCase().includes(q)
      const matchName = o.shippingAddress.fullName.toLowerCase().includes(q)
      if (!matchNum && !matchName) return false
    }
    return true
  })

  // Export Orders to CSV
  const exportOrdersCSV = () => {
    const headers = 'Order Number,Date,Customer,Phone,City,State,PIN,Payment Method,Payment Status,Total INR,Status\n'
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.createdAt}","${o.shippingAddress.fullName}","${o.shippingAddress.phone}","${o.shippingAddress.city}","${o.shippingAddress.state}","${o.shippingAddress.pincode}","${o.paymentMethod}","${o.paymentStatus}",${o.totalINR},"${o.status}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yourframies-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCouponCode.trim()) return
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponDiscount,
      minOrderINR: newCouponMinOrder,
      description: `${newCouponDiscount}% off on orders above ₹${newCouponMinOrder}`,
    }
    setCouponsList((prev) => [...prev, newC])
    setNewCouponCode('')
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProductsList((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  return (
    <div className="bg-neutral-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-neutral-300 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                Admin Panel
              </span>
              <span className="text-xs text-neutral-500">v1.2.0 • Live Store</span>
            </div>
            <h1 className="font-serif text-3xl font-light text-neutral-900 mt-1">
              Your Framies Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-white border border-neutral-300 rounded text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50"
            >
              Back to Storefront
            </Link>
            <button
              type="button"
              onClick={exportOrdersCSV}
              className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800"
            >
              <Download className="w-3.5 h-3.5" />
              Export Orders (CSV)
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 overflow-x-auto my-6 border-b border-neutral-300 pb-2">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'products', label: `Products (${productsList.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'coupons', label: `Coupons (${couponsList.length})`, icon: <Tag className="w-4 h-4" /> },
            { id: 'shipping', label: 'Shipping & Logistics', icon: <Truck className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Total Gross Revenue
                </span>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{formatINR(totalRevenue)}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ +24.8% vs last month</span>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Total Orders
                </span>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{totalOrders}</p>
                <span className="text-[10px] text-neutral-500 font-medium">
                  {pendingOrders} awaiting fulfillment
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Average Order Value (AOV)
                </span>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{formatINR(aov)}</p>
                <span className="text-[10px] text-neutral-500 font-medium">Bespoke frames trending high</span>
              </div>

              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Prepaid vs COD Ratio
                </span>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {prepaidCount} : {codCount}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Low RTO risk (Prepaid dominated)
                </span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sales Bar Chart */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-6">
                  Monthly Revenue Trend (INR)
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: any) => formatINR(Number(value))} />
                      <Bar dataKey="sales" fill="#171717" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Pie Chart */}
              <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-4">
                  Payment Mix
                </h3>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        label
                      >
                        {paymentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
                  COD orders require automated mobile number OTP confirmation to prevent RTO.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  placeholder="Search by order # or name..."
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-neutral-600">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="text-xs border border-neutral-300 rounded px-3 py-2 bg-neutral-50 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PRINTING">Printing</option>
                  <option value="FRAMING">Framing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 uppercase tracking-wider text-[10px] text-neutral-500 font-bold">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
                        <p className="text-[11px] text-neutral-500">{order.shippingAddress.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {order.shippingAddress.city}, {order.shippingAddress.pincode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-neutral-800">
                          {order.paymentMethod === 'PREPAID_RAZORPAY' ? 'Prepaid' : 'COD'}
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {formatINR(order.totalINR)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value as OrderStatus)}
                          className="text-xs border border-neutral-300 rounded px-2 py-1 bg-white font-semibold outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PRINTING">PRINTING</option>
                          <option value="FRAMING">FRAMING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/track-order?order=${order.orderNumber}`}
                          target="_blank"
                          className="text-xs text-neutral-900 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Products Manager */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Catalog Inventory ({productsList.length} Items)
              </h2>
              <button
                type="button"
                onClick={() =>
                  alert('Add Product Modal: Select images, set price, sizes, and moulding variants.')
                }
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Artwork
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 uppercase tracking-wider text-[10px] text-neutral-500 font-bold">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover rounded border border-neutral-200"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-neutral-900">{p.title}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">{p.slug}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {getStoreCategories().find((c) => c.id === p.categoryId)?.name || 'Custom'}
                      </td>
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {formatINR(p.basePriceINR)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/product/${p.slug}`}
                            className="text-neutral-500 hover:text-black"
                            title="View product"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Coupons Manager */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-4">
                Create Discount Coupon
              </h3>
              <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full p-2.5 border border-neutral-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Minimum Order (INR)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full p-2.5 border border-neutral-300 rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider"
                >
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-4">
                Active Store Coupons
              </h3>
              <div className="divide-y divide-neutral-100">
                {couponsList.map((c) => (
                  <div key={c.code} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <p className="text-neutral-500 mt-1">{c.description}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Shipping & Logistics */}
        {activeTab === 'shipping' && (
          <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-2xs max-w-3xl space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Indian Courier & Logistics Configuration
              </h3>
              <p className="text-neutral-500 mt-1">
                Configure API keys and fee rules for Delhivery One, Shiprocket, and NimbusPost.
              </p>
            </div>

            {savedSettingsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Shipping settings updated successfully!</span>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Delhivery One API Token
                </label>
                <input
                  type="password"
                  value={delhiveryToken}
                  onChange={(e) => setDelhiveryToken(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Shiprocket API Account
                </label>
                <input
                  type="email"
                  value={shiprocketEmail}
                  onChange={(e) => setShiprocketEmail(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Standard Shipping (₹)
                  </label>
                  <input
                    type="number"
                    value={standardShippingFee}
                    onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                    className="w-full p-2.5 border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Free Shipping Above (₹)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full p-2.5 border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    COD Handling Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={codFee}
                    onChange={(e) => setCodFee(Number(e.target.value))}
                    className="w-full p-2.5 border border-neutral-300 rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSavedSettingsSuccess(true)
                  setTimeout(() => setSavedSettingsSuccess(false), 3000)
                }}
                className="mt-4 px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
              >
                Save Logistics Rules
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
