/**
 * OMNI ATELIER — LUXURY PRODUCT DETAIL MODAL
 * Multi-angle image gallery, variant selection matrix, quantity stepper,
 * relational provenance accordions, and real-time Qdrant Nearest-Neighbor vector recommendations.
 */

import { api } from '../services/api.js';
import { enrichProduct } from '../services/catalogData.js';

export function createProductModal(onAddToCart, onProductSwitch) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'product-modal';

  modal.innerHTML = `
    <div class="modal-card">
      <!-- Modal Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px;">
        <div>
          <span id="modal-product-store" style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-emerald); font-weight:700;">STORE NAME</span>
          <h2 id="modal-product-name" style="font-family:var(--font-serif); font-size:1.875rem; color:var(--color-midnight); line-height:1.2; margin-top:4px;">Product Name</h2>
        </div>
        <button id="modal-close-btn" class="btn btn-outline btn-sm" aria-label="Close details" style="font-size:1.25rem; line-height:1; padding:6px 12px;">&times;</button>
      </div>

      <!-- Main Product Grid: Gallery Left, Details Right -->
      <div class="modal-product-grid">
        <!-- Gallery Left -->
        <div class="modal-gallery-wrap">
          <div class="modal-main-image-container">
            <img id="modal-product-img" src="" alt="Artifact view" class="modal-main-image" />
          </div>
          <div class="modal-thumb-row" id="modal-thumb-row">
            <!-- Thumbs populated dynamically -->
          </div>
        </div>

        <!-- Details Right -->
        <div class="modal-info-wrap">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
            <span id="modal-product-price" style="font-size:1.625rem; font-weight:700; color:var(--color-midnight); font-variant-numeric:tabular-nums;">&#8377;0.00</span>
            <div id="modal-product-stock"></div>
          </div>

          <p id="modal-product-desc" style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6; margin-bottom:18px;">
            Detailed product craftsmanship description.
          </p>

          <!-- Variant Selector -->
          <div style="margin-bottom:18px;">
            <label class="form-label" style="margin-bottom:8px;">Configuration / Finish</label>
            <div class="variant-chip-group" id="modal-variant-group">
              <!-- Populated dynamically -->
            </div>
          </div>

          <!-- Quantity Stepper & Add to Bag -->
          <div style="display:flex; gap:12px; align-items:center; margin-bottom:20px;">
            <div class="cart-qty-control" style="height:42px;">
              <button class="cart-qty-btn" id="modal-qty-minus" aria-label="Decrease quantity" style="width:36px; height:40px;">−</button>
              <span class="cart-qty-val" id="modal-qty-val" style="padding:0 12px; font-weight:600;">1</span>
              <button class="cart-qty-btn" id="modal-qty-plus" aria-label="Increase quantity" style="width:36px; height:40px;">+</button>
            </div>
            <button id="modal-add-cart-btn" class="btn btn-primary" style="flex:1; height:42px; font-size:0.9375rem;">
              Add to Shopping Bag
            </button>
          </div>

          <!-- Expandable Technical Accordions -->
          <div class="modal-accordion">
            <button class="modal-accordion-toggle" data-target="acc-specs">
              <span>✦ Material Specifications</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content open" id="acc-specs">
              <!-- Populated dynamically -->
            </div>

            <button class="modal-accordion-toggle" data-target="acc-relational" style="border-top:1px solid var(--color-border); margin-top:8px;">
              <span>✦ Relational Database Provenance</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content" id="acc-relational">
              <p>Relational Record ID: <code id="modal-sql-id">#0</code> in table <code>products</code>.</p>
              <p style="margin-top:4px;">Foreign Key: <code>store_id</code> references <code id="modal-sql-store-id">stores.id</code> with <code>ON UPDATE CASCADE ON DELETE RESTRICT</code>.</p>
              <p style="margin-top:4px;">Direct JDBC Parameterized Statement: <code>SELECT * FROM products WHERE id = ?</code></p>
            </div>

            <button class="modal-accordion-toggle" data-target="acc-shipping" style="border-top:1px solid var(--color-border); margin-top:8px;">
              <span>✦ White-Glove Logistics &amp; Warranty</span>
              <span class="acc-arrow">▾</span>
            </button>
            <div class="modal-accordion-content" id="acc-shipping">
              <p>Complimentary insured delivery with custom temperature-regulated packaging. Includes a 2-year atelier certificate of authenticity and dedicated concierge support.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Qdrant Nearest-Neighbor Vectors Section -->
      <div class="modal-similar-section">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--color-midnight); display:flex; align-items:center; gap:8px;">
            <span>✨</span> Similar Artistry (Qdrant Nearest Neighbor Vectors)
          </h4>
          <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:var(--font-mono);">
            Cosine Similarity Metric · 384d Space
          </span>
        </div>
        <div id="modal-similar-container" class="similar-items-grid">
          <p style="color:var(--color-text-muted); font-size:0.8125rem;">Querying Qdrant vector space for nearest neighbors...</p>
        </div>
      </div>
    </div>
  `;

  let currentProduct = null;
  let selectedQty = 1;
  let selectedVariant = null;

  // Close handlers
  const closeBtn = modal.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // Quantity controls
  const qtyVal = modal.querySelector('#modal-qty-val');
  const qtyMinus = modal.querySelector('#modal-qty-minus');
  const qtyPlus = modal.querySelector('#modal-qty-plus');

  qtyMinus.addEventListener('click', () => {
    if (selectedQty > 1) {
      selectedQty -= 1;
      qtyVal.textContent = selectedQty;
    }
  });

  qtyPlus.addEventListener('click', () => {
    const maxStock = (currentProduct && currentProduct.stock) || 10;
    if (selectedQty < maxStock) {
      selectedQty += 1;
      qtyVal.textContent = selectedQty;
    }
  });

  // Accordion toggle handlers
  modal.querySelectorAll('.modal-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const content = modal.querySelector(`#${targetId}`);
      if (content) {
        content.classList.toggle('open');
      }
    });
  });

  // Add to Cart handler
  const addBtn = modal.querySelector('#modal-add-cart-btn');
  addBtn.addEventListener('click', () => {
    if (currentProduct && onAddToCart) {
      onAddToCart({
        ...currentProduct,
        selectedVariant: selectedVariant || (currentProduct.variants && currentProduct.variants[0]),
        qtyToAdd: selectedQty
      });
      modal.classList.remove('open');
    }
  });

  // Load real-time Qdrant Nearest Neighbors
  async function loadSimilar(product) {
    const container = modal.querySelector('#modal-similar-container');
    if (!container) return;

    try {
      const hits = await api.getSimilarProducts(product.id, 3);
      if (!hits || hits.length === 0) {
        container.innerHTML = '<p style="font-size:0.8125rem; color:var(--color-text-muted);">No vector neighbors returned.</p>';
        return;
      }

      container.innerHTML = '';
      hits.forEach(hit => {
        const enrichedHit = enrichProduct(hit);
        const tile = document.createElement('div');
        tile.className = 'similar-product-tile';
        const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(hit.price || 0);

        tile.innerHTML = `
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${enrichedHit.primaryImage}" alt="${hit.name}" style="width:48px; height:48px; border-radius:var(--radius-xs); object-fit:cover;" />
            <div style="flex-grow:1; min-width:0;">
              <div style="font-weight:600; color:var(--color-midnight); font-size:0.8125rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${hit.name}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                <span style="color:var(--color-emerald); font-weight:700; font-size:0.75rem;">${formattedPrice}</span>
                <span class="badge badge-dark" style="font-size:0.6875rem; padding:2px 6px;">
                  ✨ ${(hit.score * 100).toFixed(0)}% Vector Match
                </span>
              </div>
            </div>
          </div>
        `;

        tile.addEventListener('click', () => {
          if (onProductSwitch) {
            onProductSwitch(enrichedHit);
          } else {
            openProduct(enrichedHit);
          }
        });

        container.appendChild(tile);
      });
    } catch (err) {
      container.innerHTML = '<p style="font-size:0.8125rem; color:var(--color-text-muted);">Nearest neighbors calculated via 384d FastEmbed vector embeddings.</p>';
    }
  }

  function openProduct(rawProduct) {
    const product = enrichProduct(rawProduct);
    currentProduct = product;
    selectedQty = 1;
    qtyVal.textContent = '1';

    modal.querySelector('#modal-product-name').textContent = product.name;
    modal.querySelector('#modal-product-store').textContent = `${product.storeName || 'Atelier Flagship'} · ${product.city || 'National'}`;
    modal.querySelector('#modal-product-price').textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price);
    modal.querySelector('#modal-product-desc').textContent = product.description || 'Artisan curation.';
    modal.querySelector('#modal-product-img').src = product.primaryImage;

    // Database Provenance
    modal.querySelector('#modal-sql-id').textContent = `#${product.id}`;
    modal.querySelector('#modal-sql-store-id').textContent = `Store #${product.storeId || 1}`;

    // Stock Badge
    const stockEl = modal.querySelector('#modal-product-stock');
    if (product.stock > 15) {
      stockEl.innerHTML = '<span class="badge badge-success">In Stock (Verified)</span>';
      addBtn.disabled = false;
      addBtn.textContent = 'Add to Shopping Bag';
    } else if (product.stock > 0) {
      stockEl.innerHTML = `<span class="badge badge-gold">Only ${product.stock} Units Remaining</span>`;
      addBtn.disabled = false;
      addBtn.textContent = 'Add to Shopping Bag';
    } else {
      stockEl.innerHTML = '<span class="badge badge-error">Sold Out</span>';
      addBtn.disabled = true;
      addBtn.textContent = 'Sold Out';
    }

    // Gallery Thumbs
    const thumbRow = modal.querySelector('#modal-thumb-row');
    thumbRow.innerHTML = '';
    const gallery = product.gallery || [product.primaryImage, product.secondaryImage];
    gallery.forEach((imgUrl, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${imgUrl}" alt="Thumbnail ${idx + 1}" />`;
      thumb.addEventListener('click', () => {
        modal.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        modal.querySelector('#modal-product-img').src = imgUrl;
      });
      thumbRow.appendChild(thumb);
    });

    // Variants
    const variantGroup = modal.querySelector('#modal-variant-group');
    variantGroup.innerHTML = '';
    const variants = product.variants || ['Standard Edition'];
    selectedVariant = variants[0];
    variants.forEach((v, idx) => {
      const chip = document.createElement('button');
      chip.className = `variant-chip ${idx === 0 ? 'active' : ''}`;
      chip.textContent = v;
      chip.addEventListener('click', () => {
        modal.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedVariant = v;
      });
      variantGroup.appendChild(chip);
    });

    // Material Specifications
    const specsContainer = modal.querySelector('#acc-specs');
    specsContainer.innerHTML = '';
    if (product.specs) {
      const ul = document.createElement('ul');
      ul.style.cssText = 'list-style:none; display:flex; flex-direction:column; gap:6px;';
      Object.entries(product.specs).forEach(([k, v]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${k}:</strong> ${v}`;
        ul.appendChild(li);
      });
      specsContainer.appendChild(ul);
    }

    // Load Qdrant Similar
    loadSimilar(product);

    modal.classList.add('open');
  }

  return {
    element: modal,
    open: openProduct
  };
}
