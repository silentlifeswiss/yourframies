---
name: netlify-serverless-architecture
description: Serverless functions design, routing, environment variable isolation, CORS, and deployment workflows for Netlify.
---

# Netlify Serverless Architecture Guide

This skill governs the backend API structure using Netlify Functions, routing via `netlify.toml`, and edge configurations for yourframies.

## 1. Directory Structure

```
yourframies/
├── netlify.toml               # Netlify configuration, redirects, headers
├── netlify/
│   └── functions/             # TypeScript serverless endpoints
│       ├── api.ts             # Express-like or single-dispatch router
│       ├── create-order.ts    # Razorpay order generation
│       ├── verify-payment.ts  # Razorpay HMAC verification
│       ├── pincode-check.ts   # Courier serviceability lookup
│       ├── razorpay-webhook.ts# Webhook listener
│       └── tracking-webhook.ts# Logistics status updates
```

---

## 2. Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "26"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https:; frame-src https://api.razorpay.com;"
```

---

## 3. Function Helper & Error Handling Standards
- Always return appropriate HTTP status codes (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Error`).
- Include standard JSON response shape:
  ```ts
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ success: true, data: result }),
  };
  ```
