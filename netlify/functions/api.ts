import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import crypto from 'node:crypto'

// Fallback in-memory catalog for serverless execution
const PRODUCTS_STORE = [
  {
    id: 'yf-car-01',
    title: 'Porsche 911 GT3 RS Neon Night Frame',
    slug: 'porsche-911-gt3-rs-neon-night-frame',
    basePriceINR: 1499,
    category: 'car-photo-frames',
  },
  {
    id: 'yf-car-02',
    title: 'Vintage BMW E30 M3 Heritage Edition',
    slug: 'vintage-bmw-e30-m3-heritage-edition',
    basePriceINR: 1599,
    category: 'car-photo-frames',
  },
  {
    id: 'yf-aes-01',
    title: 'Serene Botanical Fern Minimalist Frame',
    slug: 'serene-botanical-fern-minimalist-frame',
    basePriceINR: 1199,
    category: 'aesthetic-photo-frames',
  },
  {
    id: 'yf-cust-01',
    title: 'Bespoke Studio Custom Frame',
    slug: 'bespoke-studio-custom-frame',
    basePriceINR: 1299,
    category: 'custom-photo-frames',
  },
]

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '')
  const method = event.httpMethod

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  try {
    // 1. GET /products
    if ((path === '/products' || path === '') && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: PRODUCTS_STORE.length, data: PRODUCTS_STORE }),
      }
    }

    // 2. POST /pincode-check
    if (path === '/pincode-check' && method === 'POST') {
      const { pincode } = JSON.parse(event.body || '{}')
      const isValid = /^[1-9][0-9]{5}$/.test(String(pincode).trim())

      if (!isValid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid 6-digit Indian PIN code' }),
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            pincode,
            isServiceable: true,
            isCodAvailable: true,
            courierPartner: 'Delhivery Surface Express',
            estimatedDays: 3,
          },
        }),
      }
    }

    // 3. POST /create-order (Razorpay order simulation / live integration)
    if (path === '/create-order' && method === 'POST') {
      const { amountINR, receipt } = JSON.parse(event.body || '{}')

      if (!amountINR || amountINR <= 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid order amount' }),
        }
      }

      const razorpayKey = process.env.RAZORPAY_KEY_ID
      const razorpaySecret = process.env.RAZORPAY_KEY_SECRET

      // If Razorpay credentials exist, invoke Razorpay API
      if (razorpayKey && razorpaySecret) {
        try {
          const authHeader = 'Basic ' + Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64')
          const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: authHeader,
            },
            body: JSON.stringify({
              amount: Math.round(amountINR * 100),
              currency: 'INR',
              receipt: receipt || `receipt_${Date.now()}`,
            }),
          })
          const rzpData = await rzpRes.json()
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, data: rzpData }) }
        } catch (err) {
          console.error('Razorpay API error, falling back to simulated order', err)
        }
      }

      // Simulated Order for development / test mode
      const mockRazorpayOrderId = `order_sim_${Date.now()}`
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          mode: 'simulated_test',
          data: {
            id: mockRazorpayOrderId,
            amount: Math.round(amountINR * 100),
            currency: 'INR',
            receipt: receipt || `receipt_${Date.now()}`,
            status: 'created',
          },
        }),
      }
    }

    // 4. POST /verify-payment (HMAC-SHA256 signature verification)
    if (path === '/verify-payment' && method === 'POST') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(
        event.body || '{}'
      )

      const secret = process.env.RAZORPAY_KEY_SECRET

      if (secret && razorpay_signature) {
        const generatedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex')

        const isValid = crypto.timingSafeEqual(
          Buffer.from(generatedSignature),
          Buffer.from(razorpay_signature)
        )

        return {
          statusCode: isValid ? 200 : 400,
          headers,
          body: JSON.stringify({ success: isValid, verified: isValid }),
        }
      }

      // Test mode acceptance
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, verified: true, mode: 'test_simulation' }),
      }
    }

    // Default 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, message: `Endpoint not found: ${path}` }),
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
    }
  }
}
