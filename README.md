# Your Framies — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce web application engineered for **Your Framies**, India's premier artisanal wall framing brand. Handcrafted with React 19, TypeScript, Tailwind CSS v4, Netlify serverless functions, PostgreSQL architecture, Razorpay payment processing, and multi-carrier Indian logistics (Delhivery One, Shiprocket, NimbusPost).

---

## 🌟 Key Features

### 1. Storefront & Aesthetic Design
* **Minimalist Luxury Design**: High-contrast typography (Cormorant Garamond & Inter), whitespace-focused layout, subtle animations, and zero clutter.
* **Category Catalog**: Automotive frames (Porsche, BMW, JDM), Scandinavian aesthetic prints, personalized memory collages, Spotify soundwave keepsakes, posters, and gallery wall art.
* **Search & Filter Engine**: Instant search autocomplete, category pills, dimensions filter, and dynamic price sorting.

### 2. Interactive Bespoke 2D Customizer
* **Client-Side Visualizer**: Real-time canvas rendering of uploaded customer photographs.
* **Moulding Selection**: Matte Black Wood, Natural White, Warm Oak, Rich Walnut, and Vintage Gold Leaf.
* **Matboard & Glazing Options**: Acid-free border mats (Pure White, Off-White, Jet Black, None) and optical-grade acrylic vs Museum Anti-Glare UV glass.
* **Live Dynamic Sizing & Pricing**: 8x10", 12x18", 16x24", 20x30", and 24x36".

### 3. Shopping Bag & Checkout
* **Persistent Bag & Wishlist**: Client state synchronized with localStorage.
* **Smart Coupon Engine**: Percentage & flat discounts with minimum order thresholds (`WELCOME10`, `FRAMIES100`, `FREESHIP`).
* **Indian Postal PIN Checker**: Validates 6-digit Indian postal codes, calculates estimated express transit days, and verifies COD eligibility.
* **Payment Gateways**:
  * **Prepaid via Razorpay**: Official Orders API creation, checkout modal, and HMAC-SHA256 signature verification.
  * **Cash on Delivery (COD)**: Doorstep cash settlement with phone OTP verification simulation and handling fee.

### 4. Logistics & Order Tracking
* **Carrier Integrations**: Modular integration logic for **Delhivery One**, **Shiprocket**, and **NimbusPost**.
* **Real-Time Order Tracker**: Dedicated `/track-order` portal showing fulfillment milestones (Order Confirmed → Printing → Moulding & Assembly → Dispatched via Delhivery → Out for Delivery → Delivered).

### 5. Admin Control Center (`/admin`)
* **KPI Metrics**: Real-time computation of Total Gross Revenue, Total Orders, Average Order Value (AOV), and Prepaid vs COD ratio.
* **Interactive Analytics**: Monthly sales trend chart and payment mix chart powered by Recharts.
* **Catalog Management**: Add, view, edit price/stock, toggle active state, and delete products.
* **Order Management**: Search, filter by status, update fulfillment state, view consignee addresses, and export orders to CSV.
* **Coupons & Logistics Settings**: Add discount codes and configure courier API keys.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite 8, Lucide React, Recharts |
| **State & Forms** | React Context, TanStack Query, React Hook Form, Zod |
| **Backend & Serverless** | Netlify Functions (TypeScript), Node.js v26 LTS |
| **Database** | PostgreSQL 14+ (Compatible with Neon, Supabase, AWS RDS) |
| **Payments** | Razorpay Checkout SDK & HMAC-SHA256 Server Verification |
| **Testing & Linting** | Vitest, React Testing Library, JSDOM, Prettier, ESLint |

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v20+ or v26 LTS
* **npm**: v10+

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/your-username/yourframies.git
cd yourframies

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```powershell
cp .env.example .env.local
```
Fill in your credentials:
```ini
# Client Variables
VITE_SITE_URL=http://localhost:5173
VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere

# Server Secrets (Netlify Functions)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
RAZORPAY_KEY_SECRET=YourSecretHere
DELHIVERY_API_TOKEN=YourTokenHere
```

### 4. Running the Development Server
```powershell
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Running Tests & Production Build
```powershell
# Run Vitest test suite
npm run test

# Compile production bundle
npm run build
```

---

## 📦 Database & Migrations

The database schema is defined in [database/schema.sql](database/schema.sql).

To apply migrations against your PostgreSQL instance:
```powershell
# Ensure DATABASE_URL is set in your environment
node -e "require('./database/migrate.ts').runMigrations()"
```

---

## 🌐 Netlify Deployment

1. Connect your repository to Netlify.
2. Build Settings:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
   * **Functions directory**: `netlify/functions`
3. Configure environment variables in Netlify Dashboard:
   * `DATABASE_URL`
   * `RAZORPAY_KEY_ID`
   * `RAZORPAY_KEY_SECRET`
   * `DELHIVERY_API_TOKEN`

---

## 📄 License
Commercial proprietary software. Crafted with pride in India for **Your Framies**.
