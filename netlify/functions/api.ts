import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import { db } from './lib/db.ts'
import {
  authenticateAdmin,
  checkRateLimitAndLogin,
  hashPassword,
  sendMobileOtp,
  verifyMobileOtp,
} from './lib/auth.ts'
import { payments } from './lib/payments.ts'
import { shipping } from './lib/shipping.ts'
import {
  CreateOrderRequestSchema,
  ProductSchema,
  AdminLoginSchema,
  PincodeCheckSchema,
  RazorpayCreateOrderSchema,
  RazorpayVerifyPaymentSchema,
  RefundRequestSchema,
  DBOrder,
  DBProduct,
} from './lib/types.ts'

// Helper for CORS & JSON response
const makeResponse = (statusCode: number, data: any) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  },
  body: JSON.stringify(data),
})

export const handler: Handler = async (event: HandlerEvent, _context?: HandlerContext) => {
  // Normalize path by stripping Netlify / function prefixes
  const rawPath = event.path
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '')
  const path = rawPath === '' ? '/' : rawPath
  const method = event.httpMethod.toUpperCase()
  const clientIp =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    '127.0.0.1'

  // Pre-flight CORS
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    }
  }

  try {
    // ==========================================================================
    // 1. Health & Environment Status
    // ==========================================================================
    if (path === '/health' && method === 'GET') {
      await db.ensureConnected()
      return makeResponse(200, {
        status: 'ok',
        success: true,
        brand: 'Your Framies',
        currency: 'INR',
        service: 'Your Framies API',
        timestamp: new Date().toISOString(),
        database: db.getConnectionDiagnostics(),
        integrations: {
          razorpay: {
            configured: payments.isRazorpayConfigured(),
            mode: payments.isRazorpayConfigured() ? 'Live / Active API' : 'Sandbox Simulated Mode',
          },
          couriers: shipping.getConnectedCouriers(),
        },
      })
    }

    // ==========================================================================
    // 2. Products & Catalog Endpoints
    // ==========================================================================
    if (path === '/products' && method === 'GET') {
      const allProducts = await db.getProducts()
      const categoryParam = event.queryStringParameters?.category

      const filtered = categoryParam
        ? allProducts.filter((p: any) => p.categoryId === categoryParam)
        : allProducts

      return makeResponse(200, {
        success: true,
        count: filtered.length,
        data: filtered,
      })
    }

    // Single Product GET /products/:slug
    if (path.startsWith('/products/') && method === 'GET') {
      const slug = path.replace('/products/', '')
      const product = await db.getProductBySlug(slug)

      if (!product) {
        return makeResponse(404, { success: false, message: 'Product not found' })
      }
      return makeResponse(200, { success: true, data: product })
    }

    // Categories GET /categories
    if (path === '/categories' && method === 'GET') {
      const categories = await db.getCategories()
      return makeResponse(200, { success: true, count: categories.length, data: categories })
    }

    // Admin: Create Product POST /admin/products
    if (path === '/admin/products' && method === 'POST') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const body = JSON.parse(event.body || '{}')
      const validation = ProductSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const pData = validation.data
      const newProduct: DBProduct = {
        id: pData.id || `yf-${Date.now()}`,
        categoryId: pData.categoryId,
        title: pData.title,
        slug: pData.slug,
        description: pData.description,
        basePriceINR: pData.basePriceINR,
        compareAtPriceINR: pData.compareAtPriceINR,
        images: pData.images,
        availableSizes: pData.availableSizes,
        availableMouldings: pData.availableMouldings,
        isCustomizable: pData.isCustomizable,
        isActive: pData.isActive,
        stockQuantity: pData.stockQuantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const saved = await db.saveProduct(newProduct)
      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'PRODUCT_CREATED',
        entityType: 'PRODUCT',
        entityId: saved.id,
        details: `Created artwork "${saved.title}" (₹${saved.basePriceINR})`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(201, { success: true, data: saved })
    }

    // Admin: Update Product PUT /admin/products/:id
    if (path.startsWith('/admin/products/') && method === 'PUT') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const id = path.replace('/admin/products/', '')
      const body = JSON.parse(event.body || '{}')
      const existing = await db.getProductBySlug(id)

      if (!existing) {
        return makeResponse(404, { success: false, message: 'Product not found' })
      }

      const updatedProduct: DBProduct = {
        ...existing,
        ...body,
        id: existing.id,
        updatedAt: new Date().toISOString(),
      }

      const saved = await db.saveProduct(updatedProduct)
      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'PRODUCT_UPDATED',
        entityType: 'PRODUCT',
        entityId: saved.id,
        details: `Updated artwork "${saved.title}"`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, data: saved })
    }

    // Admin: Delete Product DELETE /admin/products/:id
    if (path.startsWith('/admin/products/') && method === 'DELETE') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const id = path.replace('/admin/products/', '')
      const deleted = await db.deleteProduct(id)

      if (!deleted) {
        return makeResponse(404, { success: false, message: 'Product not found' })
      }

      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'PRODUCT_DELETED',
        entityType: 'PRODUCT',
        entityId: id,
        details: `Deleted product ID ${id}`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, message: 'Product deleted' })
    }

    // ==========================================================================
    // 3. Homepage & Visual CMS Settings Endpoints
    // ==========================================================================
    if (path === '/homepage' && method === 'GET') {
      const sections = await db.getHomepageSections()
      const settings = await db.getSettings()
      return makeResponse(200, { success: true, data: { sections, settings } })
    }

    if (path === '/settings' && method === 'GET') {
      const settings = await db.getSettings()
      return makeResponse(200, { success: true, data: settings })
    }

    if (path === '/admin/homepage/draft' && method === 'GET') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const sections = await db.getDraftHomepageSections()
      const settings = await db.getSettings()
      return makeResponse(200, { success: true, data: { sections, settings } })
    }

    if (path === '/admin/homepage/sections' && method === 'PUT') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const { sections } = JSON.parse(event.body || '{}')
      if (!Array.isArray(sections)) {
        return makeResponse(400, { success: false, message: 'Sections array required' })
      }

      await db.updateDraftHomepageSections(sections)
      return makeResponse(200, { success: true, message: 'Draft sections updated' })
    }

    if (path === '/admin/homepage/publish' && method === 'POST') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      await db.publishDraftHomepage()
      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'HOMEPAGE_PUBLISHED',
        entityType: 'HOMEPAGE',
        details: 'Published visual homepage drafts to live storefront',
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, message: 'Homepage changes are now live!' })
    }

    if (path === '/admin/settings' && method === 'PUT') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const body = JSON.parse(event.body || '{}')
      const updated = await db.updateSettings(body)

      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'SETTINGS_UPDATED',
        entityType: 'SITE_SETTINGS',
        details: `Updated store brand name: "${updated.brandName}"`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, data: updated })
    }

    // ==========================================================================
    // 4. Orders & Checkout Endpoints
    // ==========================================================================
    if (path === '/orders' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const validation = CreateOrderRequestSchema.safeParse(body)
      if (!validation.success) {
        const errorDetails = validation.error.issues
          .map((e: any) => `${e.path.join('.') || 'field'}: ${e.message}`)
          .join(', ')
        console.warn('Order validation failed:', errorDetails)
        return makeResponse(400, {
          success: false,
          message: `Please review order details: ${errorDetails}`,
          errors: validation.error.format(),
        })
      }

      const { items, shippingAddress, paymentMethod, notes, couponCode } = validation.data

      // Server-Side PIN Serviceability Verification
      const pinCheck = await shipping.checkPincode(shippingAddress.pincode, paymentMethod === 'COD')
      if (!pinCheck.isServiceable) {
        return makeResponse(400, {
          success: false,
          message: `The entered PIN code (${shippingAddress.pincode}) is currently unserviceable by our courier partners. Please check your 6-digit PIN code.`,
        })
      }

      // Auto-fill city and state from PIN check if not provided
      if (!shippingAddress.city || shippingAddress.city.trim() === '') {
        shippingAddress.city = pinCheck.city || 'Metro Area'
      }
      if (!shippingAddress.state || shippingAddress.state.trim() === '') {
        shippingAddress.state = pinCheck.state || 'India'
      }

      // Server-Side Price Verification (NEVER trust frontend price totals!)
      let subtotalINR = 0
      const validatedItems = []

      for (const item of items) {
        // Look up true base price
        const catalogProduct = item.productId ? await db.getProductBySlug(item.productId) : null
        const verifiedBasePrice = catalogProduct ? catalogProduct.basePriceINR : item.priceINR

        let sizeAddon = 0
        if (item.customization?.frameSize === '12x18') sizeAddon = 300
        if (item.customization?.frameSize === '16x24') sizeAddon = 700
        if (item.customization?.frameSize === '20x30') sizeAddon = 1200
        if (item.customization?.frameSize === '24x36') sizeAddon = 1800

        const glassAddon = item.customization?.glassType === 'Anti-Glare UV Glass' ? 350 : 0
        const itemUnitPrice = verifiedBasePrice + sizeAddon + glassAddon

        subtotalINR += itemUnitPrice * item.quantity

        validatedItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          orderId: '',
          productId: item.productId,
          title: item.title,
          priceINR: itemUnitPrice,
          quantity: item.quantity,
          customization: item.customization,
        })
      }

      // Discount calculation (e.g. WELCOME10 for 10% off)
      let discountINR = 0
      if (couponCode && couponCode.toUpperCase() === 'WELCOME10') {
        discountINR = Math.round(subtotalINR * 0.1)
      }

      // Shipping rate calculation
      const rateCalc = shipping.calculateShippingRate(
        validatedItems.map((i) => ({ frameSize: i.customization?.frameSize, quantity: i.quantity })),
        subtotalINR,
        shippingAddress.pincode
      )
      const shippingFeeINR = rateCalc.shippingFeeINR

      // COD Handling validation
      let codChargeINR = 0
      if (paymentMethod === 'COD') {
        const codCheck = payments.validateCodEligibility(shippingAddress.pincode, subtotalINR)
        if (!codCheck.eligible) {
          return makeResponse(400, { success: false, message: codCheck.message })
        }
        codChargeINR = codCheck.feeINR
      }

      const totalINR = subtotalINR - discountINR + shippingFeeINR + codChargeINR
      const orderNumber = `YF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

      const newOrder: DBOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        status: 'CONFIRMED',
        paymentMethod,
        paymentStatus: paymentMethod === 'PREPAID_RAZORPAY' ? 'PENDING' : 'PENDING',
        currency: 'INR',
        subtotalINR,
        discountINR,
        shippingFeeINR,
        codChargeINR,
        totalINR,
        shippingAddress,
        items: validatedItems,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const savedOrder = await db.createOrder(newOrder)
      return makeResponse(201, { success: true, data: savedOrder })
    }

    // Public: Track Order GET /orders/:orderNumber
    if (path.startsWith('/orders/') && method === 'GET') {
      const orderNumber = path.replace('/orders/', '')
      const order = await db.getOrderByNumber(orderNumber)

      if (!order) {
        return makeResponse(404, { success: false, message: 'Order not found' })
      }
      return makeResponse(200, { success: true, data: order })
    }

    // Admin: List Orders GET /admin/orders
    if (path === '/admin/orders' && method === 'GET') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER', 'SUPPORT'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const orders = await db.getOrders()
      return makeResponse(200, { success: true, count: orders.length, data: orders })
    }

    // Admin: Update Order Status PUT /admin/orders/:orderNumber/status
    if (path.startsWith('/admin/orders/') && path.endsWith('/status') && method === 'PUT') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const orderNumber = path.replace('/admin/orders/', '').replace('/status', '')
      const { status, awbCode, courierPartner, paymentStatus } = JSON.parse(event.body || '{}')

      const updated = await db.updateOrderStatus(orderNumber, status, {
        awbCode,
        courierPartner,
        paymentStatus,
      })

      if (!updated) {
        return makeResponse(404, { success: false, message: 'Order not found' })
      }

      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'ORDER_STATUS_CHANGED',
        entityType: 'ORDER',
        entityId: orderNumber,
        details: `Changed order status to ${status}${awbCode ? ` (AWB: ${awbCode})` : ''}`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, data: updated })
    }

    // ==========================================================================
    // 5. Payments & Razorpay Endpoints
    // ==========================================================================
    if (path === '/payments/razorpay/create-order' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const validation = RazorpayCreateOrderSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const { amountINR, receipt, orderNumber } = validation.data
      const rzpResult = await payments.createRazorpayOrder(amountINR, receipt || `rcpt_${Date.now()}`, {
        orderNumber: orderNumber || '',
      })

      if (!rzpResult.success) {
        return makeResponse(400, { success: false, message: rzpResult.message })
      }

      return makeResponse(200, {
        success: true,
        data: rzpResult.data,
        keyId: payments.getKeyId(),
      })
    }

    if (path === '/payments/razorpay/verify' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const validation = RazorpayVerifyPaymentSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } =
        validation.data

      const verifyResult = payments.verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )

      if (!verifyResult.isValid) {
        return makeResponse(400, {
          success: false,
          verified: false,
          message: 'Cryptographic signature verification failed: payment untrusted',
        })
      }

      // Update Order Payment Status in database
      if (orderNumber) {
        await db.updateOrderStatus(orderNumber, 'CONFIRMED', { paymentStatus: 'CAPTURED' })
      }

      return makeResponse(200, {
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
      })
    }

    // Admin: Process Refund POST /admin/payments/refund
    if (path === '/admin/payments/refund' && method === 'POST') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const body = JSON.parse(event.body || '{}')
      const validation = RefundRequestSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const { paymentId, amountINR, reason } = validation.data
      const refundResult = await payments.processRefund(paymentId, amountINR, reason)

      if (!refundResult.success) {
        return makeResponse(400, { success: false, message: refundResult.message })
      }

      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'REFUND_PROCESSED',
        entityType: 'PAYMENT',
        entityId: paymentId,
        details: `Issued refund of ₹${amountINR}. Reason: ${reason}`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, data: refundResult.data })
    }

    // ==========================================================================
    // 6. Shipping & Logistics Endpoints
    // ==========================================================================
    if (path === '/shipping/check-pincode' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const validation = PincodeCheckSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const { pincode, isCod } = validation.data
      const result = await shipping.checkPincode(pincode, isCod)
      return makeResponse(200, { success: true, data: result })
    }

    if (path === '/shipping/calculate-rates' && method === 'POST') {
      const { items, subtotalINR, pincode } = JSON.parse(event.body || '{}')
      const rates = shipping.calculateShippingRate(items || [], subtotalINR || 0, pincode || '560001')
      return makeResponse(200, { success: true, data: rates })
    }

    // Admin: Book Courier Shipment POST /admin/shipping/book-shipment
    if (path === '/admin/shipping/book-shipment' && method === 'POST') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const { orderNumber } = JSON.parse(event.body || '{}')
      const order = await db.getOrderByNumber(orderNumber)
      if (!order) {
        return makeResponse(404, { success: false, message: 'Order not found' })
      }

      const booking = await shipping.bookShipment({
        orderNumber: order.orderNumber,
        shippingAddress: order.shippingAddress,
        totalINR: order.totalINR,
        isCod: order.paymentMethod === 'COD',
        items: order.items.map((i: any) => ({ title: i.title, quantity: i.quantity })),
      })

      // Update order with AWB and status
      await db.updateOrderStatus(order.orderNumber, 'SHIPPED', {
        awbCode: booking.awbCode,
        courierPartner: booking.courierPartner,
      })

      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'SHIPMENT_BOOKED',
        entityType: 'SHIPPING',
        entityId: order.orderNumber,
        details: `Generated ${booking.courierPartner} AWB: ${booking.awbCode}`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(200, { success: true, data: booking })
    }

    // Public: Track Courier AWB GET /shipping/track/:awb
    if (path.startsWith('/shipping/track/') && method === 'GET') {
      const awb = path.replace('/shipping/track/', '')
      const tracking = await shipping.getTrackingEvents(awb)
      return makeResponse(200, { success: true, data: tracking })
    }

    // ==========================================================================
    // 6b. Customer Mobile OTP Authentication & Verification Endpoints
    // ==========================================================================
    if (path === '/auth/send-otp' && method === 'POST') {
      const { phone, purpose } = JSON.parse(event.body || '{}')
      if (!phone) {
        return makeResponse(400, { success: false, message: 'Mobile number is required' })
      }

      const result = await sendMobileOtp(phone, purpose || 'login')
      return makeResponse(result.success ? 200 : 400, result)
    }

    if (path === '/auth/verify-otp' && method === 'POST') {
      const { phone, otp, name, email, purpose } = JSON.parse(event.body || '{}')
      if (!phone || !otp) {
        return makeResponse(400, { success: false, message: 'Phone and 6-digit OTP code are required' })
      }

      const result = await verifyMobileOtp(phone, otp, { name, email, purpose })
      return makeResponse(result.success ? 200 : 400, result)
    }

    if (path === '/auth/register' && method === 'POST') {
      const { phone, otp, name, email } = JSON.parse(event.body || '{}')
      if (!phone || !otp) {
        return makeResponse(400, { success: false, message: 'Mobile OTP verification is required to register.' })
      }

      const result = await verifyMobileOtp(phone, otp, { name, email, purpose: 'register' })
      return makeResponse(result.success ? 200 : 400, result)
    }

    if (path === '/auth/login' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      if (body.phone && body.otp) {
        const result = await verifyMobileOtp(body.phone, body.otp, { purpose: 'login' })
        return makeResponse(result.success ? 200 : 400, result)
      }

      // Email/password login
      if (body.email && body.password) {
        const result = await checkRateLimitAndLogin(body.email, body.password, clientIp)
        if (!result.success) {
          return makeResponse(401, { success: false, message: result.message })
        }
        return makeResponse(200, {
          success: true,
          token: result.token,
          user: {
            id: result.user!.id,
            name: result.user!.name,
            email: result.user!.email,
            phone: '9999999999',
            role: result.user!.role === 'SUPER_ADMIN' ? 'ADMIN' : 'CUSTOMER',
            isPhoneVerified: true,
          },
        })
      }

      return makeResponse(400, { success: false, message: 'Mobile number & OTP or Email & Password required.' })
    }

    // ==========================================================================
    // 7. Admin Authentication & Role Management Endpoints
    // ==========================================================================
    if (path === '/admin/login' && method === 'POST') {
      const body = JSON.parse(event.body || '{}')
      const validation = AdminLoginSchema.safeParse(body)
      if (!validation.success) {
        return makeResponse(400, { success: false, errors: validation.error.format() })
      }

      const { email, password } = validation.data
      const result = await checkRateLimitAndLogin(email, password, clientIp)

      if (!result.success) {
        return makeResponse(401, {
          success: false,
          message: result.message,
          lockoutSeconds: result.lockoutSeconds,
        })
      }

      return makeResponse(200, {
        success: true,
        token: result.token,
        admin: {
          id: result.user!.id,
          name: result.user!.name,
          email: result.user!.email,
          role: result.user!.role,
        },
      })
    }

    // Admin: GET /admin/me
    if (path === '/admin/me' && method === 'GET') {
      const auth = await authenticateAdmin(event)
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      return makeResponse(200, {
        success: true,
        admin: {
          id: auth.user!.id,
          name: auth.user!.name,
          email: auth.user!.email,
          role: auth.user!.role,
        },
      })
    }

    // Admin: List Admins GET /admin/users
    if (path === '/admin/users' && method === 'GET') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const users = await db.getAllAdmins()
      return makeResponse(200, {
        success: true,
        data: users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive,
          twoFactorEnabled: u.twoFactorEnabled,
          lastLoginAt: u.lastLoginAt,
          createdAt: u.createdAt,
        })),
      })
    }

    // Admin: Create Admin POST /admin/users (No public admin registration!)
    if (path === '/admin/users' && method === 'POST') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const { name, email, role, password } = JSON.parse(event.body || '{}')
      if (!name || !email || !password || password.length < 8) {
        return makeResponse(400, {
          success: false,
          message: 'Valid name, email, and password (min 8 characters) required.',
        })
      }

      const existing = await db.getAdminByEmail(email)
      if (existing) {
        return makeResponse(400, { success: false, message: 'Administrator email already exists' })
      }

      const newUser = {
        id: `adm-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: (role as any) || 'MANAGER',
        passwordHash: hashPassword(password),
        isActive: true,
        twoFactorEnabled: false,
        failedAttempts: 0,
        createdAt: new Date().toISOString(),
      }

      await db.saveAdminUser(newUser)
      await db.saveAuditLog({
        id: `log-${Date.now()}`,
        adminId: auth.user!.id,
        adminEmail: auth.user!.email,
        adminName: auth.user!.name,
        action: 'ADMIN_INVITED',
        entityType: 'ADMIN_USER',
        entityId: newUser.id,
        details: `Invited new administrator "${newUser.name}" with role ${newUser.role}`,
        ipAddress: clientIp,
        timestamp: new Date().toISOString(),
      })

      return makeResponse(201, {
        success: true,
        data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      })
    }

    // Admin: GET /admin/audit-logs
    if (path === '/admin/audit-logs' && method === 'GET') {
      const auth = await authenticateAdmin(event, ['SUPER_ADMIN', 'MANAGER'])
      if (auth.error) return makeResponse(auth.status || 401, { success: false, message: auth.error })

      const logs = await db.getAuditLogs()
      return makeResponse(200, { success: true, count: logs.length, data: logs })
    }

    // Default 404
    return makeResponse(404, {
      success: false,
      message: `Backend API route not found: [${method}] ${path}`,
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return makeResponse(500, {
      success: false,
      error: error.message || 'Internal Server Error',
    })
  }
}
