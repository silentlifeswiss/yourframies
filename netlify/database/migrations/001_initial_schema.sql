-- Netlify Database Automatic Migration 001
-- Runs automatically when deploying to Netlify with Netlify Database enabled

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    base_price_inr NUMERIC(10, 2) NOT NULL,
    compare_at_price_inr NUMERIC(10, 2),
    images JSONB DEFAULT '[]'::jsonb,
    available_sizes JSONB DEFAULT '["8x10", "12x18", "16x24", "20x30"]'::jsonb,
    available_mouldings JSONB DEFAULT '["Black Wood", "White Minimalist", "Natural Oak", "Walnut"]'::jsonb,
    is_customizable BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Seed initial super admin
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
