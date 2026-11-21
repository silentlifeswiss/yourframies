---
name: indian-ecommerce-logistics
description: Integration standards and operational workflows for Indian e-commerce shipping aggregators (Delhivery One, Shiprocket, NimbusPost) and Cash on Delivery (COD) management.
---

# Indian E-Commerce Logistics & COD Guide

This skill provides architecture and operational guidance for integrating Delhivery One, Shiprocket, and NimbusPost shipping APIs, managing COD risks, and handling reverse logistics in India.

## 1. Logistics Providers Overview

### Delhivery One
- **API Endpoint**: `https://track.delhivery.com/api/` (Production) / `https://staging-express.delhivery.com/api/` (Staging)
- **Authentication**: Token passed in Header: `Authorization: Token <DELHIVERY_API_TOKEN>`
- **Key Operations**:
  - Pincode Serviceability: `GET /c/api/pin-codes/json/?filter_codes=<pincode>`
  - Waybill Generation: `GET /waybill/api/bulk/json/?token=<token>&count=1`
  - Order Creation: `POST /api/cmu/create.json` (format: `format=json&data={...}`)
  - Tracking: `GET /api/v1/packages/json/?waybill=<waybill>` or webhook push notifications.

### Shiprocket
- **API Endpoint**: `https://apiv2.shiprocket.in/v1/external/`
- **Authentication**: JWT token generated via `POST /auth/login` (email + password) with 10-day validity. Header: `Authorization: Bearer <TOKEN>`
- **Key Operations**:
  - Serviceability Check: `GET /courier/serviceability/?pickup_postcode=<>&delivery_postcode=<>&cod=<0|1>&weight=<>`
  - Order Creation: `POST /orders/create/adhoc`
  - AWB Assignment: `POST /courier/assign/awb`
  - Generate Pickup: `POST /courier/generate/pickup`
  - Tracking: `GET /courier/track/awb/<awb_code>`

### NimbusPost
- **API Endpoint**: `https://api.nimbuspost.com/v1/`
- **Authentication**: `POST /users/login` returns token. Pass in `Authorization: Bearer <TOKEN>`.
- **Key Operations**:
  - Pincode Serviceability: `POST /courier/serviceability`
  - Create Shipment: `POST /shipments`
  - Manifest Generation: `POST /shipments/manifest`
  - Realtime Tracking: `POST /shipments/track`

---

## 2. Cash on Delivery (COD) & Fraud Prevention Best Practices

COD accounts for 50–70% of Indian e-commerce orders, but incurs high Return to Origin (RTO) costs (₹80–₹150+ per return).

### Mandatory COD Guardrails:
1. **Pincode Verification**: Validate that the destination pincode accepts COD before enabling the COD payment radio button.
2. **Mobile Number OTP Verification**: Verify phone numbers via SMS OTP (Fast2SMS / MSG91 / Twilio) before confirming COD orders.
3. **Partial Advance / Delivery Charge Prepayment**: Optionally charge a non-refundable ₹99/₹149 shipping fee online, keeping the remaining amount as COD.
4. **Order Confirmation Bot / WhatsApp Notification**: Send instant WhatsApp/SMS notification on order placement with "Confirm" or "Cancel" buttons.
5. **Customer Risk Scoring**: Flag high-risk orders (bulk orders, history of RTO, invalid address strings lacking house/street numbers).

---

## 3. Webhook Handling & Idempotency
- All courier webhooks must respond with `200 OK` within 2 seconds.
- Enforce idempotency: store incoming webhook events by `(provider, event_id, status)` to prevent duplicate status transitions.
- Standard order fulfillment state machine:
  `ORDER_PLACED` -> `PAYMENT_CONFIRMED` -> `PROCESSING` -> `MANIFESTED` -> `PICKED_UP` -> `IN_TRANSIT` -> `OUT_FOR_DELIVERY` -> `DELIVERED` (or `RTO_INITIATED` -> `RTO_DELIVERED`).
