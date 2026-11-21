import fs from 'node:fs'
import path from 'node:path'
import { Pool } from 'pg'
import {
  DBProduct,
  DBCategory,
  DBOrder,
  DBAdminUser,
  DBSiteSettings,
  DBHomepageSection,
  DBAuditLog,
} from './types.ts'

// ==============================================================================
// Initial Seed Data (Fallback & Auto-Seed)
// ==============================================================================

const INITIAL_CATEGORIES: DBCategory[] = [
  {
    id: 'cat-car-frames',
    name: 'Car Photo Frames',
    slug: 'car-photo-frames',
    description: 'High-definition motorsport legends, supercar silhouettes, and trackside photography.',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-aesthetic-frames',
    name: 'Aesthetic Photo Frames',
    slug: 'aesthetic-photo-frames',
    description: 'Minimalist Japandi botanicals, monochrome architecture, and calm gallery pieces.',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-personalised-frames',
    name: 'Personalised Photo Frames',
    slug: 'personalised-photo-frames',
    description: 'Custom archival photo prints of your own family, wedding, and travel memories.',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-custom-frames',
    name: 'Custom Photo Frames',
    slug: 'custom-photo-frames',
    description: 'Interactive studio customizer for bespoke frame sizing and custom moulding finishes.',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-posters',
    name: 'Posters & Wall Art',
    slug: 'posters',
    description: 'Swiss typographic posters and contemporary artistic graphic prints.',
    displayOrder: 5,
    isActive: true,
  },
]

const INITIAL_PRODUCTS: DBProduct[] = [
  {
    id: 'yf-car-01',
    categoryId: 'cat-car-frames',
    title: 'Porsche 911 GT3 RS Neon Night Frame',
    slug: 'porsche-911-gt3-rs-neon-night-frame',
    description:
      'High-definition shot of the legendary GT3 RS bathed in atmospheric Tokyo night lights. Encased in a matte black wooden frame with shatterproof anti-glare acrylic.',
    basePriceINR: 1499,
    compareAtPriceINR: 2199,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
    ],
    availableSizes: ['8x10', '12x18', '16x24', '20x30'],
    availableMouldings: ['Black Wood', 'White Minimalist', 'Natural Oak', 'Walnut'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 45,
    createdAt: '2026-11-15T00:00:00.000Z',
    updatedAt: '2026-11-21T00:00:00.000Z',
  },
  {
    id: 'yf-car-02',
    categoryId: 'cat-car-frames',
    title: 'Vintage BMW E30 M3 Heritage Edition',
    slug: 'vintage-bmw-e30-m3-heritage-edition',
    description:
      'Iconic box-flare silhouette of the E30 M3 in classic Alpine White. Printed on archival 300 GSM lustre paper and mounted with pure white border matting.',
    basePriceINR: 1599,
    compareAtPriceINR: 2299,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
    ],
    availableSizes: ['8x10', '12x18', '16x24', '20x30'],
    availableMouldings: ['Black Wood', 'Natural Oak', 'Walnut'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 30,
    createdAt: '2026-11-16T00:00:00.000Z',
    updatedAt: '2026-11-21T00:00:00.000Z',
  },
  {
    id: 'yf-aes-01',
    categoryId: 'cat-aesthetic-frames',
    title: 'Scandinavian Botanical Fern Minimalist Frame',
    slug: 'scandinavian-botanical-fern-minimalist-frame',
    description:
      'Deep emerald forest fern captured in macro detail. Ideal for minimalist, Japandi, and modern living spaces.',
    basePriceINR: 1199,
    compareAtPriceINR: 1799,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    ],
    availableSizes: ['8x10', '12x18', '16x24'],
    availableMouldings: ['White Minimalist', 'Natural Oak'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 60,
    createdAt: '2026-11-17T00:00:00.000Z',
    updatedAt: '2026-11-21T00:00:00.000Z',
  },
  {
    id: 'yf-cust-01',
    categoryId: 'cat-custom-frames',
    title: 'Bespoke Studio Custom Frame (Upload Your Photo)',
    slug: 'bespoke-studio-custom-frame',
    description:
      'Upload your personal high-resolution photograph. Handcrafted with precision joinery and museum glass.',
    basePriceINR: 1299,
    compareAtPriceINR: 1899,
    images: [
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=85',
    ],
    availableSizes: ['8x10', '12x18', '16x24', '20x30', '24x36'],
    availableMouldings: ['Black Wood', 'White Minimalist', 'Natural Oak', 'Walnut', 'Gold Leaf'],
    isCustomizable: true,
    isActive: true,
    stockQuantity: 999,
    createdAt: '2026-11-18T00:00:00.000Z',
    updatedAt: '2026-11-21T00:00:00.000Z',
  },
]

