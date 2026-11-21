import crypto from 'node:crypto'

export interface RazorpayOrderResponse {
  id: string
  amount: number // in paise
  currency: string
  receipt: string
  status: string
  isLive: boolean
}

export interface RazorpayRefundResponse {
  id: string
  paymentId: string
  amount: number
  status: string
  speed: string
}

// Blocked PIN codes for high COD RTO rates
const HIGH_RISK_COD_PINS = new Set(['110006', '700024', '400009', '500002', '600001'])

export class PaymentsManager {
  private keyId: string | undefined
  private keySecret: string | undefined
  private webhookSecret: string | undefined

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID
    this.keySecret = process.env.RAZORPAY_KEY_SECRET
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  }

  public isRazorpayConfigured(): boolean {
    return (
      Boolean(this.keyId && this.keySecret) &&
      !this.keyId?.includes('YourKeyIdHere') &&
      !this.keySecret?.includes('YourRazorpaySecretHere')
    )
  }

  // ----------------------------------------------------------------------------
  // 1. Create Razorpay Order
  // ----------------------------------------------------------------------------
  public async createRazorpayOrder(
    amountINR: number,
    receipt: string,
    notes?: Record<string, string>
  ): Promise<{ success: boolean; data?: RazorpayOrderResponse; message?: string }> {
    if (amountINR <= 0) {
      return { success: false, message: 'Invalid order amount' }
    }

    const amountInPaise = Math.round(amountINR * 100)

    if (this.isRazorpayConfigured()) {
      try {
        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes: notes || {},
          }),
        })

        const data = (await response.json()) as any

        if (!response.ok) {
          return {
            success: false,
            message: data.error?.description || 'Razorpay order creation failed',
          }
        }

        return {
          success: true,
          data: {
            id: data.id,
            amount: data.amount,
            currency: data.currency,
            receipt: data.receipt,
            status: data.status,
            isLive: true,
          },
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Razorpay network request error' }
      }
    }

    // Test / Sandbox Mode Fallback
    const simulatedOrderId = `order_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    return {
      success: true,
      data: {
        id: simulatedOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        status: 'created',
        isLive: false,
      },
    }
  }

  // ----------------------------------------------------------------------------
  // 2. Server-Side HMAC-SHA256 Signature Verification
  // ----------------------------------------------------------------------------
  public verifySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): { isValid: boolean; reason?: string } {
    if (!orderId || !paymentId || !signature) {
      return { isValid: false, reason: 'Missing order ID, payment ID, or signature' }
    }

    if (this.isRazorpayConfigured()) {
      try {
        const payload = `${orderId}|${paymentId}`
        const expectedSignature = crypto
          .createHmac('sha256', this.keySecret!)
          .update(payload)
          .digest('hex')

        const isValid = crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        )

        return { isValid }
      } catch (err: any) {
        return { isValid: false, reason: err.message }
      }
    }

    // In test simulation mode (without live API keys)
    if (orderId.startsWith('order_test_') || signature === 'test_signature_valid') {
      return { isValid: true }
    }

    return { isValid: false, reason: 'Razorpay keys not configured and invalid signature payload' }
  }

  // ----------------------------------------------------------------------------
  // 3. Webhook Signature Verification
  // ----------------------------------------------------------------------------
  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookSecret || !signature) return false

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex')

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    } catch {
      return false
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Process Refund
  // ----------------------------------------------------------------------------
  public async processRefund(
    paymentId: string,
    amountINR: number,
    reason: string
  ): Promise<{ success: boolean; data?: RazorpayRefundResponse; message?: string }> {
    if (!paymentId || amountINR <= 0) {
      return { success: false, message: 'Invalid payment ID or refund amount' }
    }

    if (this.isRazorpayConfigured()) {
      try {
        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64')
        const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(amountINR * 100),
            notes: { reason },
          }),
        })

        const data = (await response.json()) as any
        if (!response.ok) {
          return { success: false, message: data.error?.description || 'Refund API failed' }
        }

        return {
          success: true,
          data: {
            id: data.id,
            paymentId: data.payment_id,
            amount: data.amount / 100,
            status: data.status,
            speed: data.speed_processed || 'normal',
          },
        }
      } catch (err: any) {
        return { success: false, message: err.message }
      }
    }

    // Simulated Refund
    return {
      success: true,
      data: {
        id: `rfd_sim_${Date.now()}`,
        paymentId,
        amount: amountINR,
        status: 'processed',
        speed: 'instant_simulated',
      },
    }
  }

  // ----------------------------------------------------------------------------
  // 5. Cash on Delivery (COD) Validation
  // ----------------------------------------------------------------------------
  public validateCodEligibility(
    pincode: string,
    amountINR: number
  ): { eligible: boolean; feeINR: number; message?: string } {
    const cleanedPin = String(pincode).trim()

    // 1. PIN Format Check
    if (!/^[1-9][0-9]{5}$/.test(cleanedPin)) {
      return { eligible: false, feeINR: 0, message: 'Invalid 6-digit Indian Postal PIN code' }
    }

    // 2. High Risk RTO Blocklist
    if (HIGH_RISK_COD_PINS.has(cleanedPin)) {
      return {
        eligible: false,
        feeINR: 0,
        message: 'Cash on Delivery is unavailable for this PIN code due to high return rates. Please use Razorpay prepaid payment.',
      }
    }

    // 3. Max COD order limit (₹10,000)
    if (amountINR > 10000) {
      return {
        eligible: false,
        feeINR: 0,
        message: 'Orders over ₹10,000 must be prepaid via Razorpay for high-value bespoke framing security.',
      }
    }

    return {
      eligible: true,
      feeINR: 50,
    }
  }
}

export const payments = new PaymentsManager()
