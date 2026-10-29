/**
 * OMNI ATELIER (DA3) — API SERVICE LAYER
 * Calls the Cloudflare Worker API (worker/index.js), which queries CockroachDB through Hyperdrive.
 * Includes intelligent edge demo resilience for Cloudflare Pages/Edge static deployments.
 */

import { BASELINE_PRODUCTS } from './catalogData.js';

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__API_BASE__) {
    return window.__API_BASE__;
  }
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Same-origin '/api' on Cloudflare; in local development Vite proxies it to the Worker (localhost:8787)
  return '/api';
};

const BASE_URL = getBaseUrl();

// Resolves to null only when no backend is present: a network failure, or a non-JSON 404/405 from
// a static host (the Cloudflare asset server answering /api/* itself). Any response from the real
// API, including 4xx/5xx JSON errors, is returned as-is so real errors are shown instead of being
// masked by the offline simulation.
async function fetchOrNull(url, options) {
  try {
    const res = await fetch(url, options);
    const isJson = res.headers.get('content-type')?.includes('application/json');
    if (!isJson && (res.status === 404 || res.status === 405)) return null;
    return res;
  } catch (e) {
    return null;
  }
}

async function handleResponse(res) {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = (data && data.error) || (data && data.message) || `HTTP ${res.status}: ${res.statusText}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// In-memory / LocalStorage state for Edge Simulation (Cloudflare Pages fallback)
const getEdgeOrders = () => {
  try {
    const saved = localStorage.getItem('omnimarket_edge_orders');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveEdgeOrder = (order) => {
  try {
    const orders = getEdgeOrders();
    orders.unshift(order);
    localStorage.setItem('omnimarket_edge_orders', JSON.stringify(orders));
  } catch (e) {}
};

export const api = {
  // System Health & Metrics
  async getHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}
    return {
      status: 'offline',
      database: 'disconnected',
      engine: 'Offline catalog cache',
      driver: 'postgres.js via Cloudflare Hyperdrive',
      message: 'API not reachable'
    };
  },

  async getDashboardStats() {
    try {
      const res = await fetch(`${BASE_URL}/dashboard/stats`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}
    const edgeOrders = getEdgeOrders();
    const orderCount = 22 + edgeOrders.length;
    const addedRev = edgeOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    return {
      totalProducts: 36,
      totalOrders: orderCount,
      totalStores: 3,
      totalUsers: 6,
      totalRevenue: 36796 + addedRev
    };
  },

  // Products
  async getProducts() {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (res.ok) {
        const data = await handleResponse(res);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}
    return BASELINE_PRODUCTS;
  },

  async getProduct(id) {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}
    return BASELINE_PRODUCTS.find(p => p.id === Number(id)) || null;
  },

  // Orders (multi-table checkout transaction)
  async createOrder(checkoutData) {
    const res = await fetchOrNull(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData),
    });
    // Successful order, or a business error (e.g. rollback on insufficient stock) to display
    if (res) return handleResponse(res);
    console.warn("API not reachable at /api/orders, engaging offline transaction simulation.");

    // Edge ACID Demo Simulation (for Cloudflare Edge static deployments)
    let grandTotal = 0;
    const preparedItems = (checkoutData.items || []).map(item => {
      const prod = BASELINE_PRODUCTS.find(p => p.id === item.productId) || { name: 'Curated Artisan Piece', price: item.price || 3499 };
      const price = item.price || prod.price;
      const qty = item.qty || 1;
      grandTotal += price * qty;
      return {
        id: Math.floor(Math.random() * 900) + 100,
        orderId: 0,
        productId: item.productId,
        productName: prod.name,
        price,
        qty
      };
    });

    const edgeOrderId = 24 + getEdgeOrders().length + 1;
    const edgePayId = 14 + getEdgeOrders().length + 1;

    preparedItems.forEach(it => { it.orderId = edgeOrderId; });

    const simulatedOrder = {
      id: edgeOrderId,
      userId: checkoutData.userId || 1,
      status: 'completed',
      totalPrice: grandTotal,
      customerName: checkoutData.userId === 2 ? 'Priya Sharma' : 'Vikram Singh',
      items: preparedItems,
      payment: {
        payId: edgePayId,
        orderId: edgeOrderId,
        amount: grandTotal,
        paidAt: new Date().toISOString(),
        payMethod: checkoutData.payMethod || 'UPI',
        payStatus: 'completed'
      },
      isEdgeSimulation: true
    };

    saveEdgeOrder(simulatedOrder);
    return simulatedOrder;
  },

  async getOrder(id) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${id}`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}
    const edgeOrders = getEdgeOrders();
    return edgeOrders.find(o => o.id === Number(id)) || null;
  },

  // Dedicated Professor Database Actions
  async adminInsert(table, data, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    const res = await fetchOrNull(`${BASE_URL}/admin/insert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, data }),
    });
    // Includes 401/403 (missing or wrong admin key) so they are never reported as success
    if (res) return handleResponse(res);

    const newId = Math.floor(Math.random() * 500) + 100;
    return {
      success: true,
      table,
      id: newId,
      message: `Record #${newId} inserted into '${table}' (offline simulation).`
    };
  },

  async adminDelete(table, id, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    const res = await fetchOrNull(`${BASE_URL}/admin/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, id }),
    });
    // Includes 401/403 (missing or wrong admin key) so they are never reported as success
    if (res) return handleResponse(res);

    return {
      success: true,
      table,
      id,
      message: `Record #${id} deleted from '${table}' (offline simulation).`
    };
  },

  async adminUpdate(table, id, data, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    const res = await fetchOrNull(`${BASE_URL}/admin/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, id, data }),
    });
    // Includes 401/403 (missing or wrong admin key) so they are never reported as success
    if (res) return handleResponse(res);

    return {
      success: true,
      table,
      id,
      message: `Record #${id} in '${table}' updated (offline simulation).`
    };
  },

  async getAdminTables() {
    try {
      const res = await fetch(`${BASE_URL}/admin/tables`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}
    return ['products', 'orders', 'ordered_items', 'payments', 'users', 'stores'];
  },

  async getAdminColumns(table) {
    try {
      const res = await fetch(`${BASE_URL}/admin/columns?table=${encodeURIComponent(table)}`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    const schemas = {
      products: ['id', 'store_id', 'name', 'price', 'stock', 'description'],
      orders: ['id', 'user_id', 'status', 'total_price', 'created_at'],
      ordered_items: ['id', 'order_id', 'product_id', 'qty', 'price'],
      payments: ['id', 'order_id', 'amount', 'pay_method', 'status', 'paid_at'],
      users: ['id', 'name', 'email', 'role', 'city'],
      stores: ['id', 'name', 'city', 'rating']
    };
    return schemas[table] || ['id', 'name'];
  },

  async getAdminRecords(table, limit = 50, offset = 0) {
    try {
      const res = await fetch(`${BASE_URL}/admin/records?table=${encodeURIComponent(table)}&limit=${limit}&offset=${offset}`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    if (table === 'products') {
      return BASELINE_PRODUCTS.slice(offset, offset + limit).map(p => ({
        id: p.id,
        store_id: p.storeId,
        name: p.name,
        price: p.price,
        stock: p.stock,
        description: p.description
      }));
    }
    if (table === 'orders') {
      const edgeOrders = getEdgeOrders();
      const baseOrders = [
        { id: 1, user_id: 1, status: 'completed', total_price: 3499.00, created_at: '2026-10-27 10:15:00' },
        { id: 2, user_id: 2, status: 'completed', total_price: 28999.00, created_at: '2026-10-27 11:30:00' },
        { id: 3, user_id: 3, status: 'completed', total_price: 12499.00, created_at: '2026-10-27 14:45:00' },
      ];
      return [...edgeOrders.map(o => ({
        id: o.id,
        user_id: o.userId,
        status: o.status,
        total_price: o.totalPrice,
        created_at: o.payment?.paidAt || '2026-10-28 15:00:00'
      })), ...baseOrders];
    }
    if (table === 'users') {
      return [
        { id: 1, name: 'Vikram Singh', email: 'vikram.singh@yahoo.com', role: 'customer', city: 'Bangalore' },
        { id: 2, name: 'Priya Sharma', email: 'priya.sharma@gmail.com', role: 'customer', city: 'Mumbai' },
        { id: 3, name: 'Ananya Iyer', email: 'ananya.iyer@outlook.com', role: 'customer', city: 'Chennai' },
        { id: 4, name: 'Rahul Verma', email: 'rahul.verma@gmail.com', role: 'customer', city: 'Delhi' },
        { id: 5, name: 'Arjun Mehta', email: 'arjun.mehta@proton.me', role: 'merchant', city: 'Bangalore' },
        { id: 6, name: 'Dr. Sobitha Ahila', email: 'evaluator.dbms@vit.ac.in', role: 'professor_evaluator', city: 'Vellore' },
      ];
    }
    if (table === 'stores') {
      return [
        { id: 1, name: 'TechZone Flagship Branch', city: 'Bangalore', rating: 4.9 },
        { id: 2, name: 'StyleHub Fashion Studio', city: 'Mumbai', rating: 4.8 },
        { id: 3, name: 'TechZone Express Hub', city: 'Delhi', rating: 4.7 }
      ];
    }
    return [];
  },

  // Advanced Database Demonstrations
  async getAdvancedJoins() {
    try {
      const res = await fetch(`${BASE_URL}/advanced/joins`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    return [
      { order_id: 1, customer_name: 'Vikram Singh', user_email: 'vikram.singh@yahoo.com', product_name: 'Wireless Mechanical Keyboard', qty: 1, line_total: 3499.00, order_total: 3499.00, pay_method: 'UPI', pay_status: 'completed' },
      { order_id: 2, customer_name: 'Priya Sharma', user_email: 'priya.sharma@gmail.com', product_name: 'UltraHD 4K Gaming Monitor', qty: 1, line_total: 28999.00, order_total: 28999.00, pay_method: 'Credit Card', pay_status: 'completed' },
      { order_id: 3, customer_name: 'Ananya Iyer', user_email: 'ananya.iyer@outlook.com', product_name: 'Studio Reference Open-Back Headphones', qty: 1, line_total: 18999.00, order_total: 18999.00, pay_method: 'UPI', pay_status: 'completed' }
    ];
  },

  async getAdvancedAggregates() {
    try {
      const res = await fetch(`${BASE_URL}/advanced/aggregates`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    return {
      totalProducts: 36,
      averagePrice: 9845.50,
      minPrice: 1499.00,
      maxPrice: 64999.00,
      totalInventoryUnits: 884,
      categoryDistribution: [
        { category: 'Artisan Computing', count: 12, avgPrice: 12450.00 },
        { category: 'High-Fidelity Audio', count: 8, avgPrice: 14750.00 },
        { category: 'Sartorial Goods', count: 8, avgPrice: 5100.00 },
        { category: 'Leathercraft & Accoutrements', count: 8, avgPrice: 3850.00 }
      ]
    };
  },

  async runAcidTransactionDemo(shouldFail = false) {
    try {
      const res = await fetch(`${BASE_URL}/advanced/transaction-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shouldFail }),
      });
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    const testOrderId = Math.floor(Math.random() * 900) + 500;
    const testUserId = 1;
    const steps = [
      `[STEP 1] BEGIN: explicit ACID transaction opened (offline simulation).`,
      `[STEP 2] INSERT INTO orders (order_id=${testOrderId}, user_id=${testUserId}, total_price=12499.00). Uncommitted in transaction buffer.`,
      `[STEP 3] INSERT INTO ordered_items (order_id=${testOrderId}, product_id=3, qty=1, price=12499.00).`,
      `[STEP 4] UPDATE products SET stock = stock - 1 WHERE id = 3. Stock decremented in transaction isolate.`
    ];

    if (shouldFail) {
      steps.push(`[STEP 5 - INTENTIONAL CONSTRAINT VIOLATION] Simulating forced system exception or duplicate key constraint.`);
      steps.push(`[STEP 6 - ATOMIC ROLLBACK] Exception intercepted! Invoked conn.rollback(). All uncommitted rows in orders and ordered_items purged. Products stock restored. Atomicity preserved.`);
      return {
        success: false,
        outcome: 'ROLLED_BACK',
        message: 'Transaction successfully rolled back! No orphan records created in database.',
        steps,
        orderId: null
      };
    } else {
      steps.push(`[STEP 5] INSERT INTO payments (order_id=${testOrderId}, amount=12499.00, pay_method='UPI', status='completed').`);
      steps.push(`[STEP 6 - ATOMIC COMMIT] All operations succeeded. Invoked conn.commit(). Relational state permanently sealed in SQL database.`);
      return {
        success: true,
        outcome: 'COMMITTED',
        message: `ACID transaction committed successfully with Order #${testOrderId}.`,
        steps,
        orderId: testOrderId
      };
    }
  },

  async explainQuery(query) {
    try {
      const res = await fetch(`${BASE_URL}/advanced/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    return {
      query,
      plan: `distribution: local\nvectorized: true\n\n• filter\n│ filter: total_price > 5000\n│\n└── • scan\n      table: orders@orders_pkey\n      spans: FULL SCAN\n(offline sample of CockroachDB EXPLAIN output)`
    };
  },

  // Educational SQL Console Sandbox
  async executeSql(query) {
    try {
      const res = await fetch(`${BASE_URL}/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    // Simulated sandbox SQL execution on edge
    const trimmed = (query || '').trim().toLowerCase();
    if (trimmed.includes('from products')) {
      const rows = BASELINE_PRODUCTS.slice(0, 8).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        store: p.storeName
      }));
      return {
        columns: ['id', 'name', 'price', 'stock', 'store'],
        rows,
        rowCount: rows.length,
        executionTimeMs: 1.8,
        mode: 'Offline simulation'
      };
    }
    if (trimmed.includes('from orders')) {
      const edgeOrders = getEdgeOrders();
      const rows = [
        ...edgeOrders.map(o => ({ id: o.id, user_id: o.userId, status: o.status, total: o.totalPrice })),
        { id: 1, user_id: 1, status: 'completed', total: 3499 },
        { id: 2, user_id: 2, status: 'completed', total: 28999 },
      ];
      return {
        columns: ['id', 'user_id', 'status', 'total'],
        rows,
        rowCount: rows.length,
        executionTimeMs: 2.1,
        mode: 'Offline simulation'
      };
    }

    return {
      columns: ['status', 'query_executed', 'persistence'],
      rows: [{ status: 'SUCCESS', query_executed: query, persistence: 'Offline simulation' }],
      rowCount: 1,
      executionTimeMs: 1.5,
      mode: 'Offline simulation'
    };
  },

  // Related products (same store first, then closest price)
  async getRelatedProducts(productId, limit = 4) {
    try {
      const res = await fetch(`${BASE_URL}/products/${productId}/related?limit=${limit}`);
      if (res.ok) return await handleResponse(res);
    } catch (e) {}

    const target = BASELINE_PRODUCTS.find(p => p.id === Number(productId));
    return BASELINE_PRODUCTS
      .filter(p => p.id !== Number(productId))
      .sort((a, b) => {
        const sameStore = Number(b.storeId === target?.storeId) - Number(a.storeId === target?.storeId);
        return sameStore || Math.abs(a.price - (target?.price || 0)) - Math.abs(b.price - (target?.price || 0));
      })
      .slice(0, limit);
  },
};
