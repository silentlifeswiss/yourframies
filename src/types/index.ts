// ==============================================================================
// yourframies - Core TypeScript Domain Models
// ==============================================================================

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PRINTING'
  | 'FRAMING'
  | 'PACKAGED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RTO_INITIATED'
  | 'RTO_DELIVERED'

export type PaymentMethod = 'PREPAID_RAZORPAY' | 'COD' | 'PARTIAL_COD'
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
export type CourierPartner = 'DELHIVERY' | 'SHADOWFAX' | 'SHIPROCKET' | 'NIMBUSPOST' | 'MANUAL'

export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'CUSTOMER' | 'ADMIN'
  isPhoneVerified: boolean
  createdAt: string
}

export interface Address {
  id?: string
  userId?: string
  fullName: string
  phone: string
  alternatePhone?: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface FrameCustomization {
  photoUrl?: string
  frameSize: '8x10' | '12x18' | '16x24' | '20x30' | '24x36'
  moulding: 'Black Wood' | 'White Minimalist' | 'Natural Oak' | 'Walnut' | 'Gold Leaf'
  matColor?: 'None' | 'Pure White' | 'Off-White' | 'Jet Black'
  matWidthInches?: number
  glassType: 'Acrylic Glaze' | 'Anti-Glare UV Glass'
  orientation?: 'portrait' | 'landscape' | 'square'
}

export interface Product {
  id: string
  categoryId?: string
  title: string
  slug: string
  description: string
  basePriceINR: number
  compareAtPriceINR?: number
  images: string[]
  availableSizes: string[]
  availableMouldings: string[]
  isCustomizable: boolean
  isActive: boolean
  stockQuantity: number
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  customization: FrameCustomization
  priceINR: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  currency: 'INR'
  subtotalINR: number
  discountINR: number
  shippingFeeINR: number
  codChargeINR: number
  totalINR: number
  shippingAddress: Address
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId?: string
  title: string
  priceINR: number
  quantity: number
  customization: FrameCustomization
}

export interface Shipment {
  id: string
  orderId: string
  courierPartner: CourierPartner
  awbCode: string
  shipmentId?: string
  labelUrl?: string
  trackingUrl?: string
  status: string
  isCod: boolean
  codAmountINR?: number
  estimatedDelivery?: string
  deliveredAt?: string
}

export interface PincodeServiceability {
  pincode: string
  isServiceable: boolean
  isCodAvailable: boolean
  estimatedDays: number
  courierName: string
  city: string
  state: string
}
