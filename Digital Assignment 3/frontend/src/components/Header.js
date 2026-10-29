/**
 * OMNI ATELIER — LUXURY HEADER & NAVIGATION
 * Sticky header with micro status bar, direct JDBC health badge, and animated shopping bag trigger.
 */

export function createHeader(onCartClick, onNavClick) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.id = 'site-header';

  header.innerHTML = `
    <!-- Top Micro Announcement / Academic Bar -->
    <div class="header-top">
      <div class="container">
        <div class="header-top-inner">
          <div style="display:flex; align-items:center; gap:16px;">
            <span>DBMS DA3 · DR. SOBITHA AHILA</span>
            <span style="opacity:0.4;">|</span>
            <span style="color:var(--color-gold-light);">GIT BRANCH: Harsh2</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span id="header-engine-indicator">ENGINE: COCKROACHDB (100% DIRECT JDBC)</span>
            <span style="opacity:0.4;">|</span>
            <span id="header-db-indicator" style="color:var(--color-gold-light);">COCKROACHDB: SERIALIZABLE ISOLATION</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Luxury Navigation Bar -->
    <div class="container">
      <nav class="header-nav">
        <a href="#storefront" class="brand-logo" id="brand-link" aria-label="Omni Atelier Home">
          <span class="brand-name">OMNI ATELIER</span>
          <span class="brand-badge">JDBC × COCKROACHDB</span>
        </a>

        <ul class="nav-links">
          <li><a href="#storefront" class="nav-link active" data-nav="storefront">Collection</a></li>
          <li><a href="#category-discovery" class="nav-link" data-nav="category-discovery">Disciplines</a></li>
          <li><a href="#editorial-manifesto" class="nav-link" data-nav="editorial-manifesto">Manifesto</a></li>
          <li><a href="#academic-suite" class="nav-link" data-nav="academic-suite">Database Suite ▾</a></li>
        </ul>

        <div class="header-actions">
          <!-- Search Quick Action -->
          <button id="header-search-btn" class="btn btn-outline btn-sm btn-pill" style="padding:6px 12px; font-size:0.75rem;" title="Search catalog (Ctrl + K)">
            <span>🔍 Search</span>
            <kbd style="font-family:var(--font-mono); font-size:0.6875rem; background:var(--color-ivory); padding:1px 5px; border-radius:3px; border:1px solid var(--color-border); margin-left:4px;">/</kbd>
          </button>

          <!-- Database Live Health Badge -->
          <div id="system-health-badge" class="badge badge-neutral" title="Checking database connection...">
            <span class="pulse-dot" id="system-health-dot"></span>
            <span id="health-text" style="font-family:var(--font-mono); font-size:0.75rem;">Connecting...</span>
          </div>

          <!-- Bag / Cart Trigger Button -->
          <button id="cart-btn" class="cart-trigger" aria-label="Open Shopping Bag">
            <span>Bag</span>
            <span id="header-bag-count" class="cart-count">0</span>
          </button>
        </div>
      </nav>
    </div>
  `;

  // Attach navigation listeners
  header.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      header.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (onNavClick) onNavClick(target);
    });
  });

  const brandLink = header.querySelector('#brand-link');
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (onNavClick) onNavClick('storefront');
  });

  const cartBtn = header.querySelector('#cart-btn');
  cartBtn.addEventListener('click', () => {
    if (onCartClick) onCartClick();
  });

  const searchBtn = header.querySelector('#header-search-btn');
  searchBtn.addEventListener('click', () => {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => searchInput.focus(), 300);
    }
  });

  // Global keyboard shortcut '/' to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const searchInput = document.getElementById('catalog-search');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }
    }
  });

  return header;
}