const INITIAL_HOMEPAGE_SECTIONS: DBHomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'Artisanal Frames. Timeless Preservation.',
    subtitle:
      'Bespoke solid wood framing for automotive photography, contemporary minimalist art, and your most treasured personal memories. Handcrafted with museum-grade precision in India.',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    badgeText: "India's Premier Framing Atelier",
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Shop by Category',
    subtitle: 'Explore our specialized frame and artwork collections',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 1,
  },
  {
    id: 'sec-bestsellers',
    type: 'bestsellers',
    title: 'Curated for Modern Spaces',
    subtitle: 'Popular automotive legends and serene aesthetic studies',
    isActive: true,
    backgroundStyle: 'white',
    order: 2,
  },
  {
    id: 'sec-customizer',
    type: 'customizer_banner',
    title: 'Customize Your Own Frame Live',
    subtitle:
      'Upload personal photos, choose from 5 handcrafted hardwood mouldings, custom matting and museum-grade anti-glare glass.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 3,
  },
  {
    id: 'sec-why-us',
    type: 'why_choose_us',
    title: 'Why Discerning Collectors Choose Us',
    subtitle:
      'Every frame is assembled by master framers with meticulous attention to joint geometry, colour depth, and preservation.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 4,
  },
  {
    id: 'sec-instagram',
    type: 'instagram',
    title: 'Follow Our Journey on Instagram',
    subtitle: '#YourFramiesInTheWild',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 5,
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Receive ₹200 Off Your First Order',
    subtitle:
      'Subscribe for early access to limited edition automotive prints, seasonal releases, and private studio promotions.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 6,
  },
]

const INITIAL_SITE_SETTINGS: DBSiteSettings = {
  brandName: 'Your Framies',
  tagline: 'Artisanal Wall Framing',
  logoText: 'Your Framies',
  announcementText:
    '✨ Handcrafted Museum-Quality Frames • Free Express Shipping on Orders Above ₹999 • Use Code WELCOME10 for 10% Off',
  announcementActive: true,
  contactEmail: 'support@yourframies.com',
  contactPhone: '+91 98765 43210',
  workshopAddress: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
  instagramHandle: '@yourframies',
  whatsappNumber: '+919876543210',
  accentColor: '#171717',
  currencySymbol: '₹',
  freeShippingThreshold: 999,
  codHandlingFee: 50,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
}

// Initial Super Admin
const INITIAL_ADMIN: DBAdminUser = {
  id: 'adm-001',
  email: 'admin@yourframies.com',
  // Verified PBKDF2 hash for 'YourFramies2026!'
  passwordHash:
    'pbkdf2$600000$c2VlZFNhbHRZZkhFOGQ=$03b8e1456cb9597fe35ea56e0e0619d2f476473ef01793732021597f6ccbcf5ac932800d610148e6500f066c84ca86410199f613b4245e8ad41e70ffbe21ba7c',
  name: 'Atelier Director',
  role: 'SUPER_ADMIN',
  isActive: true,
  twoFactorEnabled: false,
  failedAttempts: 0,
  createdAt: new Date().toISOString(),
}

// ==============================================================================
// Persistent Store Abstraction (File-backed / In-Memory & Postgres Hybrid)
// ==============================================================================

