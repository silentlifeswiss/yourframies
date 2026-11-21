---
name: razorpay-payments
description: End-to-end integration standards for Razorpay Checkout, Orders API, server-side HMAC-SHA256 signature verification, webhooks, and refunds.
---

# Razorpay Payments Integration Guide

This skill governs standard payment handling with Razorpay for Indian e-commerce transactions (UPI, Cards, Netbanking, Wallets, Cred, and PayLater).

## 1. Security First Principles
- **NEVER** expose `RAZORPAY_KEY_SECRET` in client-side code or public Git repositories.
- Only `RAZORPAY_KEY_ID` may be exposed in the frontend checkout modal.
- Never trust client-reported payment statuses. Payments are confirmed **only** after verifying the cryptographic HMAC-SHA256 signature server-side.

---

## 2. Order Creation Flow (Serverless Function)

1. Client sends cart items & shipping details to serverless function `/.netlify/functions/create-order`.
2. Server validates price from database (never accept price from frontend request).
3. Server invokes Razorpay Orders API:
   ```ts
   // Currency must be INR, amount in paise (1 INR = 100 paise)
   const order = await razorpay.orders.create({
     amount: Math.round(orderTotalINR * 100),
     currency: "INR",
     receipt: `order_${internalOrderId}`,
     notes: {
       orderId: internalOrderId,
       customerId: customerId,
     }
   });
   ```
4. Server returns `order.id` (e.g. `order_M4xyz...`), amount, and public `RAZORPAY_KEY_ID` to the frontend.

---

## 3. Client Checkout (Standard Web Modal)

Use Razorpay's standard checkout script:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
Pass checkout options:
```ts
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: orderData.amount,
  currency: "INR",
  name: "yourframies",
  description: "Order #" + orderData.receipt,
  order_id: orderData.id,
  handler: async function (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    // Send to backend verification endpoint
    await verifyPayment(response);
  },
  prefill: {
    name: customer.name,
    email: customer.email,
    contact: customer.phone,
  },
  theme: {
    color: "#0891b2", // cyan-600
  },
};
```

---

## 4. Server-Side HMAC Signature Verification

In `/.netlify/functions/verify-payment`:
```ts
import crypto from 'node:crypto';

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(signature)
  );
}
```

---

## 5. Webhook Integration
- Webhook URL: `https://yourframies.com/.netlify/functions/razorpay-webhook`
- Secret: Set in Razorpay Dashboard under Settings -> Webhooks.
- Events to subscribe to:
  - `payment.captured`
  - `payment.failed`
  - `refund.processed`
- Validate webhook signature via header `x-razorpay-signature` using HMAC-SHA256 with `RAZORPAY_WEBHOOK_SECRET`.
