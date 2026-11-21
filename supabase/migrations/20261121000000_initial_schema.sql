-- ==============================================================================
-- yourframies - Supabase Automatic Database Migration
-- Auto-runs via Supabase GitHub Integration
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'PRINTING',
        'FRAMING',
        'PACKAGED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'RTO_INITIATED',
        'RTO_DELIVERED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('PREPAID_RAZORPAY', 'COD', 'PARTIAL_COD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE courier_partner AS ENUM ('DELHIVERY', 'SHIPROCKET', 'NIMBUSPOST', 'MANUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Delivery Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    base_price_inr NUMERIC(10, 2) NOT NULL,
    compare_at_price_inr NUMERIC(10, 2),
    images JSONB DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '["8x10", "12x18", "16x24", "20x30", "24x36"]'::jsonb,
    available_mouldings JSONB DEFAULT '["Black Wood", "White Minimalist", "Natural Oak", "Walnut", "Gold Leaf"]'::jsonb,
    is_customizable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    currency VARCHAR(10) DEFAULT 'INR',
    subtotal_inr NUMERIC(10, 2) NOT NULL,
    discount_inr NUMERIC(10, 2) DEFAULT 0.00,
    shipping_fee_inr NUMERIC(10, 2) DEFAULT 0.00,
    cod_charge_inr NUMERIC(10, 2) DEFAULT 0.00,
    total_inr NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    notes TEXT,
    awb_code VARCHAR(100),
    courier_partner VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Line Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100),
    product_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    customization JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payment Transactions
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount_inr NUMERIC(10, 2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Shipments & Courier Logistics
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100),
    courier_partner courier_partner NOT NULL,
    awb_code VARCHAR(100) UNIQUE,
    shipment_id VARCHAR(100),
    manifest_id VARCHAR(100),
    label_url TEXT,
    tracking_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'MANIFESTED',
    courier_status_code VARCHAR(50),
    is_cod BOOLEAN DEFAULT FALSE,
    cod_amount_inr NUMERIC(10, 2) DEFAULT 0.00,
    estimated_delivery TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    rto_initiated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Logistics Tracking Events History
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    event_timestamp TIMESTAMPTZ NOT NULL,
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb ON shipments(awb_code);
CREATE INDEX IF NOT EXISTS idx_addresses_pincode ON addresses(pincode);

-- 10. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'MANAGER',
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Website General Settings
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(255)
);

-- 12. Homepage Dynamic Sections
CREATE TABLE IF NOT EXISTS homepage_sections (
    id VARCHAR(100) PRIMARY KEY,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    content JSONB DEFAULT '{}'::jsonb,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    background_style VARCHAR(100) DEFAULT 'white',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Central Media Library
CREATE TABLE IF NOT EXISTS media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    file_size_bytes INT,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    folder VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Admin Security & Operation Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    admin_id VARCHAR(100) NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections(display_order ASC);

-- Seed Initial Super Admin
INSERT INTO admin_users (id, email, password_hash, name, role, is_active)
VALUES (
  'adm-001',
  'admin@yourframies.com',
  'pbkdf2$600000$c2VlZFNhbHRZZkhFOGQ=$03b8e1456cb9597fe35ea56e0e0619d2f476473ef01793732021597f6ccbcf5ac932800d610148e6500f066c84ca86410199f613b4245e8ad41e70ffbe21ba7c',
  'Atelier Director',
  'SUPER_ADMIN',
  true
)
ON CONFLICT (email) DO NOTHING;