class DataStore {
  private products: DBProduct[] = [...INITIAL_PRODUCTS]
  private categories: DBCategory[] = [...INITIAL_CATEGORIES]
  private orders: DBOrder[] = []
  private carts: Record<string, { items: any[]; coupon: any; updatedAt: string }> = {}
  private adminUsers: DBAdminUser[] = [{ ...INITIAL_ADMIN }]
  private siteSettings: DBSiteSettings = { ...INITIAL_SITE_SETTINGS }
  private homepageSections: DBHomepageSection[] = [...INITIAL_HOMEPAGE_SECTIONS]
  private draftHomepageSections: DBHomepageSection[] = [...INITIAL_HOMEPAGE_SECTIONS]
  private draftSiteSettings: DBSiteSettings = { ...INITIAL_SITE_SETTINGS }
  private auditLogs: DBAuditLog[] = []
  private pool: Pool | null = null
  private isPostgresConnected = false
  private connectionError: string | null = null
  private initPromise: Promise<void> | null = null
  private storageFilePath: string

  constructor() {
    this.storageFilePath = path.join(process.cwd(), '.server_datastore.json')
    this.loadFromFile()
    this.initPromise = this.initializePostgres()
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8')
        const data = JSON.parse(raw)
        if (data.products) this.products = data.products
        if (data.categories) this.categories = data.categories
        if (data.orders) this.orders = data.orders
        if (data.carts) this.carts = data.carts
        if (data.adminUsers) this.adminUsers = data.adminUsers
        if (data.siteSettings) this.siteSettings = data.siteSettings
        if (data.homepageSections) this.homepageSections = data.homepageSections
        if (data.draftHomepageSections) this.draftHomepageSections = data.draftHomepageSections
        if (data.draftSiteSettings) this.draftSiteSettings = data.draftSiteSettings
        if (data.auditLogs) this.auditLogs = data.auditLogs
      }
    } catch {
      // Ignore file load issues, use in-memory seed
    }
  }

  private saveToFile() {
    try {
      const data = {
        products: this.products,
        categories: this.categories,
        orders: this.orders,
        carts: this.carts,
        adminUsers: this.adminUsers,
        siteSettings: this.siteSettings,
        homepageSections: this.homepageSections,
        draftHomepageSections: this.draftHomepageSections,
        draftSiteSettings: this.draftSiteSettings,
        auditLogs: this.auditLogs,
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch {
      // In read-only serverless environments (AWS/Netlify runtime), in-memory handles requests
    }
  }

  public getDetectedDbUrl(): string | undefined {
    return (
      process.env.DATABASE_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.NETLIFY_DB_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL
    )
  }

  private async initializePostgres() {
    const rawDbUrl = this.getDetectedDbUrl()

    if (!rawDbUrl) {
      this.connectionError = 'No database connection string environment variable found. Set DATABASE_URL in Netlify.'
      this.isPostgresConnected = false
      return
    }

    if (rawDbUrl.includes('ep-sample-pooler') || rawDbUrl.includes('user:password')) {
      this.connectionError = 'Sample placeholder database URL detected. Replace with real Supabase connection string.'
      this.isPostgresConnected = false
      return
    }

    if (rawDbUrl.includes('[') && rawDbUrl.includes(']')) {
      this.connectionError = 'Connection string contains placeholder brackets like [YOUR-PASSWORD]. Please replace with your actual Supabase database password in Netlify environment variables.'
      this.isPostgresConnected = false
      return
    }

    // Candidate URL resolution:
    // Supabase direct URLs (db.<ref>.supabase.co:5432) only have IPv6 AAAA records on DNS.
    // Netlify Functions and AWS Lambda run on IPv4 networks and require the IPv4 connection poolers.
    const candidateUrls: string[] = []

    try {
      const parsed = new URL(rawDbUrl)
      if (parsed.hostname.startsWith('db.') && parsed.hostname.endsWith('.supabase.co')) {
        const projectRef = parsed.hostname.split('.')[1]
        const username = parsed.username.includes('.') ? parsed.username : `postgres.${projectRef}`
        const encodedPass = parsed.password
        const dbName = parsed.pathname || '/postgres'
        const search = parsed.search || '?sslmode=require'

        // Priority 1: Mumbai pooler (ap-south-1) - default for Indian merchants
        candidateUrls.push(
          `postgresql://${username}:${encodedPass}@aws-0-ap-south-1.pooler.supabase.com:6543${dbName}${search}`
        )
        candidateUrls.push(
          `postgresql://${username}:${encodedPass}@aws-0-ap-south-1.pooler.supabase.com:5432${dbName}${search}`
        )
        // Priority 2: Other global pooler regions
        candidateUrls.push(
          `postgresql://${username}:${encodedPass}@aws-0-us-east-1.pooler.supabase.com:6543${dbName}${search}`
        )
        candidateUrls.push(
          `postgresql://${username}:${encodedPass}@aws-0-eu-central-1.pooler.supabase.com:6543${dbName}${search}`
        )
      }
    } catch {
      // Ignore URL parse error, proceed to rawDbUrl
    }

    candidateUrls.push(rawDbUrl)

    let lastError: any = null

    for (const url of candidateUrls) {
      try {
        const cleanUrl = url.replace(/([?&])sslmode=[^&]+(&|$)/, '$1').replace(/[?&]$/, '')
        const pool = new Pool({
          connectionString: cleanUrl,
          ssl: cleanUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          max: 3,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 5000,
        })

        const client = await pool.connect()
        try {
          await this.autoMigrateAndSeed(client)
          this.pool = pool
          this.isPostgresConnected = true
          this.connectionError = null
          console.log(`Successfully connected to PostgreSQL database (${new URL(url).host}) with automatic migrations applied`)
          return
        } finally {
          client.release()
        }
      } catch (err: any) {
        lastError = err
        // If password is wrong or user not found, don't keep polling other regions
        if (err.message && (err.message.includes('password authentication failed') || err.message.includes('Tenant or user not found'))) {
          break
        }
      }
    }

    console.warn('PostgreSQL connection not available, using persistent fallback store:', lastError?.message)
    this.isPostgresConnected = false
    this.connectionError = lastError?.message || 'Unable to connect to PostgreSQL host'
  }

  private async autoMigrateAndSeed(client: any) {
    await client.query(`
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

      CREATE TABLE IF NOT EXISTS customer_carts (
        user_id VARCHAR(100) PRIMARY KEY,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        coupon JSONB,
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
    `)

    await client.query(`
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
    `)
  }

  public async ensureConnected(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise
    }
  }

  public isUsingLiveDatabase(): boolean {
    return this.isPostgresConnected
  }

  public getConnectionError(): string | null {
    return this.connectionError
  }

  public getConnectionDiagnostics() {
    const rawUrl = this.getDetectedDbUrl()
    let maskedUrl: string | null = null
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl)
        maskedUrl = `${parsed.protocol}//${parsed.username}:••••@${parsed.host}${parsed.pathname}`
      } catch {
        maskedUrl = 'Valid connection string present (masked)'
      }
    }

    return {
      isLivePostgres: this.isPostgresConnected,
      mode: this.isPostgresConnected ? 'PostgreSQL Connection Active' : 'Persistent Storage Fallback',
      connectionStringDetected: !!rawUrl,
      detectedUrlMasked: maskedUrl,
      connectionError: this.connectionError,
    }
  }

  // ----------------------------------------------------------------------------
  // Products
  // ----------------------------------------------------------------------------
  public async getProducts(): Promise<DBProduct[]> {
    return this.products
  }

  public async getProductBySlug(slug: string): Promise<DBProduct | undefined> {
    return this.products.find((p) => p.slug === slug || p.id === slug)
  }

  public async saveProduct(product: DBProduct): Promise<DBProduct> {
    const idx = this.products.findIndex((p) => p.id === product.id)
    if (idx >= 0) {
      this.products[idx] = { ...product, updatedAt: new Date().toISOString() }
    } else {
      this.products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    this.saveToFile()
    return product
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const prevLen = this.products.length
    this.products = this.products.filter((p) => p.id !== id && p.slug !== id)
    this.saveToFile()
    return this.products.length < prevLen
  }

  // ----------------------------------------------------------------------------
  // Categories
  // ----------------------------------------------------------------------------
  public async getCategories(): Promise<DBCategory[]> {
    return this.categories
  }

  // ----------------------------------------------------------------------------
  // Orders
  // ----------------------------------------------------------------------------
  public async getOrders(): Promise<DBOrder[]> {
    if (this.pool && this.isPostgresConnected) {
      try {
        const res = await this.pool.query(
          `SELECT id, order_number AS "orderNumber", user_id AS "userId", status,
                  payment_method AS "paymentMethod", payment_status AS "paymentStatus",
                  currency, subtotal_inr AS "subtotalINR", discount_inr AS "discountINR",
                  shipping_fee_inr AS "shippingFeeINR", cod_charge_inr AS "codChargeINR",
                  total_inr AS "totalINR", shipping_address AS "shippingAddress", items,
                  notes, awb_code AS "awbCode", courier_partner AS "courierPartner",
                  created_at AS "createdAt", updated_at AS "updatedAt"
           FROM orders
           ORDER BY created_at DESC`
        )
        if (res.rows.length > 0) {
          return res.rows.map((row) => ({
            ...row,
            subtotalINR: Number(row.subtotalINR),
            discountINR: Number(row.discountINR),
            shippingFeeINR: Number(row.shippingFeeINR),
            codChargeINR: Number(row.codChargeINR),
            totalINR: Number(row.totalINR),
          })) as DBOrder[]
        }
      } catch (err) {
        console.warn('Postgres getOrders error, using fallback:', err)
      }
    }
    return this.orders
  }

  public async getOrderByNumber(orderNumber: string): Promise<DBOrder | undefined> {
    if (this.pool && this.isPostgresConnected) {
      try {
        const res = await this.pool.query(
          `SELECT id, order_number AS "orderNumber", user_id AS "userId", status,
                  payment_method AS "paymentMethod", payment_status AS "paymentStatus",
                  currency, subtotal_inr AS "subtotalINR", discount_inr AS "discountINR",
                  shipping_fee_inr AS "shippingFeeINR", cod_charge_inr AS "codChargeINR",
                  total_inr AS "totalINR", shipping_address AS "shippingAddress", items,
                  notes, awb_code AS "awbCode", courier_partner AS "courierPartner",
                  created_at AS "createdAt", updated_at AS "updatedAt"
           FROM orders
           WHERE order_number = $1 OR id = $1
           LIMIT 1`,
          [orderNumber]
        )
        if (res.rows.length > 0) {
          const row = res.rows[0]
          return {
            ...row,
            subtotalINR: Number(row.subtotalINR),
            discountINR: Number(row.discountINR),
            shippingFeeINR: Number(row.shippingFeeINR),
            codChargeINR: Number(row.codChargeINR),
            totalINR: Number(row.totalINR),
          } as DBOrder
        }
      } catch (err) {
        console.warn('Postgres getOrderByNumber error, using fallback:', err)
      }
    }
    return this.orders.find((o) => o.orderNumber === orderNumber || o.id === orderNumber)
  }

  public async getOrdersByCustomer(query: string): Promise<DBOrder[]> {
    const clean = query.trim()
    if (this.pool && this.isPostgresConnected) {
      try {
        const res = await this.pool.query(
          `SELECT id, order_number AS "orderNumber", user_id AS "userId", status,
                  payment_method AS "paymentMethod", payment_status AS "paymentStatus",
                  currency, subtotal_inr AS "subtotalINR", discount_inr AS "discountINR",
                  shipping_fee_inr AS "shippingFeeINR", cod_charge_inr AS "codChargeINR",
                  total_inr AS "totalINR", shipping_address AS "shippingAddress", items,
                  notes, awb_code AS "awbCode", courier_partner AS "courierPartner",
                  created_at AS "createdAt", updated_at AS "updatedAt"
           FROM orders
           WHERE user_id = $1 OR (shipping_address->>'phone') = $1 OR order_number = $1
           ORDER BY created_at DESC`,
          [clean]
        )
        if (res.rows.length > 0) {
          return res.rows.map((row) => ({
            ...row,
            subtotalINR: Number(row.subtotalINR),
            discountINR: Number(row.discountINR),
            shippingFeeINR: Number(row.shippingFeeINR),
            codChargeINR: Number(row.codChargeINR),
            totalINR: Number(row.totalINR),
          })) as DBOrder[]
        }
      } catch (err) {
        console.warn('Postgres getOrdersByCustomer error, using fallback:', err)
      }
    }
    return this.orders.filter(
      (o) => o.userId === clean || o.shippingAddress?.phone === clean || o.orderNumber === clean
    )
  }

  public async createOrder(order: DBOrder): Promise<DBOrder> {
    this.orders.unshift(order)
    this.saveToFile()

    if (this.pool && this.isPostgresConnected) {
      try {
        await this.pool.query(
          `INSERT INTO orders (
            id, order_number, user_id, status, payment_method, payment_status,
            currency, subtotal_inr, discount_inr, shipping_fee_inr, cod_charge_inr,
            total_inr, shipping_address, items, notes, awb_code, courier_partner,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            payment_status = EXCLUDED.payment_status,
            updated_at = NOW()`,
          [
            order.id,
            order.orderNumber,
            order.userId || null,
            order.status,
            order.paymentMethod,
            order.paymentStatus,
            order.currency || 'INR',
            order.subtotalINR,
            order.discountINR || 0,
            order.shippingFeeINR || 0,
            order.codChargeINR || 0,
            order.totalINR,
            JSON.stringify(order.shippingAddress),
            JSON.stringify(order.items),
            order.notes || null,
            order.awbCode || null,
            order.courierPartner || null,
            order.createdAt,
            order.updatedAt,
          ]
        )
      } catch (err) {
        console.warn('Postgres createOrder error, saved in fallback store:', err)
      }
    }
    return order
  }

  public async updateOrderStatus(
    orderNumber: string,
    status: DBOrder['status'],
    details?: { awbCode?: string; courierPartner?: DBOrder['courierPartner']; paymentStatus?: DBOrder['paymentStatus'] }
  ): Promise<DBOrder | undefined> {
    const order = this.orders.find((o) => o.orderNumber === orderNumber || o.id === orderNumber)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
      if (details?.awbCode) order.awbCode = details.awbCode
      if (details?.courierPartner) order.courierPartner = details.courierPartner
      if (details?.paymentStatus) order.paymentStatus = details.paymentStatus
      this.saveToFile()
    }

    if (this.pool && this.isPostgresConnected) {
      try {
        await this.pool.query(
          `UPDATE orders
           SET status = $1,
               awb_code = COALESCE($2, awb_code),
               courier_partner = COALESCE($3, courier_partner),
               payment_status = COALESCE($4, payment_status),
               updated_at = NOW()
           WHERE order_number = $5 OR id = $5`,
          [status, details?.awbCode || null, details?.courierPartner || null, details?.paymentStatus || null, orderNumber]
        )
      } catch (err) {
        console.warn('Postgres updateOrderStatus error:', err)
      }
    }
    return order
  }

  // ----------------------------------------------------------------------------
  // Customer Cart (Persistent Across Sessions & Devices)
  // ----------------------------------------------------------------------------
  public async getCart(userId: string): Promise<{ items: any[]; coupon: any } | null> {
    if (this.pool && this.isPostgresConnected) {
      try {
        const res = await this.pool.query(
          'SELECT items, coupon FROM customer_carts WHERE user_id = $1 LIMIT 1',
          [userId]
        )
        if (res.rows.length > 0) {
          return {
            items: res.rows[0].items || [],
            coupon: res.rows[0].coupon || null,
          }
        }
      } catch (err) {
        console.warn('Postgres getCart error, using fallback:', err)
      }
    }
    const local = this.carts[userId]
    return local ? { items: local.items, coupon: local.coupon } : null
  }

  public async saveCart(userId: string, items: any[], coupon: any = null): Promise<void> {
    const updatedAt = new Date().toISOString()
    this.carts[userId] = { items, coupon, updatedAt }
    this.saveToFile()

    if (this.pool && this.isPostgresConnected) {
      try {
        await this.pool.query(
          `INSERT INTO customer_carts (user_id, items, coupon, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (user_id)
           DO UPDATE SET items = EXCLUDED.items, coupon = EXCLUDED.coupon, updated_at = NOW()`,
          [userId, JSON.stringify(items), coupon ? JSON.stringify(coupon) : null]
        )
      } catch (err) {
        console.warn('Postgres saveCart error:', err)
      }
    }
  }

  public async clearCart(userId: string): Promise<void> {
    delete this.carts[userId]
    this.saveToFile()

    if (this.pool && this.isPostgresConnected) {
      try {
        await this.pool.query('DELETE FROM customer_carts WHERE user_id = $1', [userId])
      } catch (err) {
        console.warn('Postgres clearCart error:', err)
      }
    }
  }

  // ----------------------------------------------------------------------------
  // Admin Users & Auth
  // ----------------------------------------------------------------------------
  public async getAdminByEmail(email: string): Promise<DBAdminUser | undefined> {
    return this.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  public async getAdminById(id: string): Promise<DBAdminUser | undefined> {
    return this.adminUsers.find((u) => u.id === id)
  }

  public async getAllAdmins(): Promise<DBAdminUser[]> {
    return this.adminUsers
  }

  public async saveAdminUser(user: DBAdminUser): Promise<DBAdminUser> {
    const idx = this.adminUsers.findIndex((u) => u.id === user.id)
    if (idx >= 0) {
      this.adminUsers[idx] = user
    } else {
      this.adminUsers.push(user)
    }
    this.saveToFile()
    return user
  }

  public async deleteAdminUser(id: string): Promise<boolean> {
    const prev = this.adminUsers.length
    this.adminUsers = this.adminUsers.filter((u) => u.id !== id)
    this.saveToFile()
    return this.adminUsers.length < prev
  }

  // ----------------------------------------------------------------------------
  // Site Settings & Visual Homepage CMS
  // ----------------------------------------------------------------------------
  public async getSettings(): Promise<DBSiteSettings> {
    return this.siteSettings
  }

  public async updateSettings(newSettings: Partial<DBSiteSettings>): Promise<DBSiteSettings> {
    this.siteSettings = {
      ...this.siteSettings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }
    this.saveToFile()
    return this.siteSettings
  }

  public async getHomepageSections(): Promise<DBHomepageSection[]> {
    return this.homepageSections.sort((a, b) => a.order - b.order)
  }

  public async getDraftHomepageSections(): Promise<DBHomepageSection[]> {
    return this.draftHomepageSections.sort((a, b) => a.order - b.order)
  }

  public async updateDraftHomepageSections(sections: DBHomepageSection[]): Promise<void> {
    this.draftHomepageSections = sections
    this.saveToFile()
  }

  public async publishDraftHomepage(): Promise<void> {
    this.homepageSections = [...this.draftHomepageSections]
    this.siteSettings = { ...this.draftSiteSettings, updatedAt: new Date().toISOString() }
    this.saveToFile()
  }

  // ----------------------------------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------------------------------
  public async saveAuditLog(log: DBAuditLog): Promise<void> {
    this.auditLogs.unshift(log)
    if (this.auditLogs.length > 500) this.auditLogs.pop()
    this.saveToFile()
  }

  public async getAuditLogs(): Promise<DBAuditLog[]> {
    return this.auditLogs
  }
}

// Global Singleton Instance
export const db = new DataStore()
