import { describe, it, expect } from 'vitest'
import { handler } from '../../netlify/functions/api.ts'
import type { HandlerEvent } from '@netlify/functions'

function createEvent(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): HandlerEvent {
  const [purePath, queryStr] = path.split('?')
  const qParams: Record<string, string> = {}
  if (queryStr) {
    const usp = new URLSearchParams(queryStr)
    usp.forEach((val, key) => {
      qParams[key] = val
    })
  }

  return {
    rawUrl: `http://localhost:5173${path}`,
    rawQuery: queryStr || '',
    path: purePath,
    httpMethod: method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    multiValueHeaders: {},
    queryStringParameters: queryStr ? qParams : null,
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

  it('Admin can create, update, and delete categories', async () => {
    // 1. Get admin token
    const loginRes: any = await handler(
      createEvent('/admin/login', 'POST', {
        email: 'admin@yourframies.com',
        password: 'YourFramies2026!',
      }),
      {} as any
    )
    const token = JSON.parse(loginRes.body).token

    // 2. Create new category
    const createEventPayload = createEvent(
      '/admin/categories',
      'POST',
      {
        name: 'Anime & Manga Frames',
        slug: 'anime-manga-frames',
        description: 'Vibrant framed prints of iconic anime and manga series.',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477',
      },
      { authorization: `Bearer ${token}` }
    )
    const createRes: any = await handler(createEventPayload, {} as any)
    expect(createRes.statusCode).toBe(201)
    const createData = JSON.parse(createRes.body).data
    expect(createData.name).toBe('Anime & Manga Frames')
    expect(createData.slug).toBe('anime-manga-frames')

    // 3. Update category
    const updateRes: any = await handler(
      createEvent(
        `/admin/categories/${createData.id}`,
        'PUT',
        {
          name: 'Anime & Manga Art Frames',
          slug: 'anime-manga-art-frames',
          description: 'Updated description for Japanese anime wall art.',
        },
        { authorization: `Bearer ${token}` }
      ),
      {} as any
    )
    expect(updateRes.statusCode).toBe(200)
    expect(JSON.parse(updateRes.body).data.name).toBe('Anime & Manga Art Frames')

    // 4. Verify in public GET /categories
    const listRes: any = await handler(createEvent('/categories'), {} as any)
    const listData = JSON.parse(listRes.body).data
    expect(listData.some((c: any) => c.name === 'Anime & Manga Art Frames')).toBe(true)

    // 5. Delete category
    const delRes: any = await handler(
      createEvent(`/admin/categories/${createData.id}`, 'DELETE', undefined, {
        authorization: `Bearer ${token}`,
      }),
      {} as any
    )
    expect(delRes.statusCode).toBe(200)
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

  it('POST /orders enforces payment verification before placing PREPAID_RAZORPAY orders', async () => {
    const basePayload = {
      items: [
        {
          productId: 'porsche-911-gt3-rs-neon-night-frame',
          title: 'Porsche 911 GT3 RS Neon Night Frame',
          priceINR: 1499,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Shaurya Customer',
        phone: '9876543210',
        addressLine1: 'Villa 12, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
      },
      paymentMethod: 'PREPAID_RAZORPAY',
    }

    // 1. Unverified prepaid order attempt must fail with 400
    const unverifiedRes: any = await handler(createEvent('/orders', 'POST', basePayload), {} as any)
    expect(unverifiedRes.statusCode).toBe(400)
    expect(JSON.parse(unverifiedRes.body).message).toContain('Razorpay payment confirmation is required')

    // 2. Verified prepaid order with valid signature succeeds and captures payment
    const verifiedPayload = {
      ...basePayload,
      razorpayOrderId: 'order_test_verified',
      razorpayPaymentId: 'pay_test_9999',
      razorpaySignature: 'test_signature_valid',
    }
    const verifiedRes: any = await handler(createEvent('/orders', 'POST', verifiedPayload), {} as any)
    expect(verifiedRes.statusCode).toBe(201)
    const verifiedData = JSON.parse(verifiedRes.body).data
    expect(verifiedData.paymentStatus).toBe('CAPTURED')
    expect(verifiedData.status).toBe('CONFIRMED')
    expect(verifiedData.razorpayPaymentId).toBe('pay_test_9999')
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

  // --------------------------------------------------------------------------
  // 7. Customer Mobile OTP Authentication & Verification
  // --------------------------------------------------------------------------
  it('POST /auth/send-otp dispatches 6-digit OTP for valid Indian mobile numbers', async () => {
    const validSendEvent = createEvent('/auth/send-otp', 'POST', {
      phone: '9876543210',
      purpose: 'login',
    })
    const res: any = await handler(validSendEvent, {} as any)
    expect(res.statusCode).toBe(200)

    const payload = JSON.parse(res.body)
    expect(payload.success).toBe(true)
    expect(payload).toHaveProperty('otpPreview')
    expect(payload.otpPreview).toMatch(/^\d{6}$/)

    // Rejects invalid phone numbers
    const invalidSendEvent = createEvent('/auth/send-otp', 'POST', {
      phone: '12345',
    })
    const invalidRes: any = await handler(invalidSendEvent, {} as any)
    expect(invalidRes.statusCode).toBe(400)
    expect(JSON.parse(invalidRes.body).success).toBe(false)
  })

  it('POST /auth/verify-otp verifies OTP code and issues customer session token', async () => {
    // 1. Dispatch OTP
    const sendEvent = createEvent('/auth/send-otp', 'POST', {
      phone: '9876543210',
      purpose: 'login',
    })
    const sendRes: any = await handler(sendEvent, {} as any)
    const otpCode = JSON.parse(sendRes.body).otpPreview

    // 2. Reject incorrect OTP
    const wrongEvent = createEvent('/auth/verify-otp', 'POST', {
      phone: '9876543210',
      otp: '000000',
    })
    const wrongRes: any = await handler(wrongEvent, {} as any)
    expect(wrongRes.statusCode).toBe(400)
    expect(JSON.parse(wrongRes.body).success).toBe(false)

    // 3. Accept correct OTP
    const correctEvent = createEvent('/auth/verify-otp', 'POST', {
      phone: '9876543210',
      otp: otpCode,
      name: 'Shaurya Customer',
    })
    const correctRes: any = await handler(correctEvent, {} as any)
    expect(correctRes.statusCode).toBe(200)

    const payload = JSON.parse(correctRes.body)
    expect(payload.success).toBe(true)
    expect(payload.user.isPhoneVerified).toBe(true)
    expect(payload.user.phone).toBe('9876543210')
    expect(payload).toHaveProperty('token')
  })

  it('POST /auth/register and /auth/login enforce mobile OTP verification', async () => {
    // Register with master test OTP 123456
    const regEvent = createEvent('/auth/register', 'POST', {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9812345678',
      otp: '123456',
    })
    const regRes: any = await handler(regEvent, {} as any)
    expect(regRes.statusCode).toBe(200)

    const regData = JSON.parse(regRes.body)
    expect(regData.success).toBe(true)
    expect(regData.user.name).toBe('Priya Sharma')
    expect(regData.user.isPhoneVerified).toBe(true)

    // Customer Login via OTP
    const loginEvent = createEvent('/auth/login', 'POST', {
      phone: '9812345678',
      otp: '123456',
    })
    const loginRes: any = await handler(loginEvent, {} as any)
    expect(loginRes.statusCode).toBe(200)
    expect(JSON.parse(loginRes.body).success).toBe(true)
  })

  // --------------------------------------------------------------------------
  // 8. Customer Cart Persistence & Real-Time Tracking
  // --------------------------------------------------------------------------
  it('POST /cart, GET /cart, and DELETE /cart synchronize customer cart in database', async () => {
    const testUserId = 'cust-test-999'
    const cartItems = [
      {
        id: 'test-cart-item-1',
        productId: 'yf-car-01',
        title: 'Porsche 911 GT3 RS Neon Night Frame',
        priceINR: 1499,
        quantity: 2,
        customization: { frameSize: '12x18', moulding: 'Black Wood' },
      },
    ]

    // Save cart
    const saveRes: any = await handler(
      createEvent('/cart', 'POST', {
        userId: testUserId,
        items: cartItems,
        coupon: { code: 'WELCOME10', discountPercent: 10 },
      }),
      {} as any
    )
    expect(saveRes.statusCode).toBe(200)

    // Fetch cart
    const getRes: any = await handler(
      createEvent(`/cart?userId=${testUserId}`, 'GET'),
      {} as any
    )
    expect(getRes.statusCode).toBe(200)
    const getData = JSON.parse(getRes.body)
    expect(getData.success).toBe(true)
    expect(getData.data.items).toHaveLength(1)
    expect(getData.data.coupon.code).toBe('WELCOME10')

    // Delete cart
    const delRes: any = await handler(
      createEvent(`/cart?userId=${testUserId}`, 'DELETE'),
      {} as any
    )
    expect(delRes.statusCode).toBe(200)

    // Verify empty
    const verifyRes: any = await handler(
      createEvent(`/cart?userId=${testUserId}`, 'GET'),
      {} as any
    )
    const verifyData = JSON.parse(verifyRes.body)
    expect(verifyData.data.items).toHaveLength(0)
  })

  it('POST /shipping/track-order returns live order tracking details by order number or phone', async () => {
    // 1. Create a live order to track
    const orderPayload = {
      items: [{ productId: 'yf-car-01', title: 'Porsche Frame', priceINR: 1499, quantity: 1 }],
      shippingAddress: {
        fullName: 'Sameer Sen',
        phone: '9845012345',
        addressLine1: 'MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
      },
      paymentMethod: 'PREPAID_RAZORPAY',
      razorpayOrderId: 'order_test_verified',
      razorpayPaymentId: 'pay_test_9999',
      razorpaySignature: 'test_signature_valid',
    }

    const orderRes: any = await handler(createEvent('/orders', 'POST', orderPayload), {} as any)
    const orderData = JSON.parse(orderRes.body)
    expect(orderRes.statusCode).toBe(201)
    const orderNumber = orderData.data.orderNumber

    // 2. Track by Order Number
    const trackOrderRes: any = await handler(
      createEvent('/shipping/track-order', 'POST', { query: orderNumber }),
      {} as any
    )
    expect(trackOrderRes.statusCode).toBe(200)
    const trackOrderData = JSON.parse(trackOrderRes.body)
    expect(trackOrderData.success).toBe(true)
    expect(trackOrderData.data.order.orderNumber).toBe(orderNumber)

    // 3. Track by Phone Number
    const trackPhoneRes: any = await handler(
      createEvent('/shipping/track-order', 'POST', { query: '9845012345' }),
      {} as any
    )
    expect(trackPhoneRes.statusCode).toBe(200)
    const trackPhoneData = JSON.parse(trackPhoneRes.body)
    expect(trackPhoneData.success).toBe(true)
    expect(trackPhoneData.data.order.shippingAddress.phone).toBe('9845012345')
  })
})
