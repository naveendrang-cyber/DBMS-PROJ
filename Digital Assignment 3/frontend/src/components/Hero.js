/**
 * OMNI ATELIER — LUXURY HERO COMPONENT
 * Architectural split layout, confident editorial typography, live metrics, and interactive spotlight card.
 */

export function createHero(onExploreClick, onSemanticSearchClick, onSpotlightQuickView) {
  const hero = document.createElement('section');
  hero.className = 'hero-section';
  hero.id = 'hero-section';

  hero.innerHTML = `
    <div class="container">
      <div class="hero-split-grid">
        <!-- Left Editorial Content Column -->
        <div class="hero-content">
          <div class="hero-badge-row">
            <span class="badge badge-emerald">Spring Boot 3.3.5 × Java 17</span>
            <span class="badge badge-gold">100% Direct JDBC Persistence</span>
          </div>

          <h1 class="hero-title">
            Precision Engineering. <em>Sartorial Rigor.</em>
          </h1>

          <p class="hero-description">
            A bespoke multi-vendor commerce platform where uncompromising physical craftsmanship converges with distributed database architecture. Engineered with direct Java JDBC, parameterized statements, explicit ACID isolation, and 384-dimensional Qdrant vector semantic discovery.
          </p>

          <div class="hero-cta-group">
            <a href="#storefront" class="btn btn-primary btn-lg" id="hero-explore-btn">
              Explore 36 Curations ↓
            </a>
            <button class="btn btn-outline btn-lg" id="hero-vector-btn">
              ✨ Experience Qdrant AI
            </button>
          </div>

          <!-- Live Relational Metrics Bar -->
          <div class="hero-metrics-bar">
            <div class="hero-metric-item">
              <h4 id="hero-stat-products">36 Curations</h4>
              <p>Verified Artifacts</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-stores">3 Flagships</h4>
              <p>Boutique Stores</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-rev">&#8377;36,796</h4>
              <p>Settled Volume</p>
            </div>
            <div class="hero-metric-item">
              <h4 id="hero-stat-engine" style="color:var(--color-emerald);">100% JDBC</h4>
              <p>Zero-ORM Rigor</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Spotlight Showcase Card -->
        <div class="hero-showcase-column">
          <div class="hero-showcase-card" id="hero-spotlight-card">
            <div class="showcase-image-wrap">
              <img 
                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80" 
                alt="Wireless Mechanical Keyboard Spotlight" 
                class="showcase-image" 
                loading="eager"
              />
              <div class="product-badge-overlay">
                <span class="badge badge-dark">Flagship Spotlight</span>
                <span class="badge badge-success">Verified In Stock</span>
              </div>
            </div>

            <div class="showcase-details">
              <div class="showcase-header">
                <div>
                  <span style="font-size:0.6875rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-emerald); font-weight:700;">
                    TECHZONE FLAGSHIP · BANGALORE
                  </span>
                  <h3 class="showcase-title">Wireless Mechanical Keyboard</h3>
                </div>
                <span class="showcase-price">&#8377;3,499.00</span>
              </div>

              <p style="font-size:0.8125rem; color:var(--color-text-secondary); line-height:1.5;">
                Anodized aluminum chassis with custom lubricated switches, Bluetooth 5.1 multi-device pairing, and USB-C.
              </p>

              <div class="showcase-tags">
                <span class="hotspot-pill">✦ 6063 Billet Aluminum</span>
                <span class="hotspot-pill">✦ 384d FastEmbed Vector</span>
                <span class="hotspot-pill">✦ Strict ACID Foreign Keys</span>
              </div>

              <div style="margin-top:16px; display:flex; gap:10px;">
                <button class="btn btn-outline btn-sm" id="hero-spotlight-inspect" style="flex:1;">
                  Inspect Artifact
                </button>
                <button class="btn btn-primary btn-sm" id="hero-spotlight-add" style="flex:1;">
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  const exploreBtn = hero.querySelector('#hero-explore-btn');
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (onExploreClick) onExploreClick();
  });

  const vectorBtn = hero.querySelector('#hero-vector-btn');
  vectorBtn.addEventListener('click', () => {
    if (onSemanticSearchClick) onSemanticSearchClick();
  });

  const inspectBtn = hero.querySelector('#hero-spotlight-inspect');
  inspectBtn.addEventListener('click', () => {
    if (onSpotlightQuickView) onSpotlightQuickView(1); // Inspect product 1
  });

  const addBtn = hero.querySelector('#hero-spotlight-add');
  addBtn.addEventListener('click', () => {
    if (onSpotlightQuickView) onSpotlightQuickView(1, true); // Add product 1 to cart
  });

  return hero;
}
