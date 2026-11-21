---
name: ecommerce-security-seo
description: Cybersecurity, data protection, OWASP safeguards, and SEO/performance optimization standards for yourframies.
---

# E-Commerce Security & SEO Guide

## 1. Security & Data Protection
- **Secrets Isolation**: `RAZORPAY_KEY_SECRET`, `DELHIVERY_API_TOKEN`, `SHIPROCKET_PASSWORD`, and `DATABASE_URL` must remain in serverless environment variables only. Frontend builds must only access `VITE_` prefixed variables (`VITE_RAZORPAY_KEY_ID`, `VITE_SITE_URL`).
- **Input Validation**: Validate every incoming API request with **Zod** schemas before processing or persisting to database.
- **SQL Injection Prevention**: Use parameterized queries exclusively (`$1, $2, ...`) via postgres/pg or ORM. Never concatenate SQL strings.
- **Cross-Site Scripting (XSS)**: React handles string sanitization natively; never use `dangerouslySetInnerHTML` for untrusted customer input.
- **Rate Limiting**: Protect checkout, OTP sending, and login endpoints against brute force and automated script flooding.

---

## 2. Technical SEO & Performance
- **Semantic HTML**: Proper `header`, `nav`, `main`, `section`, `article`, `footer` landmarks.
- **Dynamic Meta Tags**: Title, description, Open Graph (`og:image`, `og:title`), Twitter card metadata for each product and category.
- **Structured Data (Schema.org)**:
  - `Product` schema with price, currency (INR), availability, review ratings.
  - `BreadcrumbList` for category hierarchies.
  - `Organization` and `LocalBusiness` schemas.
- **Image Optimization**: WebP/AVIF formats, explicit `width` and `height` to prevent Cumulative Layout Shift (CLS), lazy-loading below-the-fold assets.
- **Sitemap & Robots**: `robots.txt` and `sitemap.xml` dynamically generated for catalog indexing.
