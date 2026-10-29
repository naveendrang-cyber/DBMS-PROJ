/**
 * OMNI ATELIER (DA3) — APPLICATION ENTRY & STATE ORCHESTRATOR
 * Orchestrates Storefront, Category Discovery, Editorial Campaign, Cart Drawer,
 * Product Modal with related-product recommendations, and Professor Academic Suite.
 */

import './styles/main.css';
import { api } from './services/api.js';
import { enrichProduct, BASELINE_PRODUCTS } from './services/catalogData.js';
import { createHeader } from './components/Header.js';
import { createHero } from './components/Hero.js';
import { createCategoryDiscovery } from './components/CategoryDiscovery.js';
import { createEditorialStory } from './components/EditorialStory.js';
import { createProductCatalog } from './components/ProductCatalog.js';
import { createCartDrawer } from './components/CartDrawer.js';
import { createProductModal } from './components/ProductModal.js';
import { createAcademicSections } from './components/AcademicSections.js';
import { createFooter } from './components/Footer.js';

// Application State
let rawProducts = [...BASELINE_PRODUCTS];
let cart = [];

// Load cart from localStorage
try {
  const stored = localStorage.getItem('omnimarket_da3_cart');
  if (stored) cart = JSON.parse(stored);
} catch (e) {
  cart = [];
}

function saveCart() {
  localStorage.setItem('omnimarket_da3_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('header-bag-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.classList.remove('bump');
    void badge.offsetWidth; // Force reflow
    badge.classList.add('bump');
  }
  if (cartDrawerInstance) cartDrawerInstance.update(cart);
}

// Component references
let cartDrawerInstance = null;
let catalogInstance = null;
let modalInstance = null;
let academicSuiteInstance = null;

async function initApp() {
  const appRoot = document.getElementById('app');
  appRoot.innerHTML = '';

  // 1. Sticky Luxury Header
  const header = createHeader(
    () => cartDrawerInstance.open(),
    (navTarget) => {
      if (navTarget === 'academic-suite') {
        const el = document.getElementById('academic-suite');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById(navTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  );
  appRoot.appendChild(header);

  // 2. Editorial Hero Section
  const hero = createHero(
    () => {
      const storefront = document.getElementById('storefront');
      if (storefront) storefront.scrollIntoView({ behavior: 'smooth' });
    },
    () => {
      if (catalogInstance) catalogInstance.focusSearch();
    },
    (productId, autoAddToCart = false) => {
      const prod = rawProducts.find(p => p.id === productId);
      if (prod) {
        if (autoAddToCart) {
          addToCart(enrichProduct(prod));
        } else {
          modalInstance.open(prod);
        }
      }
    }
  );
  appRoot.appendChild(hero);

  // 3. Curated Category Discovery
  const categoryDiscovery = createCategoryDiscovery((catId) => {
    if (catalogInstance) {
      catalogInstance.setCategory(catId);
    }
  });
  appRoot.appendChild(categoryDiscovery);

  // 4. Product Catalog (ThreeUI Inspired)
  catalogInstance = createProductCatalog(
    rawProducts,
    (product) => addToCart(product),
    (product) => modalInstance.open(product)
  );
  appRoot.appendChild(catalogInstance.element);

  // 5. Editorial Campaign & Storytelling Manifesto
  const editorialStory = createEditorialStory(() => {
    const el = document.getElementById('academic-suite');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  appRoot.appendChild(editorialStory);

  // 6. Academic Database Suite (Professor Manager, Advanced Demo, SQL Console)
  academicSuiteInstance = createAcademicSections();
  appRoot.appendChild(academicSuiteInstance.element);

  // 7. Footer
  const footer = createFooter();
  appRoot.appendChild(footer);

  // 8. Modals & Drawers
  cartDrawerInstance = createCartDrawer(
    cart,
    (id, newQty) => {
      if (newQty <= 0) {
        cart = cart.filter(it => it.id !== id);
      } else {
        const item = cart.find(it => it.id === id);
        if (item) item.qty = newQty;
      }
      saveCart();
    },
    (id) => {
      cart = cart.filter(it => it.id !== id);
      saveCart();
    },
    async (checkoutData) => {
      const order = await api.createOrder(checkoutData);
      cart = [];
      saveCart();
      await fetchInitialData(); // Refresh stock in catalog
      return order;
    }
  );
  document.body.appendChild(cartDrawerInstance.element);

  modalInstance = createProductModal(
    (product) => addToCart(product),
    (newProduct) => modalInstance.open(newProduct)
  );
  document.body.appendChild(modalInstance.element);

  updateCartUI();

  // Load live data from the Worker API
  await checkHealth();
  await fetchInitialData();
}

function addToCart(product) {
  const existing = cart.find(it => it.id === product.id);
  const qty = product.qtyToAdd || 1;
  if (existing) {
    existing.qty += qty;
    if (product.selectedVariant) existing.selectedVariant = product.selectedVariant;
  } else {
    cart.push({
      ...product,
      qty,
      selectedVariant: product.selectedVariant || (product.variants && product.variants[0]) || 'Standard'
    });
  }
  saveCart();
  cartDrawerInstance.open();
}

async function checkHealth() {
  const badge = document.getElementById('system-health-badge');
  const dot = document.getElementById('system-health-dot');
  const text = document.getElementById('health-text');
  const engineInd = document.getElementById('header-engine-indicator');

  if (!badge || !text) return;

  try {
    const health = await api.getHealth();
    if (health.database !== 'connected') throw new Error(health.message);
    badge.className = 'badge badge-success';
    badge.title = `Engine: ${health.engine} | Driver: ${health.driver}`;
    if (dot) dot.className = 'pulse-dot';
    text.textContent = `DB: ${health.engine || 'Connected'}`;
    if (engineInd) engineInd.textContent = `ENGINE: ${health.engine?.toUpperCase() || 'COCKROACHDB'} CLOUD`;
  } catch (err) {
    badge.className = 'badge badge-gold';
    badge.title = `Backend connection notice: Using offline fallback cache`;
    if (dot) dot.className = 'pulse-dot amber';
    text.textContent = 'DB: Offline Cache';
  }
}

async function fetchInitialData() {
  try {
    const prodList = await api.getProducts();
    if (prodList && Array.isArray(prodList) && prodList.length > 0) {
      rawProducts = prodList;
      if (catalogInstance) catalogInstance.updateProducts(rawProducts);

      const statProducts = document.getElementById('hero-stat-products');
      if (statProducts) statProducts.textContent = `${rawProducts.length} Curations`;
    }

    const stats = await api.getDashboardStats();
    if (stats) {
      const statStores = document.getElementById('hero-stat-stores');
      const statRev = document.getElementById('hero-stat-rev');
      if (statStores) statStores.textContent = `${stats.totalStores || 3} Flagships`;
      if (statRev) {
        statRev.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalRevenue || 36796);
      }
    }

    const dbInd = document.getElementById('header-db-indicator');
    if (dbInd && stats && stats.totalOrders !== undefined) {
      dbInd.textContent = `COCKROACHDB: ${stats.totalOrders} ORDERS · SERIALIZABLE`;
    }
  } catch (err) {
    console.warn("Could not fetch remote products; will retry on refresh.", err);
  }
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
