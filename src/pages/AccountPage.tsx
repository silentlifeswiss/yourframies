import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Package,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  Truck,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { formatINR } from '../utils/formatters'
import { checkIndianPincode, lookupPincode } from '../data/pincodes'

export const AccountPage: React.FC = () => {
  const { user, addresses, addAddress, deleteAddress, logout } = useAuth()
  const { orders, refreshCustomerOrders } = useOrders()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders')

  // Auto-refresh customer orders from live database
  React.useEffect(() => {
    if (user?.phone || user?.id) {
      refreshCustomerOrders(user.phone || user.id)
    }
  }, [user?.phone, user?.id])

  // New address state
  const [showAddAddr, setShowAddAddr] = useState(false)
  const [addrName, setAddrName] = useState('')
  const [addrPhone, setAddrPhone] = useState('')
  const [addrLine1, setAddrLine1] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrState, setAddrState] = useState('')
  const [addrPin, setAddrPin] = useState('')

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-serif text-neutral-900">Please Sign In</h2>
        <p className="text-xs text-neutral-500 mt-2">You need to sign in to view customer account details.</p>
        <Link
          to="/login"
          className="mt-6 px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const handleAddrPinChange = async (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    setAddrPin(cleaned)

    if (cleaned.length === 6) {
      const check = checkIndianPincode(cleaned)
      if (check.isServiceable) {
        setAddrCity(check.city)
        setAddrState(check.state)
      }
      try {
        const refined = await lookupPincode(cleaned)
        if (refined.isServiceable) {
          setAddrCity(refined.city)
          setAddrState(refined.state)
        }
      } catch {
        // Keep directory values
      }
    }
  }

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addrName || !addrPhone || !addrLine1 || !addrPin) return

    addAddress({
      fullName: addrName,
      phone: addrPhone,
      addressLine1: addrLine1,
      city: addrCity || 'Bengaluru',
      state: addrState || 'Karnataka',
      pincode: addrPin,
    })

    setShowAddAddr(false)
    setAddrName('')
    setAddrPhone('')
    setAddrLine1('')
    setAddrPin('')
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-8 border-b border-neutral-200 mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl text-neutral-900 mt-1">Hello, {user.name}</h1>
            <p className="text-xs text-neutral-500">{user.email} • {user.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-neutral-200 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'orders'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
              }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'addresses'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
              }`}
          >
            Saved Addresses ({addresses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'profile'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
              }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-neutral-200">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-neutral-800">No orders yet</h3>
                <p className="text-xs text-neutral-500 mt-1">Explore our collections and frame your first piece.</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block px-5 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-neutral-100 gap-2">
                    <div>
                      <span className="text-xs font-bold text-neutral-900">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-[11px] text-neutral-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                        {order.status}
                      </span>
                      <Link
                        to={`/track-order?order=${order.orderNumber}`}
                        className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Track
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-medium text-neutral-900">{item.title}</p>
                          <p className="text-[11px] text-neutral-500">
                            {item.customization.frameSize === 'A4' ? 'A4' : `${item.customization.frameSize}"`} • {item.customization.moulding} (x{item.quantity})
                          </p>
                        </div>
                        <span className="font-semibold text-neutral-900">
                          {formatINR(item.priceINR * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs">
                    <span className="text-neutral-500">
                      Payment: {order.paymentMethod === 'PREPAID_RAZORPAY' ? 'Razorpay Prepaid' : 'Cash on Delivery'}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">
                      Total: {formatINR(order.totalINR)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                Delivery Addresses
              </h2>
              <button
                type="button"
                onClick={() => setShowAddAddr(!showAddAddr)}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Address
              </button>
            </div>

            {showAddAddr && (
              <form onSubmit={handleCreateAddress} className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  New Shipping Destination
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="p-2.5 border border-neutral-300 rounded text-xs outline-none"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-Digit Mobile"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="p-2.5 border border-neutral-300 rounded text-xs outline-none"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="House No, Building & Street"
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded text-xs outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code"
                    value={addrPin}
                    onChange={(e) => handleAddrPinChange(e.target.value)}
                    className="p-2.5 border border-neutral-300 rounded text-xs outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="p-2.5 border border-neutral-300 rounded text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="p-2.5 border border-neutral-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddr(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-6 rounded-xl border border-neutral-200 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-neutral-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-xs text-neutral-600">{addr.addressLine2}</p>}
                    <p className="text-xs text-neutral-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">Mobile: {addr.phone}</p>
                  </div>

                  {addresses.length > 1 && addr.id && (
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id!)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-xl border border-neutral-200 max-w-lg space-y-4 text-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-4">
              Profile Overview
            </h2>
            <div>
              <span className="text-neutral-400 font-medium">Full Name</span>
              <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
            </div>
            <div>
              <span className="text-neutral-400 font-medium">Email Address</span>
              <p className="text-sm font-semibold text-neutral-900">{user.email}</p>
            </div>
            <div>
              <span className="text-neutral-400 font-medium">Registered Mobile</span>
              <p className="text-sm font-semibold text-neutral-900">{user.phone}</p>
            </div>
            <div>
              <span className="text-neutral-400 font-medium">Account Role</span>
              <p className="text-sm font-semibold text-neutral-900">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
