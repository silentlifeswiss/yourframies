---
name: database-postgresql
description: Architecture, schema design, connection pooling, and migration patterns for PostgreSQL e-commerce workloads (Neon, Supabase, or AWS RDS).
---

# PostgreSQL E-Commerce Architecture Guide

This skill defines the schema conventions, relational models, indexing strategies, and connection pooling rules for yourframies.

## 1. Connection Management in Serverless (Netlify Functions)

In serverless environments, functions scale dynamically and short-lived execution can exhaust connection pools.
- **Rule**: Use connection pooling with Neon (`@neondatabase/serverless`) or Supabase pooler (Port 6543, transaction mode).
- If using standard PostgreSQL, use connection pool configuration (`max: 1`) or pgBouncer with `DATABASE_URL` containing pooler flags.

---

## 2. Core E-Commerce Schema Entities

### Tables & Key Columns:
1. **`users`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `email VARCHAR(255) UNIQUE NOT NULL`
   - `phone VARCHAR(20) NOT NULL`
   - `password_hash VARCHAR(255)`
   - `created_at TIMESTAMPTZ DEFAULT NOW()`

2. **`addresses`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `user_id UUID REFERENCES users(id)`
   - `full_name VARCHAR(100) NOT NULL`
   - `phone VARCHAR(20) NOT NULL`
   - `address_line1 TEXT NOT NULL`
   - `address_line2 TEXT`
   - `landmark TEXT`
   - `city VARCHAR(100) NOT NULL`
   - `state VARCHAR(100) NOT NULL`
   - `pincode VARCHAR(10) NOT NULL`

3. **`categories`** & **`products`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `name VARCHAR(255) NOT NULL`
   - `slug VARCHAR(255) UNIQUE NOT NULL`
   - `description TEXT`
   - `price_inr NUMERIC(10,2) NOT NULL`
   - `compare_at_price_inr NUMERIC(10,2)`
   - `stock_quantity INT NOT NULL DEFAULT 0`
   - `images JSONB DEFAULT '[]'`
   - `customization_options JSONB DEFAULT '{}'` -- Frame size, material, mat color, orientation
   - `is_active BOOLEAN DEFAULT true`

4. **`orders`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `order_number VARCHAR(50) UNIQUE NOT NULL` -- e.g. YF-2026-1001
   - `user_id UUID REFERENCES users(id)`
   - `status VARCHAR(50) NOT NULL DEFAULT 'PENDING'` -- PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
   - `payment_method VARCHAR(20) NOT NULL` -- PREPAID_RAZORPAY, COD
   - `payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING'` -- PENDING, PAID, FAILED, REFUNDED
   - `subtotal_inr NUMERIC(10,2) NOT NULL`
   - `discount_inr NUMERIC(10,2) DEFAULT 0`
   - `shipping_fee_inr NUMERIC(10,2) DEFAULT 0`
   - `total_inr NUMERIC(10,2) NOT NULL`
   - `shipping_address JSONB NOT NULL`
   - `created_at TIMESTAMPTZ DEFAULT NOW()`

5. **`order_items`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `order_id UUID REFERENCES orders(id) ON DELETE CASCADE`
   - `product_id UUID REFERENCES products(id)`
   - `title VARCHAR(255) NOT NULL`
   - `price_inr NUMERIC(10,2) NOT NULL`
   - `quantity INT NOT NULL`
   - `customization JSONB DEFAULT '{}'` -- uploaded photo URL, frame selection

6. **`shipments`**:
   - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `order_id UUID REFERENCES orders(id)`
   - `courier_partner VARCHAR(50) NOT NULL` -- DELHIVERY, SHIPROCKET, NIMBUSPOST
   - `awb_code VARCHAR(100) UNIQUE`
   - `tracking_url TEXT`
   - `status VARCHAR(50) NOT NULL`
   - `updated_at TIMESTAMPTZ DEFAULT NOW()`

---

## 3. Performance & Indexing
- Unique index on `products(slug)`.
- Index on `orders(user_id, created_at DESC)`.
- Index on `orders(order_number)`.
- Index on `shipments(awb_code)`.
- Index on `addresses(pincode)`.
