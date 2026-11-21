// ==============================================================================
// yourframies - Frontend API Client
// Connects UI to Netlify Serverless Functions & Backend APIs
// ==============================================================================

const API_BASE = '/api'

function getAuthHeader(): Record<string, string> {
  try {
    const sessionRaw = sessionStorage.getItem('yourframies_admin_jwt')
    if (sessionRaw) {
      return { Authorization: `Bearer ${sessionRaw}` }
    }
  } catch {
    // Ignore
  }
  return {}
}

export const api = {
  // ----------------------------------------------------------------------------
  // Health
  // ----------------------------------------------------------------------------
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`)
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Products & Categories
  // ----------------------------------------------------------------------------
  async getProducts(category?: string) {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : ''
    const res = await fetch(`${API_BASE}/products${query}`)
    return res.json()
  },

  async getProduct(slug: string) {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`)
    return res.json()
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`)
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Visual CMS & Homepage
  // ----------------------------------------------------------------------------
  async getHomepageContent() {
    const res = await fetch(`${API_BASE}/homepage`)
    return res.json()
  },

  async getSiteSettings() {
    const res = await fetch(`${API_BASE}/settings`)
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Shipping & Logistics
  // ----------------------------------------------------------------------------
  async checkPincode(pincode: string, isCod = false) {
    const res = await fetch(`${API_BASE}/shipping/check-pincode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode, isCod }),
    })
    return res.json()
  },

  async calculateRates(items: any[], subtotalINR: number, pincode: string) {
    const res = await fetch(`${API_BASE}/shipping/calculate-rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, subtotalINR, pincode }),
    })
    return res.json()
  },

  async trackShipment(awbCode: string) {
    const res = await fetch(`${API_BASE}/shipping/track/${encodeURIComponent(awbCode)}`)
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Orders & Checkout
  // ----------------------------------------------------------------------------
  async createOrder(payload: {
    items: any[]
    shippingAddress: any
    paymentMethod: 'PREPAID_RAZORPAY' | 'COD' | 'PARTIAL_COD'
    notes?: string
    couponCode?: string
  }) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  async getOrder(orderNumber: string) {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderNumber)}`)
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Razorpay Payments
  // ----------------------------------------------------------------------------
  async createRazorpayOrder(amountINR: number, receipt?: string, orderNumber?: string) {
    const res = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountINR, receipt, orderNumber }),
    })
    return res.json()
  },

  async verifyRazorpayPayment(payload: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    orderNumber?: string
  }) {
    const res = await fetch(`${API_BASE}/payments/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.json()
  },

  // ----------------------------------------------------------------------------
  // Admin Operations (Protected by JWT)
  // ----------------------------------------------------------------------------
  async adminLogin(email: string, password: string) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success && data.token) {
      sessionStorage.setItem('yourframies_admin_jwt', data.token)
    }
    return data
  },

  async adminGetMe() {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },

  async adminGetOrders() {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },

  async adminUpdateOrderStatus(
    orderNumber: string,
    status: string,
    details?: { awbCode?: string; courierPartner?: string; paymentStatus?: string }
  ) {
    const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(orderNumber)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, ...details }),
    })
    return res.json()
  },

  async adminBookShipment(orderNumber: string) {
    const res = await fetch(`${API_BASE}/admin/shipping/book-shipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ orderNumber }),
    })
    return res.json()
  },

  async adminSaveProduct(product: any) {
    const isEdit = Boolean(product.id && !product.id.startsWith('yf-new'))
    const endpoint = isEdit ? `${API_BASE}/admin/products/${product.id}` : `${API_BASE}/admin/products`
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(product),
    })
    return res.json()
  },

  async adminDeleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },

  async adminGetDraftHomepage() {
    const res = await fetch(`${API_BASE}/admin/homepage/draft`, {
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },

  async adminUpdateDraftSections(sections: any[]) {
    const res = await fetch(`${API_BASE}/admin/homepage/sections`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ sections }),
    })
    return res.json()
  },

  async adminPublishHomepage() {
    const res = await fetch(`${API_BASE}/admin/homepage/publish`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },

  async adminUpdateSettings(settings: any) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    })
    return res.json()
  },

  async adminRefund(paymentId: string, amountINR: number, reason: string) {
    const res = await fetch(`${API_BASE}/admin/payments/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ paymentId, amountINR, reason }),
    })
    return res.json()
  },

  async adminGetAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: { ...getAuthHeader() },
    })
    return res.json()
  },
}
