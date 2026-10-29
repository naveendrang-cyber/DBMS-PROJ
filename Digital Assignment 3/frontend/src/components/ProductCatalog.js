/**
 * OMNI ATELIER — INTERACTIVE PRODUCT CATALOG (THREEUI INSPIRED)
 * Elevated product discovery with multi-column layout switcher, functional category & attribute filters,
 * instant keyword search, and a live CockroachDB connection indicator.
 */

import { api } from '../services/api.js';
import { CATEGORIES, enrichProduct } from '../services/catalogData.js';

export function createProductCatalog(rawProducts, onAddToCart, onQuickView) {
  const section = document.createElement('section');
  section.className = 'catalog-section';
  section.id = 'storefront';

  // Component State
  let allEnrichedProducts = (rawProducts || []).map(enrichProduct);
  let currentCategory = 'all';
  let searchQuery = '';
  let sortBy = 'featured';
  let viewMode = 'grid-4col';
  let filterInStockOnly = false;
  let selectedStore = 'all';
  let displayLimit = 16;
  let dbHealth = null;

  // Live relational engine status (GET /api/health)
  api.getHealth().then(h => {
    dbHealth = h;
    updateStatusPill();
  }).catch(() => {
    dbHealth = null;
    updateStatusPill();
  });

  function updateStatusPill() {
    const pill = section.querySelector('#db-status-pill');
    if (!pill) return;
    if (dbHealth && dbHealth.database === 'connected') {
      pill.innerHTML = `
        <span class="pulse-dot"></span>
        <span>${dbHealth.engine || 'CockroachDB'}: <strong>live</strong> (${allEnrichedProducts.length} products via JDBC)</span>
      `;
      pill.className = 'badge badge-success';
    } else {
      pill.innerHTML = `
        <span class="pulse-dot amber"></span>
        <span>Offline catalog cache (${allEnrichedProducts.length} products)</span>
      `;
      pill.className = 'badge badge-gold';
    }
  }

  function getFilteredAndSortedProducts() {
    // Relational attribute filtering
    const items = allEnrichedProducts.filter(p => {
      // Category filter
      const matchesCategory = currentCategory === 'all' || p.category === currentCategory;

      // Keyword search filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.storeName || '').toLowerCase().includes(query) ||
        (p.city || '').toLowerCase().includes(query);

      // In-stock only filter
      const matchesStock = !filterInStockOnly || p.stock > 0;

      // Store boutique filter
      const matchesStore = selectedStore === 'all' || String(p.storeId) === String(selectedStore);

      return matchesCategory && matchesSearch && matchesStock && matchesStore;
    });

    // Sorting
    items.sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'stock-desc') return b.stock - a.stock;
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      return a.id - b.id; // Default featured by ID
    });

    return items;
  }

  function render() {
    const filteredProducts = getFilteredAndSortedProducts();
    const visibleProducts = filteredProducts.slice(0, displayLimit);
    const hasMore = filteredProducts.length > displayLimit;

    section.innerHTML = `
      <div class="container">
        <!-- Section Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin-bottom:28px;">
          <div>
            <p class="section-eyebrow">02 / The Atelier Catalog</p>
            <h2 class="section-headline">Curated Artifacts &amp; Rare Curations</h2>
            <p class="section-subheadline">
              Sourced from certified artisan workshops with 100% verified relational stock balances powered by Java JDBC and CockroachDB.
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="db-status-pill" class="badge badge-gold" style="padding:6px 14px; font-size:0.75rem;">
              Connecting to CockroachDB...
            </div>
          </div>
        </div>

        <!-- Interactive Catalog Toolbar -->
        <div class="catalog-toolbar-card">
          <!-- Top Row: Category Pills -->
          <div class="catalog-toolbar-top">
            <div class="category-pill-group">
              ${CATEGORIES.map(cat => {
                const count = cat.id === 'all' 
                  ? allEnrichedProducts.length 
                  : allEnrichedProducts.filter(p => p.category === cat.id).length;
                const isActive = currentCategory === cat.id;
                return `
                  <button class="category-pill-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
                    <span>${cat.label}</span>
                    <span class="pill-count">(${count})</span>
                  </button>
                `;
              }).join('')}
            </div>

          </div>

          <!-- Middle Row: Search Input & Filter Controls -->
          <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
            <div class="search-input-group">
              <span class="search-input-icon">🔍</span>
              <input 
                type="text" 
                id="catalog-search" 
                class="search-input" 
                placeholder="Search by artifact title, material, boutique, or city..." 
                value="${searchQuery}" 
                aria-label="Search catalog"
              />
            </div>

            <!-- In-Stock Checkbox -->
            <label style="display:flex; align-items:center; gap:6px; font-size:0.8125rem; color:var(--color-text-secondary); cursor:pointer; user-select:none;">
              <input type="checkbox" id="stock-filter-checkbox" ${filterInStockOnly ? 'checked' : ''} />
              <span>In Stock Only</span>
            </label>

            <!-- Store Selector -->
            <select id="store-filter-select" class="sort-select" aria-label="Filter by boutique">
              <option value="all" ${selectedStore === 'all' ? 'selected' : ''}>All Boutiques</option>
              <option value="1" ${selectedStore === '1' ? 'selected' : ''}>TechZone Flagship (Bangalore)</option>
              <option value="2" ${selectedStore === '2' ? 'selected' : ''}>StyleHub Fashion Studio (Mumbai)</option>
              <option value="3" ${selectedStore === '3' ? 'selected' : ''}>TechZone Express Hub (Delhi)</option>
            </select>
          </div>

          <!-- Sub Toolbar: Results Count, Sort Dropdown & Layout Switcher -->
          <div class="catalog-toolbar-sub" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
            <div class="results-count-text">
              Showing <strong>${visibleProducts.length}</strong> of <strong>${filteredProducts.length}</strong> curations
            </div>

            <div class="filter-sort-controls">
              <!-- Sort Select -->
              <label for="catalog-sort-select" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-text-muted);">Sort By:</label>
              <select id="catalog-sort-select" class="sort-select">
                <option value="featured" ${sortBy === 'featured' ? 'selected' : ''}>Featured / Curated</option>
                <option value="price-asc" ${sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="stock-desc" ${sortBy === 'stock-desc' ? 'selected' : ''}>Stock Availability</option>
                <option value="rating-desc" ${sortBy === 'rating-desc' ? 'selected' : ''}>Highest Patron Rating</option>
              </select>

              <!-- View Mode Switcher (ThreeUI Inspired) -->
              <div class="view-mode-toggle" role="group" aria-label="Layout View Switcher">
                <button class="view-btn ${viewMode === 'grid-4col' ? 'active' : ''}" data-view="grid-4col" title="4-Column Grid View">
                  ⊞ 4 Col
                </button>
                <button class="view-btn ${viewMode === 'grid-3col' ? 'active' : ''}" data-view="grid-3col" title="3-Column Relaxed View">
                  ⊟ 3 Col
                </button>
                <button class="view-btn ${viewMode === 'grid-list' ? 'active' : ''}" data-view="grid-list" title="Editorial List View">
                  ☰ List
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Grid Container -->
        <div class="product-grid ${viewMode}" id="catalog-grid">
          <!-- Populated dynamically -->
        </div>

        <!-- Empty State -->
        ${visibleProducts.length === 0 ? `
          <div style="text-align:center; padding:64px 24px; background:var(--color-ivory-warm); border-radius:var(--radius-sm); border:1px dashed var(--color-border-dark);">
            <p style="font-family:var(--font-serif); font-size:1.75rem; color:var(--color-midnight); margin-bottom:8px;">No curations matched your criteria.</p>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); max-width:480px; margin:0 auto 20px;">
              Try relaxing your filters, searching for alternate materials, or resetting the search query.
            </p>
            <button class="btn btn-outline" id="reset-filters-btn">Reset All Filters</button>
          </div>
        ` : ''}

        <!-- Pagination / Incremental Loader -->
        ${hasMore ? `
          <div style="text-align:center; margin-top:48px;">
            <button class="btn btn-outline btn-lg" id="load-more-btn">
              Load More Curations (${filteredProducts.length - visibleProducts.length} remaining) ↓
            </button>
          </div>
        ` : ''}
      </div>
    `;

    updateStatusPill();

    // Render Product Cards into Grid
    const grid = section.querySelector('#catalog-grid');
    if (grid && visibleProducts.length > 0) {
      visibleProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);

        const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price);
        
        // Stock status badge
        const stockBadge = product.stock > 15
          ? '<span class="badge badge-success">In Stock</span>'
          : (product.stock > 0
            ? `<span class="badge badge-gold">Only ${product.stock} Left</span>`
            : '<span class="badge badge-error">Sold Out</span>');

        card.innerHTML = `
          <!-- Product Media Container -->
          <div class="product-image-wrap">
            <img 
              src="${product.primaryImage}" 
              alt="${product.name}" 
              class="product-image-primary" 
              loading="lazy" 
            />
            <img 
              src="${product.secondaryImage}" 
              alt="${product.name} (Alternate Angle)" 
              class="product-image-secondary" 
              loading="lazy" 
            />

            <!-- Badge Overlay -->
            <div class="product-badge-overlay">
              ${stockBadge}
            </div>

            <!-- Quick View Hover Trigger -->
            <div class="product-quick-view-trigger">
              <button class="btn btn-primary btn-sm quick-view-btn" style="width:100%; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                Quick View &amp; Related Artistry
              </button>
            </div>
          </div>

          <!-- Product Body & Metadata -->
          <div class="product-body">
            <div class="product-meta-row">
              <span class="product-store-name">${product.storeName || 'Atelier'}</span>
              <span>${product.city || 'National'}</span>
            </div>

            <h3 class="product-name" title="${product.name}">${product.name}</h3>
            <p class="product-desc">${product.description || 'Artisan curation.'}</p>

            <div class="product-footer">
              <div>
                <span class="product-price">${formattedPrice}</span>
                <div class="product-rating" style="margin-top:2px;">
                  <span class="star-gold">★</span>
                  <span>${product.rating || '4.8'}</span>
                  <span style="color:var(--color-text-muted);">(${product.reviewsCount || 18})</span>
                </div>
              </div>

              <div>
                <button 
                  class="btn btn-outline btn-sm add-cart-btn" 
                  data-id="${product.id}" 
                  ${product.stock <= 0 ? 'disabled' : ''}
                  aria-label="Add ${product.name} to bag"
                >
                  ${product.stock > 0 ? '+ Add to Bag' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>
        `;

        // Card image and title click opens modal
        card.querySelector('.product-image-wrap').addEventListener('click', (e) => {
          if (!e.target.closest('.quick-view-btn')) {
            if (onQuickView) onQuickView(product);
          }
        });

        card.querySelector('.product-name').addEventListener('click', () => {
          if (onQuickView) onQuickView(product);
        });

        // Quick View button
        card.querySelector('.quick-view-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          if (onQuickView) onQuickView(product);
        });

        // Add to Bag button with instantaneous feedback
        const addBtn = card.querySelector('.add-cart-btn');
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (product.stock <= 0) return;
          if (onAddToCart) onAddToCart(product);

          const origText = addBtn.innerHTML;
          addBtn.innerHTML = '✓ Added';
          addBtn.classList.remove('btn-outline');
          addBtn.classList.add('btn-emerald');
          setTimeout(() => {
            addBtn.innerHTML = origText;
            addBtn.classList.remove('btn-emerald');
            addBtn.classList.add('btn-outline');
          }, 1200);
        });

        grid.appendChild(card);
      });
    }

    // Attach Event Listeners
    attachCatalogEventListeners();
    updateStatusPill();
  }

  function attachCatalogEventListeners() {
    // Category Pills
    section.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category');
        displayLimit = 16;
        render();
      });
    });

    // Search Input
    const searchInput = section.querySelector('#catalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
        // Restore input focus and cursor
        const newInput = section.querySelector('#catalog-search');
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }

    // In Stock Only Checkbox
    const stockCb = section.querySelector('#stock-filter-checkbox');
    if (stockCb) {
      stockCb.addEventListener('change', (e) => {
        filterInStockOnly = e.target.checked;
        displayLimit = 16;
        render();
      });
    }

    // Store Boutique Filter Select
    const storeSelect = section.querySelector('#store-filter-select');
    if (storeSelect) {
      storeSelect.addEventListener('change', (e) => {
        selectedStore = e.target.value;
        displayLimit = 16;
        render();
      });
    }

    // Sort Dropdown
    const sortSelect = section.querySelector('#catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        render();
      });
    }

    // View Mode Toggle Buttons
    section.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.getAttribute('data-view');
        render();
      });
    });

    // Reset Filters Button
    const resetBtn = section.querySelector('#reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        searchQuery = '';
        filterInStockOnly = false;
        selectedStore = 'all';
        sortBy = 'featured';
        displayLimit = 16;
        render();
      });
    }

    // Load More Button
    const loadMoreBtn = section.querySelector('#load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        displayLimit += 12;
        render();
      });
    }

  }

  // Initial render
  render();

  return {
    element: section,
    updateProducts(newRawProducts) {
      allEnrichedProducts = (newRawProducts || []).map(enrichProduct);
      render();
    },
    setCategory(catId) {
      currentCategory = catId;
      render();
      section.scrollIntoView({ behavior: 'smooth' });
    },
    focusSearch() {
      const input = section.querySelector('#catalog-search');
      if (input) {
        input.focus();
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
}
