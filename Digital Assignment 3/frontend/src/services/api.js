/**
 * OMNI ATELIER (DA3) — API SERVICE LAYER
 * Connects directly to Java Spring Boot REST API backed by Java JDBC
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__API_BASE__) {
    return window.__API_BASE__;
  }
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // During local development, relative '/api' is proxied by Vite to localhost:8080
  return '/api';
};

const BASE_URL = getBaseUrl();

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

export const api = {
  // System Health & Metrics
  async getHealth() {
    return handleResponse(await fetch(`${BASE_URL}/health`));
  },

  async getDashboardStats() {
    return handleResponse(await fetch(`${BASE_URL}/dashboard/stats`));
  },

  // Products
  async getProducts() {
    return handleResponse(await fetch(`${BASE_URL}/products`));
  },

  async getProduct(id) {
    return handleResponse(await fetch(`${BASE_URL}/products/${id}`));
  },

  // Orders (Checkout Transaction via JDBC)
  async createOrder(checkoutData) {
    return handleResponse(await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData),
    }));
  },

  async getOrder(id) {
    return handleResponse(await fetch(`${BASE_URL}/orders/${id}`));
  },

  // Dedicated Professor Database Actions (JDBC Direct)
  async adminInsert(table, data, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    return handleResponse(await fetch(`${BASE_URL}/admin/insert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, data }),
    }));
  },

  async adminDelete(table, id, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    return handleResponse(await fetch(`${BASE_URL}/admin/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, id }),
    }));
  },

  async adminUpdate(table, id, data, apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;

    return handleResponse(await fetch(`${BASE_URL}/admin/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, id, data }),
    }));
  },

  async getAdminTables() {
    return handleResponse(await fetch(`${BASE_URL}/admin/tables`));
  },

  async getAdminColumns(table) {
    return handleResponse(await fetch(`${BASE_URL}/admin/columns?table=${encodeURIComponent(table)}`));
  },

  async getAdminRecords(table, limit = 50, offset = 0) {
    return handleResponse(await fetch(`${BASE_URL}/admin/records?table=${encodeURIComponent(table)}&limit=${limit}&offset=${offset}`));
  },

  // Advanced Database Demonstrations
  async getAdvancedJoins() {
    return handleResponse(await fetch(`${BASE_URL}/advanced/joins`));
  },

  async getAdvancedAggregates() {
    return handleResponse(await fetch(`${BASE_URL}/advanced/aggregates`));
  },

  async runAcidTransactionDemo(shouldFail = false) {
    return handleResponse(await fetch(`${BASE_URL}/advanced/transaction-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shouldFail }),
    }));
  },

  async explainQuery(query) {
    return handleResponse(await fetch(`${BASE_URL}/advanced/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }));
  },

  // Educational SQL Console Sandbox
  async executeSql(query) {
    return handleResponse(await fetch(`${BASE_URL}/sql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }));
  },

  // Qdrant Vector Database Integration
  async getQdrantStatus() {
    return handleResponse(await fetch(`${BASE_URL}/qdrant/status`));
  },

  async searchQdrant(query, limit = 6) {
    return handleResponse(await fetch(`${BASE_URL}/qdrant/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    }));
  },

  async getSimilarProducts(productId, limit = 4) {
    return handleResponse(await fetch(`${BASE_URL}/qdrant/similar/${productId}?limit=${limit}`));
  },

  async syncQdrant(apiKey = '') {
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['X-Admin-Key'] = apiKey;
    return handleResponse(await fetch(`${BASE_URL}/qdrant/sync`, {
      method: 'POST',
      headers,
    }));
  },
};
