import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem, FrameCustomization, Product } from '../types'
import { useAuth } from './AuthContext'
import { api } from '../services/api'

export interface Coupon {
  code: string
  discountPercent?: number
  discountAmountINR?: number
  minOrderINR: number
  description: string
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minOrderINR: 999,
    description: '10% off on your first order above ₹999',
  },
  {
    code: 'FRAMIES100',
    discountAmountINR: 100,
    minOrderINR: 1499,
    description: 'Flat ₹100 off on orders above ₹1,499',
  },
  {
    code: 'FREESHIP',
    discountAmountINR: 99,
    minOrderINR: 499,
    description: 'Free express shipping on all orders',
  },
]

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, customization: FrameCustomization, quantity?: number, customPrice?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  appliedCoupon: Coupon | null
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  subtotalINR: number
  discountINR: number
  shippingFeeINR: number
  codChargeINR: number
  totalINR: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'yourframies_cart'
const COUPON_STORAGE_KEY = 'yourframies_coupon'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  // Hydrate & synchronize remote database cart when customer logs in
  useEffect(() => {
    const customerId = user?.id || user?.phone
    if (!customerId) return

    let isMounted = true
    api
      .getCart(customerId)
      .then((res) => {
        if (!isMounted || !res.success || !res.data) return
        if (Array.isArray(res.data.items) && res.data.items.length > 0) {
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id))
            const incoming = res.data.items.filter((i: any) => !existingIds.has(i.id))
            return [...prev, ...incoming]
          })
          if (res.data.coupon && !appliedCoupon) {
            setAppliedCoupon(res.data.coupon)
          }
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [user?.id, user?.phone])

  // Save cart to local storage and sync with PostgreSQL database for logged-in customer
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore storage errors
    }

    const customerId = user?.id || user?.phone
    if (customerId) {
      const timer = setTimeout(() => {
        api.saveCart(customerId, items, appliedCoupon).catch(() => {})
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [items, appliedCoupon, user?.id, user?.phone])

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY)
      }
    } catch {
      // Ignore
    }
  }, [appliedCoupon])

  const addToCart = (
    product: Product,
    customization: FrameCustomization,
    quantity: number = 1,
    customPrice?: number
  ) => {
    // Calculate price additions based on size/glass if customPrice not supplied
    let base = customPrice !== undefined ? customPrice : product.basePriceINR
    if (!customPrice) {
      if (customization.frameSize === '12x18') base += 300
      if (customization.frameSize === '16x24') base += 700
      if (customization.frameSize === '20x30') base += 1200
      if (customization.frameSize === '24x36') base += 1800
      if (customization.glassType === 'Anti-Glare UV Glass') base += 350
    }

    const newItemId = `${product.id}-${customization.frameSize}-${customization.moulding}-${customization.matColor || 'None'}-${customization.glassType}-${Date.now()}`

    const newItem: CartItem = {
      id: newItemId,
      productId: product.id,
      product,
      customization,
      priceINR: base,
      quantity,
    }

    setItems((prev) => [...prev, newItem])
    setIsCartOpen(true)
  }

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    const customerId = user?.id || user?.phone
    if (customerId) {
      api.clearCart(customerId).catch(() => {})
    }
  }

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    const found = AVAILABLE_COUPONS.find((c) => c.code === clean)
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try WELCOME10 or FRAMIES100' }
    }
    if (subtotalINR < found.minOrderINR) {
      return {
        success: false,
        message: `Coupon requires a minimum order of ₹${found.minOrderINR}`,
      }
    }
    setAppliedCoupon(found)
    return { success: true, message: `Coupon ${found.code} applied successfully!` }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const subtotalINR = items.reduce((sum, item) => sum + item.priceINR * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  let discountINR = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountINR = Math.round((subtotalINR * appliedCoupon.discountPercent) / 100)
    } else if (appliedCoupon.discountAmountINR) {
      discountINR = appliedCoupon.discountAmountINR
    }
  }

  // Free shipping on orders over ₹999 or when FREESHIP is used
  const shippingFeeINR = subtotalINR >= 999 || appliedCoupon?.code === 'FREESHIP' || items.length === 0 ? 0 : 99
  const codChargeINR = 50 // Standard handling fee if COD chosen
  const totalINR = Math.max(0, subtotalINR - discountINR + shippingFeeINR)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        subtotalINR,
        discountINR,
        shippingFeeINR,
        codChargeINR,
        totalINR,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
