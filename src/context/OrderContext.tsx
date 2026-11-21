import React, { createContext, useContext, useState, useEffect } from 'react'
import { Order, OrderStatus } from '../types'
import { api } from '../services/api'

interface OrderContextType {
  orders: Order[]
  createOrder: (order: Partial<Order> & Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order
  getOrderById: (idOrNumber: string) => Order | undefined
  updateOrderStatus: (orderNumber: string, status: OrderStatus, awbCode?: string, courier?: string) => void
  userOrders: (userId?: string) => Order[]
  refreshCustomerOrders: (identifier: string) => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = 'yourframies_orders'

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Clean out any legacy demo orders from cache
        const cleaned = parsed.filter(
          (o: Order) =>
            o.id !== 'ord-1001' &&
            o.id !== 'ord-1002' &&
            o.orderNumber !== 'YF-2026-1042' &&
            o.orderNumber !== 'YF-2026-1043'
        )
        return cleaned
      }
      return []
    } catch {
      return []
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

  const createOrder = (
    orderData: Partial<Order> & Omit<Order, 'id' | 'orderNumber' | 'createdAt'>
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newOrder: Order = {
      ...orderData,
      id: orderData.id || `ord-${Date.now()}`,
      orderNumber: orderData.orderNumber || `YF-2026-${randomSuffix}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
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

  const refreshCustomerOrders = async (identifier: string) => {
    const clean = identifier.trim()
    if (!clean) return
    try {
      const res = await api.getCustomerOrders({ phone: clean, userId: clean })
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setOrders((prev) => {
          const map = new Map<string, Order>()
          res.data.forEach((o: Order) => map.set(o.orderNumber, o))
          prev.forEach((o) => {
            if (!map.has(o.orderNumber)) map.set(o.orderNumber, o)
          })
          return Array.from(map.values())
        })
      }
    } catch {
      // Fallback
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        userOrders,
        refreshCustomerOrders,
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
