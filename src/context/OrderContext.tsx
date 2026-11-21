import React, { createContext, useContext, useState, useEffect } from 'react'
import { Order, OrderStatus } from '../types'
import { api } from '../services/api'

interface OrderContextType {
  orders: Order[]
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order
  getOrderById: (idOrNumber: string) => Order | undefined
  updateOrderStatus: (orderNumber: string, status: OrderStatus, awbCode?: string, courier?: string) => void
  userOrders: (userId?: string) => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = 'yourframies_orders'

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'YF-2026-1042',
    status: 'SHIPPED',
    paymentMethod: 'PREPAID_RAZORPAY',
    paymentStatus: 'CAPTURED',
    currency: 'INR',
    subtotalINR: 1499,
    discountINR: 150,
    shippingFeeINR: 0,
    codChargeINR: 0,
    totalINR: 1349,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      fullName: 'Vikramaditya S.',
      phone: '9876543210',
      addressLine1: 'Flat 302, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1001',
        title: 'Porsche 911 GT3 RS Neon Night Frame',
        priceINR: 1499,
        quantity: 1,
        customization: {
          frameSize: '12x18',
          moulding: 'Black Wood',
          glassType: 'Acrylic Glaze',
        },
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'YF-2026-1043',
    status: 'CONFIRMED',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    currency: 'INR',
    subtotalINR: 1999,
    discountINR: 0,
    shippingFeeINR: 0,
    codChargeINR: 50,
    totalINR: 2049,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    shippingAddress: {
      fullName: 'Ananya Mehta',
      phone: '9812345678',
      addressLine1: 'B-12, Green Acres, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
    },
    items: [
      {
        id: 'item-2',
        orderId: 'ord-1002',
        title: 'The Memories Collage • 9-Photo Storyboard',
        priceINR: 1999,
        quantity: 1,
        customization: {
          frameSize: '16x24',
          moulding: 'Natural Oak',
          glassType: 'Anti-Glare UV Glass',
        },
      },
    ],
  },
]

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_DEMO_ORDERS
    } catch {
      return INITIAL_DEMO_ORDERS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch {
      // Ignore
    }
  }, [orders])

  // Sync with backend if admin token is present
  useEffect(() => {
    const syncBackendOrders = async () => {
      try {
        const token = sessionStorage.getItem('yourframies_admin_jwt')
        if (token) {
          const res = await api.adminGetOrders()
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setOrders(res.data)
          }
        }
      } catch {
        // Fallback to local
      }
    }
    syncBackendOrders()
  }, [])

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `YF-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }

  const getOrderById = (idOrNumber: string): Order | undefined => {
    const clean = idOrNumber.trim().toUpperCase()
    return orders.find(
      (o) => o.id.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean
    )
  }

  const updateOrderStatus = (
    orderNumber: string,
    status: OrderStatus,
    awbCode?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) {
          return {
            ...o,
            status,
          }
        }
        return o
      })
    )

    // Sync with backend
    try {
      api.adminUpdateOrderStatus(orderNumber, status, {
        awbCode,
        courierPartner: courier,
      }).catch(() => {})
    } catch {
      // Ignore
    }
  }

  const userOrders = (userId?: string) => {
    if (!userId) return orders
    return orders.filter((o) => o.userId === userId)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        userOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrders must be used within an OrderProvider')
  return context
}
