import { z } from 'zod'

// ==============================================================================
// Enums & Literals
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
export type AdminRole = 'SUPER_ADMIN' | 'MANAGER' | 'SUPPORT'

// ==============================================================================
// Zod Validation Schemas
// ==============================================================================

// Shipping Address Schema
export const AddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  alternatePhone: z.string().optional(),
  addressLine1: z.string().min(1, 'Address is required').max(255),
  addressLine2: z.string().max(255).optional(),
  landmark: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit PIN code'),
})

// Frame Customization Schema
export const FrameCustomizationSchema = z.object({
  photoUrl: z.string().optional(),
  frameSize: z.string().optional(),
  moulding: z.string().optional(),
  matColor: z.string().optional(),
  matWidthInches: z.number().optional(),
  glassType: z.string().optional(),
  orientation: z.string().optional(),
}).passthrough()

// Order Item Schema
export const OrderItemSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1),
  priceINR: z.number().positive(),
  quantity: z.number().int().positive(),
  customization: FrameCustomizationSchema.optional(),
})

// Create Order Request Schema
export const CreateOrderRequestSchema = z.object({
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['PREPAID_RAZORPAY', 'COD', 'PARTIAL_COD']),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
})

// Product Schema
export const ProductSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().optional(),
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  description: z.string().max(2000).default(''),
  basePriceINR: z.number().positive(),
  compareAtPriceINR: z.number().nonnegative().optional().nullable(),
  images: z.array(z.string().min(1)).min(1, 'At least one image is required'),
  availableSizes: z.array(z.string()).default(['A4']),
  availableMouldings: z.array(z.string()).default(['Deep Black', 'Minimalist White']),
  isCustomizable: z.boolean().default(true),
  isActive: z.boolean().default(true),
  stockQuantity: z.number().int().nonnegative().default(25),
})

// Category Schema
export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

// Admin Login Schema
export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  twoFactorCode: z.string().optional(),
})

// PIN code Check Schema
export const PincodeCheckSchema = z.object({
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid 6-digit Indian PIN code'),
  weightGrams: z.number().positive().default(1000),
  isCod: z.boolean().default(false),
})

// Razorpay Order Creation Schema
export const RazorpayCreateOrderSchema = z.object({
  amountINR: z.number().positive(),
  receipt: z.string().optional(),
  orderNumber: z.string().optional(),
})

// Razorpay Payment Verification Schema
export const RazorpayVerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderNumber: z.string().optional(),
})

// Refund Request Schema
export const RefundRequestSchema = z.object({
  paymentId: z.string().min(1),
  amountINR: z.number().positive(),
  reason: z.string().min(3),
})

// ==============================================================================
// Database Entity Types
// ==============================================================================

export interface DBProduct {
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
  createdAt: string
  updatedAt: string
}

export interface DBCategory {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  displayOrder: number
  isActive: boolean
}

export interface DBOrder {
  id: string
  orderNumber: string
  userId?: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  currency: string
  subtotalINR: number
  discountINR: number
  shippingFeeINR: number
  codChargeINR: number
  totalINR: number
  shippingAddress: z.infer<typeof AddressSchema>
  items: Array<{
    id: string
    orderId: string
    productId?: string
    title: string
    priceINR: number
    quantity: number
    customization?: z.infer<typeof FrameCustomizationSchema>
  }>
  notes?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  awbCode?: string
  courierPartner?: CourierPartner
  trackingUrl?: string
  createdAt: string
  updatedAt: string
}

export interface DBAdminUser {
  id: string
  email: string
  passwordHash: string
  name: string
  role: AdminRole
  isActive: boolean
  twoFactorEnabled: boolean
  failedAttempts: number
  lockedUntil?: string
  lastLoginAt?: string
  createdAt: string
}

export interface DBSiteSettings {
  brandName: string
  tagline: string
  logoText: string
  announcementText: string
  announcementActive: boolean
  contactEmail: string
  contactPhone: string
  workshopAddress: string
  instagramHandle: string
  whatsappNumber: string
  accentColor: string
  currencySymbol: string
  freeShippingThreshold: number
  codHandlingFee: number
  maintenanceMode: boolean
  updatedAt: string
}

export interface DBHomepageSection {
  id: string
  type: string
  title: string
  subtitle?: string
  isActive: boolean
  backgroundStyle: string
  order: number
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
  badgeText?: string
  customContent?: string
}

export interface DBAuditLog {
  id: string
  adminId: string
  adminEmail: string
  adminName: string
  action: string
  entityType: string
  entityId?: string
  details?: string
  ipAddress?: string
  timestamp: string
}
