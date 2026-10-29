/**
 * OMNI ATELIER — CATEGORY DISCOVERY (EDITORIAL TILES)
 * Curated category browsing with visual storytelling and direct catalog filter dispatch.
 */

export function createCategoryDiscovery(onSelectCategory) {
  const section = document.createElement('section');
  section.className = 'category-discovery-section';
  section.id = 'category-discovery';

  section.innerHTML = `
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
        <div>
          <p class="section-eyebrow">01 / Curated Disciplines</p>
          <h2 class="section-headline">Architectural Categories</h2>
          <p class="section-subheadline">
            Each discipline represents certified boutique workshops adhering to sustainable craft and uncompromising material provenance.
          </p>
        </div>
        <div>
          <button class="btn btn-outline btn-sm" id="cat-view-all-btn">
            View All Curations (36) →
          </button>
        </div>
      </div>

      <div class="category-tiles-grid">
        <!-- 01: Audio -->
        <div class="category-tile" data-category="audio" role="button" tabindex="0" aria-label="Explore High-Fidelity Audio">
          <img 
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80" 
            alt="High-Fidelity Audio & Acoustics" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 01</span>
            <h3 class="category-tile-name">High-Fidelity Audio &amp; Acoustics</h3>
            <div class="category-tile-count">
              <span>9 Curations · Planar &amp; Solid Brass</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 02: Computing -->
        <div class="category-tile" data-category="computing" role="button" tabindex="0" aria-label="Explore Precision Computing">
          <img 
            src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80" 
            alt="Precision Computing & Peripherals" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 02</span>
            <h3 class="category-tile-name">Artisan Computing &amp; Workstations</h3>
            <div class="category-tile-count">
              <span>9 Curations · CNC 6063 Aluminum</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 03: Apparel -->
        <div class="category-tile" data-category="apparel" role="button" tabindex="0" aria-label="Explore Tailored Apparel">
          <img 
            src="https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80" 
            alt="Tailored Apparel & Sartorial Goods" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 03</span>
            <h3 class="category-tile-name">Tailored Apparel &amp; Sartorial Goods</h3>
            <div class="category-tile-count">
              <span>9 Curations · Kurabo Raw Selvedge</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>

        <!-- 04: Leathercraft -->
        <div class="category-tile" data-category="leathercraft" role="button" tabindex="0" aria-label="Explore Leathercraft">
          <img 
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" 
            alt="Leathercraft & Everyday Accoutrements" 
            class="category-tile-bg"
            loading="lazy"
          />
          <div class="category-tile-overlay">
            <span class="category-tile-index">DISCIPLINE 04</span>
            <h3 class="category-tile-name">Leathercraft &amp; Accoutrements</h3>
            <div class="category-tile-count">
              <span>9 Curations · Badalassi Carlo Leather</span>
              <span class="category-tile-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach click handlers
  section.querySelectorAll('.category-tile').forEach(tile => {
    const cat = tile.getAttribute('data-category');
    const trigger = () => {
      if (onSelectCategory) onSelectCategory(cat);
    };
    tile.addEventListener('click', trigger);
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  });

  const viewAllBtn = section.querySelector('#cat-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      if (onSelectCategory) onSelectCategory('all');
    });
  }

  return section;
}
