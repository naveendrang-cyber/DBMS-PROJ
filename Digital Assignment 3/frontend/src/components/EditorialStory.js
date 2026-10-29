/**
 * OMNI ATELIER — EDITORIAL STORYTELLING & CAMPAIGN MANIFESTO
 * High-contrast Midnight Green section connecting artisanal goods with database architecture rigor.
 */

export function createEditorialStory(onInspectDbClick) {
  const section = document.createElement('section');
  section.className = 'editorial-manifesto-section';
  section.id = 'editorial-manifesto';

  section.innerHTML = `
    <div class="container">
      <div class="manifesto-grid">
        <!-- Left Editorial Quote & Narrative Column -->
        <div class="manifesto-narrative">
          <div class="manifesto-quote-mark">&ldquo;</div>
          <h2 class="manifesto-headline">
            Craftsmanship Without Abstraction. <em>Integrity Without Compromise.</em>
          </h2>
          <p class="manifesto-body">
            Just as our master leatherworkers refuse synthetic veneers and our acoustic engineers eschew compressed signal paths, Omni Atelier rejects opaque ORM layers. Every query, mutation, and relational join is executed through direct, unadulterated Java JDBC with explicit connection lifecycle control.
          </p>
          <p class="manifesto-body">
            When a patron commissions a handcrafted artifact, our distributed consensus layer verifies real-time stock balances across 10 normalized relational tables before atomically committing the transaction.
          </p>
          <div>
            <button class="btn btn-outline-white btn-sm" id="manifesto-inspect-db-btn">
              Explore Academic Database Architecture →
            </button>
          </div>
        </div>

        <!-- Right Architectural Principles Cards -->
        <div class="manifesto-cards">
          <!-- Card 1: Direct JDBC -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">⚡</span>
              <h3 class="manifesto-card-title">100% Direct Java JDBC Persistence</h3>
            </div>
            <p class="manifesto-card-text">
              Zero ORM overhead. Every relational read and write leverages strictly parameterized <code>PreparedStatement</code> and HikariCP connection pools, preventing SQL injection while guaranteeing predictable sub-millisecond execution.
            </p>
          </div>

          <!-- Card 2: ACID Transactions -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">🔒</span>
              <h3 class="manifesto-card-title">Explicit Multi-Table ACID Atomicity</h3>
            </div>
            <p class="manifesto-card-text">
              Orders, line items, payment settlements, and stock deductions are bound within an explicit transactional demarcation boundary (<code>setAutoCommit(false)</code>) with automated rollback on simulated failure.
            </p>
          </div>

          <!-- Card 3: Distributed SQL -->
          <div class="manifesto-card">
            <div class="manifesto-card-header">
              <span class="manifesto-card-icon">✦</span>
              <h3 class="manifesto-card-title">CockroachDB Distributed SQL</h3>
            </div>
            <p class="manifesto-card-text">
              Every vendor, order, and payment lives in CockroachDB: Raft-replicated ranges, SERIALIZABLE isolation by default, and automatic client-side retry of conflicting checkouts (SQLSTATE 40001).
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const inspectBtn = section.querySelector('#manifesto-inspect-db-btn');
  if (inspectBtn) {
    inspectBtn.addEventListener('click', () => {
      if (onInspectDbClick) onInspectDbClick();
    });
  }

  return section;
}
