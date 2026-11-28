import fs from 'node:fs'
import path from 'node:path'
import { Pool as PgPool } from 'pg'
import { Pool as NeonPool } from '@neondatabase/serverless'
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

const INITIAL_CATEGORIES: DBCategory[] = []

const INITIAL_PRODUCTS: DBProduct[] = []

const LEGACY_DEFAULT_CATEGORY_IDS = [
  'cat-car-frames',
  'cat-aesthetic-frames',
  'cat-personalised-frames',
  'cat-custom-frames',
  'cat-posters',
  'cat-wall-art',
]

const LEGACY_DEFAULT_PRODUCT_IDS = [
  'yf-car-01',
  'yf-car-02',
  'yf-car-03',
  'yf-aes-01',
  'yf-aes-02',
  'yf-pers-01',
  'yf-pers-02',
  'yf-cust-01',
  'yf-post-01',
  'yf-wall-01',
]

const INITIAL_HOMEPAGE_SECTIONS: DBHomepageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    title: 'A4 Wall Art & Custom Photo Frames.',
    subtitle:
      'Ready-to-hang A4 frames featuring iconic supercar photography, clean botanical prints, and your own personal memories — in Deep Black or Minimalist White.',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    badgeText: 'Standard A4 Frames • Black & White',
  },
  {
    id: 'sec-categories',
    type: 'categories',
    title: 'Shop by Category',
    subtitle: 'Car frames, minimalist prints, and personalised photo gifts',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 1,
  },
  {
    id: 'sec-bestsellers',
    type: 'bestsellers',
    title: 'Popular A4 Frames',
    subtitle: 'Automotive legends, calm interiors, and custom photo keepsakes',
    isActive: true,
    backgroundStyle: 'white',
    order: 2,
  },
  {
    id: 'sec-customizer',
    type: 'customizer_banner',
    title: 'Frame Your Own Photo Live',
    subtitle:
      'Upload your photo and preview how it looks in our A4 Deep Black or Minimalist White frame before you order.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 3,
  },
  {
    id: 'sec-why-us',
    type: 'why_choose_us',
    title: 'Built Clean. Ready to Hang.',
    subtitle:
      'Consistent A4 sizing, clean finishes, and safe doorstep delivery across India.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 4,
  },
  {
    id: 'sec-instagram',
    type: 'instagram',
    title: 'Follow Us on Instagram',
    subtitle: '#YourFramies',
    isActive: true,
    backgroundStyle: 'neutral-900',
    order: 5,
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter',
    title: 'Get ₹200 Off Your First Order',
    subtitle:
      'Sign up for new automotive frame drops and member offers.',
    isActive: true,
    backgroundStyle: 'neutral-50',
    order: 6,
  },
]

