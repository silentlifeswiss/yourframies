import { describe, it, expect } from 'vitest'
import { handler } from '../../netlify/functions/api.ts'
import type { HandlerEvent } from '@netlify/functions'

function createEvent(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): HandlerEvent {
  return {
    rawUrl: `http://localhost:5173${path}`,
    rawQuery: '',
    path,
    httpMethod: method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: body ? JSON.stringify(body) : null,
    isBase64Encoded: false,
  }
}

describe('Your Framies - Backend Serverless Architecture & APIs', () => {
  // --------------------------------------------------------------------------
  // 1. Health Endpoint
  // --------------------------------------------------------------------------
  it('GET /health returns healthy status and system diagnostics', async () => {
    const event = createEvent('/health')
    const response: any = await handler(event, {} as any)
    expect(response.statusCode).toBe(200)

    const payload = JSON.parse(response.body)
    expect(payload.status).toBe('ok')
    expect(payload.brand).toBe('Your Framies')
    expect(payload.currency).toBe('INR')
  })

  // --------------------------------------------------------------------------
  // 2. Product & Category Management
  // --------------------------------------------------------------------------
  it('GET /products returns seeded catalog items', async () => {
    const event = createEvent('/products')
    const response: any = await handler(event, {} as any)
    expect(response.statusCode).toBe(200)

    const payload = JSON.parse(response.body)
    expect(payload.success).toBe(true)
    expect(Array.isArray(payload.data)).toBe(true)
    expect(payload.data.length).toBeGreaterThan(0)

    const sample = payload.data[0]
    expect(sample).toHaveProperty('title')
    expect(sample).toHaveProperty('slug')
    expect(sample).toHaveProperty('basePriceINR')
  })

  it('GET /categories returns valid catalog categories', async () => {
    const event = createEvent('/categories')
    const response: any = await handler(event, {} as any)
    expect(response.statusCode).toBe(200)

    const payload = JSON.parse(response.body)
    expect(payload.success).toBe(true)
    expect(payload.data.length).toBeGreaterThan(0)
  })

  it('GET /products/:slug fetches single product or returns 404 for unknown slug', async () => {
    const validEvent = createEvent('/products/porsche-911-gt3-rs-neon-night-frame')
    const validRes: any = await handler(validEvent, {} as any)
    expect(validRes.statusCode).toBe(200)

    const notFoundEvent = createEvent('/products/non-existent-frame-12345')
    const notFoundRes: any = await handler(notFoundEvent, {} as any)
    expect(notFoundRes.statusCode).toBe(404)
  })

  // --------------------------------------------------------------------------
  // 3. Logistics & PIN Serviceability Verification
  // --------------------------------------------------------------------------
  it('POST /shipping/check-pincode verifies serviceable and unserviceable Indian PINs', async () => {
    // Valid Bengaluru PIN
    const validPinEvent = createEvent('/shipping/check-pincode', 'POST', {
      pincode: '560001',
      isCod: false,
    })
    const validRes: any = await handler(validPinEvent, {} as any)
    expect(validRes.statusCode).toBe(200)
    const validData = JSON.parse(validRes.body).data
    expect(validData.isServiceable).toBe(true)
    expect(validData.state).toBe('Karnataka')

    // Invalid PIN
    const invalidPinEvent = createEvent('/shipping/check-pincode', 'POST', {
      pincode: '999999',
      isCod: false,
    })
    const invalidRes: any = await handler(invalidPinEvent, {} as any)
    expect(invalidRes.statusCode).toBe(200)
    const invalidData = JSON.parse(invalidRes.body).data
    expect(invalidData.isServiceable).toBe(false)
  })

  it('POST /shipping/calculate-rates computes weight-based shipping rates', async () => {
    const rateEvent = createEvent('/shipping/calculate-rates', 'POST', {
      items: [{ frameSize: '16x24', quantity: 2 }],
      subtotalINR: 2500,
      pincode: '560001',
    })
    const response: any = await handler(rateEvent, {} as any)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.body)
    expect(payload.data).toHaveProperty('chargeableWeightGrams')
    expect(payload.data).toHaveProperty('shippingFeeINR')
  })

  // --------------------------------------------------------------------------
  // 4. Order Creation & Validation (Server-side price computation)
  // --------------------------------------------------------------------------
  it('POST /orders creates an order and validates server-side price without trusting client amounts', async () => {
    const orderPayload = {
      items: [
        {
          productId: 'porsche-911-gt3-rs-neon-night-frame',
          title: 'Porsche 911 GT3 RS Neon Night Frame',
          priceINR: 10, // Attempted tamper - server must recalculate base price + size addon!
          quantity: 1,
          customization: {
            frameSize: '12x18', // +₹300 addon
            moulding: 'Black Wood',
            glassType: 'Acrylic Glaze',
          },
        },
      ],
      shippingAddress: {
        fullName: 'Rajesh Sharma',
        phone: '9876543210',
        addressLine1: 'Villa 45, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
      },
      paymentMethod: 'COD',
    }

    const orderEvent = createEvent('/orders', 'POST', orderPayload)
    const response: any = await handler(orderEvent, {} as any)
    expect(response.statusCode).toBe(201)

    const payload = JSON.parse(response.body)
    expect(payload.success).toBe(true)
    expect(payload.data).toHaveProperty('orderNumber')
    expect(payload.data.orderNumber).toMatch(/^YF-/)

    // Server recalculated price: base (1499) + 12x18 size addon (300) = 1799
    // Plus ₹50 COD fee = ₹1849 (tampered ₹10 was rejected)
    expect(payload.data.subtotalINR).toBe(1799)
    expect(payload.data.codChargeINR).toBe(50)
    expect(payload.data.totalINR).toBe(1849)

    // Test GET /orders/:orderNumber
    const trackEvent = createEvent(`/orders/${payload.data.orderNumber}`)
    const trackRes: any = await handler(trackEvent, {} as any)
    expect(trackRes.statusCode).toBe(200)
    expect(JSON.parse(trackRes.body).data.orderNumber).toBe(payload.data.orderNumber)
  })

  it('POST /orders rejects orders with invalid phone or unserviceable PIN', async () => {
    const invalidPhonePayload = {
      items: [{ title: 'Frame', priceINR: 999, quantity: 1 }],
      shippingAddress: {
        fullName: 'Test User',
        phone: '123', // Invalid phone length
        addressLine1: 'Address',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
      paymentMethod: 'COD',
    }

    const res: any = await handler(createEvent('/orders', 'POST', invalidPhonePayload), {} as any)
    expect(res.statusCode).toBe(400)
  })

  // --------------------------------------------------------------------------
  // 5. Admin Authentication & Security Rate Limiting
  // --------------------------------------------------------------------------
  it('POST /admin/login authenticates super admin and rejects invalid passwords', async () => {
    // Valid super admin login
    const validLoginEvent = createEvent('/admin/login', 'POST', {
      email: 'admin@yourframies.com',
      password: 'YourFramies2026!',
    })
    const validRes: any = await handler(validLoginEvent, {} as any)
    expect(validRes.statusCode).toBe(200)

    const validData = JSON.parse(validRes.body)
    expect(validData.success).toBe(true)
    expect(validData).toHaveProperty('token')
    expect(validData.admin.role).toBe('SUPER_ADMIN')

    // Invalid password
    const invalidLoginEvent = createEvent('/admin/login', 'POST', {
      email: 'admin@yourframies.com',
      password: 'wrong_password_999',
    })
    const invalidRes: any = await handler(invalidLoginEvent, {} as any)
    expect(invalidRes.statusCode).toBe(401)
    const invalidData = JSON.parse(invalidRes.body)
    expect(invalidData.success).toBe(false)
  })

  it('Admin endpoints require valid JWT authentication', async () => {
    // Attempting to access protected admin route without token
    const unauthEvent = createEvent('/admin/orders', 'GET')
    const res: any = await handler(unauthEvent, {} as any)
    expect(res.statusCode).toBe(401)

    // With valid super admin token
    const loginRes: any = await handler(
      createEvent('/admin/login', 'POST', {
        email: 'admin@yourframies.com',
        password: 'YourFramies2026!',
      }),
      {} as any
    )
    const token = JSON.parse(loginRes.body).token

    const authEvent = createEvent('/admin/orders', 'GET', undefined, {
      authorization: `Bearer ${token}`,
    })
    const authRes: any = await handler(authEvent, {} as any)
    expect(authRes.statusCode).toBe(200)
    expect(Array.isArray(JSON.parse(authRes.body).data)).toBe(true)
  })

  // --------------------------------------------------------------------------
  // 6. Payments & Razorpay Cryptographic Verification
  // --------------------------------------------------------------------------
  it('POST /payments/razorpay/create-order creates Razorpay order payload', async () => {
    const createEventPayload = createEvent('/payments/razorpay/create-order', 'POST', {
      amountINR: 1499,
      receipt: 'rcpt_test_1001',
      orderNumber: 'YF-2026-TEST',
    })
    const res: any = await handler(createEventPayload, {} as any)
    expect(res.statusCode).toBe(200)

    const payload = JSON.parse(res.body)
    expect(payload.success).toBe(true)
    expect(payload.data.amount).toBe(149900) // amount in paise
    expect(payload.data.currency).toBe('INR')
  })

  it('POST /payments/razorpay/verify enforces signature check and rejects fraudulent payloads', async () => {
    // Forged signature
    const forgedEvent = createEvent('/payments/razorpay/verify', 'POST', {
      razorpay_order_id: 'order_fake_123',
      razorpay_payment_id: 'pay_fake_456',
      razorpay_signature: 'invalid_forged_signature_hash',
      orderNumber: 'YF-2026-1042',
    })
    const forgedRes: any = await handler(forgedEvent, {} as any)
    expect(forgedRes.statusCode).toBe(400)
    expect(JSON.parse(forgedRes.body).verified).toBe(false)

    // Valid test signature
    const validVerifyEvent = createEvent('/payments/razorpay/verify', 'POST', {
      razorpay_order_id: 'order_test_verified',
      razorpay_payment_id: 'pay_test_9999',
      razorpay_signature: 'test_signature_valid',
      orderNumber: 'YF-2026-1042',
    })
    const validVerifyRes: any = await handler(validVerifyEvent, {} as any)
    expect(validVerifyRes.statusCode).toBe(200)
    expect(JSON.parse(validVerifyRes.body).verified).toBe(true)
  })
})
