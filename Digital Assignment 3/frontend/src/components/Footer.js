/**
 * OMNI ATELIER — LUXURY ACADEMIC FOOTER
 * Academic credentials, course credits, architectural compliance guarantees, and technical badges.
 */

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <!-- Col 1: Brand & Academic Context -->
        <div class="footer-col">
          <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:14px;">
            <span style="font-family:var(--font-serif); font-size:1.625rem; font-weight:500; color:var(--color-white);">OMNI ATELIER</span>
            <span style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--color-gold-light); border:1px solid var(--color-gold-border); padding:2px 6px; border-radius:2px;">DA3</span>
          </div>
          <p style="margin-bottom:18px;">
            An advanced multi-vendor luxury commerce storefront built for Database Management Systems Digital Assignment 3. Demonstrates parameterized SQL persistence, parameterized statement execution, and explicit multi-table ACID transaction demarcation on CockroachDB distributed SQL.
          </p>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <span class="badge badge-dark">Dr. Sobitha Ahila</span>
            <span class="badge badge-dark">Git: Harsh2</span>
            <span class="badge badge-dark">10 Normalized Tables</span>
          </div>
        </div>

        <!-- Col 2: Architectural Principles -->
        <div class="footer-col">
          <h5>Persistence Architecture</h5>
          <ul>
            <li><a href="#storefront">Cloudflare Workers API</a></li>
            <li><a href="#academic-suite">Zero-ORM Hibernate Bypass</a></li>
            <li><a href="#academic-suite">Hyperdrive Connection Pooling</a></li>
            <li><a href="#academic-suite">Parameterized Statements</a></li>
            <li><a href="#academic-suite">Explicit Transaction Isolation</a></li>
          </ul>
        </div>

        <!-- Col 3: Distributed SQL -->
        <div class="footer-col">
          <h5>Distributed SQL</h5>
          <ul>
            <li><a href="#academic-suite">CockroachDB (PostgreSQL Wire Protocol)</a></li>
            <li><a href="#academic-suite">Raft Consensus Replication</a></li>
            <li><a href="#academic-suite">SERIALIZABLE Isolation</a></li>
            <li><a href="#academic-suite">40001 Transaction Retry</a></li>
            <li><a href="#academic-suite">SELECT ... FOR UPDATE Row Locks</a></li>
          </ul>
        </div>

        <!-- Col 4: Academic Compliance -->
        <div class="footer-col">
          <h5>Academic Evaluation</h5>
          <ul>
            <li><a href="#academic-suite">Action 1: Parameterized INSERT</a></li>
            <li><a href="#academic-suite">Action 2: Parameterized DELETE</a></li>
            <li><a href="#academic-suite">Action 3: Parameterized UPDATE</a></li>
            <li><a href="#academic-suite">5-Table Relational JOIN</a></li>
            <li><a href="#academic-suite">ACID Transaction Rollback Proof</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div>
          <span>&copy; 2026 Omni Atelier · Digital Assignment 3 (DBMS Course Assessment)</span>
        </div>
        <div style="display:flex; gap:20px; font-family:var(--font-mono); font-size:0.6875rem;">
          <span>CLOUDFLARE HYPERDRIVE</span>
          <span>COCKROACHDB</span>
          <span>CLOUDFLARE WORKERS</span>
        </div>
      </div>
    </div>
  `;

  return footer;
}