const INITIAL_SITE_SETTINGS: DBSiteSettings = {
  brandName: 'Your Framies',
  tagline: 'A4 Wall Art & Photo Frames',
  logoText: 'Your Framies',
  announcementText:
    'A4 Frames in Deep Black & Minimalist White • Free Shipping Above ₹999 • Code WELCOME10 for 10% Off',
  announcementActive: true,
  contactEmail: 'silentlifeswiss@gmail.com',
  contactPhone: '+91 79009 43025',
  workshopAddress: 'New Delhi, India',
  instagramHandle: '@yourframies',
  whatsappNumber: '+917900943025',
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
  private pool: any = null
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
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.NETLIFY_DB_URL
    )
  }

  private async initializePostgres() {
    const rawDbUrl = this.getDetectedDbUrl()

    if (!rawDbUrl) {
      this.connectionError = 'No database connection string environment variable found. Set DATABASE_URL or POSTGRES_URL in Vercel / Netlify.'
      this.isPostgresConnected = false
      return
    }

    if (rawDbUrl.includes('ep-sample-pooler') || rawDbUrl.includes('user:password')) {
      this.connectionError = 'Sample placeholder database URL detected. Replace with real Neon / Supabase connection string.'
      this.isPostgresConnected = false
      return
    }

    if (rawDbUrl.includes('[') && rawDbUrl.includes(']')) {
      this.connectionError = 'Connection string contains placeholder brackets like [YOUR-PASSWORD]. Please replace with your actual database password.'
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
        const isNeon = url.includes('neon.tech')
        const PoolClass = isNeon ? NeonPool : PgPool
        const cleanUrl = isNeon
          ? url
          : url.replace(/([?&])sslmode=[^&]+(&|$)/, '$1').replace(/[?&]$/, '')
        const pool = new (PoolClass as any)({
          connectionString: cleanUrl,
          ssl: cleanUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          max: 3,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 10000,
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

    // One-time cleanup: remove legacy hardcoded placeholder catalog from Neon Postgres
    // so only categories and products created in the Admin Panel are displayed.
    const cleanupFlag = await client.query(
      `SELECT setting_value FROM site_settings WHERE setting_key = 'removed_default_catalog_v1' LIMIT 1`
    )
    if (cleanupFlag.rows.length === 0) {
      await client.query(`DELETE FROM products WHERE id = ANY($1::text[])`, [LEGACY_DEFAULT_PRODUCT_IDS])
      await client.query(`DELETE FROM categories WHERE id = ANY($1::text[])`, [LEGACY_DEFAULT_CATEGORY_IDS])
      await client.query(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES ('removed_default_catalog_v1', 'true'::jsonb)
         ON CONFLICT (setting_key) DO NOTHING`
      )
    }
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
    if (this.pool && this.isPostgresConnected) {
      const res = await this.pool.query(
        `SELECT id, category_id AS "categoryId", title, slug, description,
                base_price_inr AS "basePriceINR", compare_at_price_inr AS "compareAtPriceINR",
                images, available_sizes AS "availableSizes", available_mouldings AS "availableMouldings",
                is_customizable AS "isCustomizable", is_active AS "isActive",
                stock_quantity AS "stockQuantity", created_at AS "createdAt", updated_at AS "updatedAt"
         FROM products
         ORDER BY created_at DESC`
      )
      return res.rows.map((row: any) => ({
        ...row,
        basePriceINR: Number(row.basePriceINR),
        compareAtPriceINR: row.compareAtPriceINR ? Number(row.compareAtPriceINR) : undefined,
        availableSizes: ['A4'],
        availableMouldings: ['Deep Black', 'Minimalist White'],
      }))
    }
    return this.products.map((p) => ({
      ...p,
      availableSizes: ['A4'],
      availableMouldings: ['Deep Black', 'Minimalist White'],
    }))
  }

  public async getProductBySlug(slug: string): Promise<DBProduct | undefined> {
    if (this.pool && this.isPostgresConnected) {
      const res = await this.pool.query(
        `SELECT id, category_id AS "categoryId", title, slug, description,
                base_price_inr AS "basePriceINR", compare_at_price_inr AS "compareAtPriceINR",
                images, available_sizes AS "availableSizes", available_mouldings AS "availableMouldings",
                is_customizable AS "isCustomizable", is_active AS "isActive",
                stock_quantity AS "stockQuantity", created_at AS "createdAt", updated_at AS "updatedAt"
         FROM products
         WHERE slug = $1 OR id = $1
         LIMIT 1`,
        [slug]
      )
      if (res.rows.length > 0) {
        const row = res.rows[0]
        return {
          ...row,
          basePriceINR: Number(row.basePriceINR),
          compareAtPriceINR: row.compareAtPriceINR ? Number(row.compareAtPriceINR) : undefined,
          availableSizes: ['A4'],
          availableMouldings: ['Deep Black', 'Minimalist White'],
        }
      }
      return undefined
    }
    const found = this.products.find((p) => p.slug === slug || p.id === slug)
    return found
      ? {
          ...found,
          availableSizes: ['A4'],
          availableMouldings: ['Deep Black', 'Minimalist White'],
        }
      : undefined
  }

  public async saveProduct(product: DBProduct): Promise<DBProduct> {
    const normalized: DBProduct = {
      ...product,
      availableSizes: ['A4'],
      availableMouldings: ['Deep Black', 'Minimalist White'],
      updatedAt: new Date().toISOString(),
    }

    if (this.pool && this.isPostgresConnected) {
      // Prevent unique slug collisions across different product IDs
      const slugCheck = await this.pool.query(
        `SELECT id FROM products WHERE slug = $1 AND id <> $2 LIMIT 1`,
        [normalized.slug, normalized.id]
      )
      if (slugCheck.rows.length > 0) {
        normalized.slug = `${normalized.slug}-${Date.now().toString().slice(-4)}`
      }

      const res = await this.pool.query(
        `INSERT INTO products (
           id, category_id, title, slug, description, base_price_inr, compare_at_price_inr,
           images, available_sizes, available_mouldings, is_customizable, is_active, stock_quantity, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, $13, NOW())
         ON CONFLICT (id) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           base_price_inr = EXCLUDED.base_price_inr,
           compare_at_price_inr = EXCLUDED.compare_at_price_inr,
           images = EXCLUDED.images,
           available_sizes = EXCLUDED.available_sizes,
           available_mouldings = EXCLUDED.available_mouldings,
           is_customizable = EXCLUDED.is_customizable,
           is_active = EXCLUDED.is_active,
           stock_quantity = EXCLUDED.stock_quantity,
           updated_at = NOW()
         RETURNING id, category_id AS "categoryId", title, slug, description,
                   base_price_inr AS "basePriceINR", compare_at_price_inr AS "compareAtPriceINR",
                   images, available_sizes AS "availableSizes", available_mouldings AS "availableMouldings",
                   is_customizable AS "isCustomizable", is_active AS "isActive",
                   stock_quantity AS "stockQuantity", created_at AS "createdAt", updated_at AS "updatedAt"`,
        [
          normalized.id,
          normalized.categoryId || null,
          normalized.title,
          normalized.slug,
          normalized.description || '',
          normalized.basePriceINR,
          normalized.compareAtPriceINR || null,
          JSON.stringify(normalized.images || []),
          JSON.stringify(normalized.availableSizes),
          JSON.stringify(normalized.availableMouldings),
          normalized.isCustomizable ?? true,
          normalized.isActive ?? true,
          normalized.stockQuantity ?? 25,
        ]
      )
      const saved = {
        ...res.rows[0],
        basePriceINR: Number(res.rows[0].basePriceINR),
        compareAtPriceINR: res.rows[0].compareAtPriceINR ? Number(res.rows[0].compareAtPriceINR) : undefined,
      }
      const idx = this.products.findIndex((p) => p.id === saved.id)
      if (idx >= 0) this.products[idx] = saved
      else this.products.unshift(saved)
      this.saveToFile()
      return saved
    }

    const slugTaken = this.products.some((p) => p.slug === normalized.slug && p.id !== normalized.id)
    if (slugTaken) {
      normalized.slug = `${normalized.slug}-${Date.now().toString().slice(-4)}`
    }

    const idx = this.products.findIndex((p) => p.id === normalized.id)
    if (idx >= 0) {
      this.products[idx] = normalized
    } else {
      this.products.unshift({
        ...normalized,
        createdAt: normalized.createdAt || new Date().toISOString(),
      })
    }
    this.saveToFile()
    return normalized
  }

  public async deleteProduct(id: string): Promise<boolean> {
    if (this.pool && this.isPostgresConnected) {
      const res = await this.pool.query(`DELETE FROM products WHERE id = $1 OR slug = $1`, [id])
      this.products = this.products.filter((p) => p.id !== id && p.slug !== id)
      this.saveToFile()
      return (res.rowCount || 0) > 0
    }

    const prevLen = this.products.length
    this.products = this.products.filter((p) => p.id !== id && p.slug !== id)
    this.saveToFile()
    return this.products.length < prevLen
  }

  // ----------------------------------------------------------------------------
  // Categories
  // ----------------------------------------------------------------------------
  public async getCategories(): Promise<DBCategory[]> {
    if (this.pool && this.isPostgresConnected) {
      const res = await this.pool.query(
        `SELECT id, name, slug, description, image_url AS "imageUrl", display_order AS "displayOrder", is_active AS "isActive"
         FROM categories
         WHERE is_active = true
         ORDER BY display_order ASC, created_at ASC`
      )
      return res.rows
    }
    return this.categories
  }

  public async saveCategory(cat: DBCategory): Promise<DBCategory> {
    const toSave = { ...cat }

    if (this.pool && this.isPostgresConnected) {
      const slugCheck = await this.pool.query(
        `SELECT id FROM categories WHERE slug = $1 AND id <> $2 LIMIT 1`,
        [toSave.slug, toSave.id]
      )
      if (slugCheck.rows.length > 0) {
        toSave.slug = `${toSave.slug}-${Date.now().toString().slice(-4)}`
      }

      const res = await this.pool.query(
        `INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           image_url = EXCLUDED.image_url,
           display_order = EXCLUDED.display_order,
           is_active = EXCLUDED.is_active
         RETURNING id, name, slug, description, image_url AS "imageUrl", display_order AS "displayOrder", is_active AS "isActive"`,
        [
          toSave.id,
          toSave.name,
          toSave.slug,
          toSave.description || '',
          toSave.imageUrl || '',
          toSave.displayOrder || 0,
          toSave.isActive ?? true,
        ]
      )
      const saved = res.rows[0]
      const idx = this.categories.findIndex((c) => c.id === saved.id)
      if (idx >= 0) this.categories[idx] = saved
      else this.categories.push(saved)
      this.saveToFile()
      return saved
    }

    const slugTaken = this.categories.some((c) => c.slug === toSave.slug && c.id !== toSave.id)
    if (slugTaken) {
      toSave.slug = `${toSave.slug}-${Date.now().toString().slice(-4)}`
    }

    const idx = this.categories.findIndex((c) => c.id === toSave.id)
    if (idx >= 0) {
      this.categories[idx] = { ...this.categories[idx], ...toSave }
    } else {
      this.categories.push(toSave)
    }
    this.saveToFile()
    return toSave
  }

  public async deleteCategory(id: string): Promise<boolean> {
    if (this.pool && this.isPostgresConnected) {
      const res = await this.pool.query(`DELETE FROM categories WHERE id = $1 OR slug = $1`, [id])
      this.categories = this.categories.filter((c) => c.id !== id && c.slug !== id)
      this.saveToFile()
      return (res.rowCount || 0) > 0
    }

    const prevLen = this.categories.length
    this.categories = this.categories.filter((c) => c.id !== id && c.slug !== id)
    this.saveToFile()
    return this.categories.length < prevLen
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
          return res.rows.map((row: any) => ({
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
          return res.rows.map((row: any) => ({
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
