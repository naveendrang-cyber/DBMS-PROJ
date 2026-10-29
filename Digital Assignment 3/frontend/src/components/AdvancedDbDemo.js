/**
 * Advanced Database Course Demonstration Component
 * Covers ACID Transactions, Rollback Verification, Multi-Table Joins,
 * Aggregations, EXPLAIN Execution Plans, and Distributed SQL (CockroachDB) Architecture.
 */

import { api } from '../services/api.js';

export function createAdvancedDbDemo() {
  const section = document.createElement('section');
  section.className = 'advanced-section';
  section.id = 'advanced-demo';

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <p class="section-label">Advanced Relational Theory &amp; Practice</p>
        <h2 class="section-title">Database Engineering &amp; Distributed Architecture</h2>
        <p class="section-desc">
          Live demonstrable queries, multi-table analytical joins, ACID transaction commit and rollback verification, and distributed consensus architectural analysis.
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="demo-tabs">
        <button class="demo-tab-btn active" data-tab="tab-acid">1. ACID Transactions &amp; Rollback</button>
        <button class="demo-tab-btn" data-tab="tab-joins">2. Multi-Table Joins</button>
        <button class="demo-tab-btn" data-tab="tab-aggregates">3. Aggregates &amp; Analytics</button>
        <button class="demo-tab-btn" data-tab="tab-explain">4. EXPLAIN Execution Plan</button>
        <button class="demo-tab-btn" data-tab="tab-architecture">5. CockroachDB Architecture</button>
      </div>

      <!-- TAB 1: ACID TRANSACTIONS & ROLLBACK DEMONSTRATION -->
      <div id="tab-acid" class="demo-panel active">
        <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm); margin-bottom:24px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:8px;">
            Interactive JDBC Transaction Demarcation &amp; Rollback Proof
          </h3>
          <p style="font-size:0.9375rem; color:var(--color-text-secondary); margin-bottom:18px;">
            Test genuine transactional atomicity. A real multi-step workflow creates an order and inserts line items. Triggering a simulated foreign key constraint violation causes an immediate <code>conn.rollback()</code>, proving zero partial state is retained.
          </p>

          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
            <button id="run-commit-btn" class="btn btn-emerald">
              Test Transaction Commit (Success Path)
            </button>
            <button id="run-rollback-btn" class="btn btn-danger">
              Test Transaction Rollback (Constraint Failure Path)
            </button>
          </div>

          <!-- Transaction Execution Timeline -->
          <div id="transaction-timeline-box" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span id="trans-outcome-badge" class="badge"></span>
              <span id="trans-engine-badge" class="badge badge-neutral"></span>
            </div>
            <div id="timeline-steps-container" class="acid-timeline"></div>
          </div>
        </div>

        <div>
          <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight); margin-bottom:8px;">
            Java JDBC Source Implementation (OrderJdbcDao.java)
          </h4>
          <pre class="code-box"><code>// Explicit JDBC Transaction Demarcation Pattern (com.omnimarket.da3.dao.OrderJdbcDao)
try (Connection conn = dataSource.getConnection()) {
    // 1. Disable auto-commit to begin transactional boundary
    conn.setAutoCommit(false);

    // 2. Insert master order record
    try (PreparedStatement orderStmt = conn.prepareStatement(insertOrderSql, Statement.RETURN_GENERATED_KEYS)) {
        orderStmt.setInt(1, req.getUserId());
        orderStmt.setBigDecimal(2, grandTotal);
        orderStmt.executeUpdate();
        // Retrieve generated primary key...
    }

    // 3. Insert child ordered items & update inventory atomically
    try (PreparedStatement itemStmt = conn.prepareStatement(insertItemSql)) {
        for (OrderedItem item : items) {
            itemStmt.setInt(1, orderId);
            itemStmt.setInt(2, item.getProductId());
            itemStmt.setInt(3, item.getQty());
            itemStmt.setBigDecimal(4, item.getPrice());
            itemStmt.executeUpdate();
            
            // Decrement inventory stock check
            productJdbcDao.deductStock(conn, item.getProductId(), item.getQty());
        }
    }

    // 4. Record payment settlement
    try (PreparedStatement payStmt = conn.prepareStatement(insertPaymentSql)) {
        payStmt.setInt(1, orderId);
        payStmt.setBigDecimal(2, grandTotal);
        payStmt.setString(3, req.getPayMethod());
        payStmt.executeUpdate();
    }

    // 5. Commit all changes atomically
    conn.commit();
} catch (SQLException e) {
    // If any step violates a constraint, rollback reverts ALL changes
    if (conn != null) {
        conn.rollback();
    }
    throw new DatabaseOperationException("Transaction failed: " + e.getMessage(), e);
}</code></pre>
        </div>
      </div>

      <!-- TAB 2: MULTI-TABLE JOINS -->
      <div id="tab-joins" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            5-Table Relational Join Demonstration
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Assembles orders, users, ordered items, products, and settlements into a single relational view.
          </p>
          <pre class="code-box"><code>SELECT o.id AS order_id,
       u.first_name || ' ' || u.last_name AS customer_name,
       u.email AS customer_email,
       p.name AS product_name,
       oi.qty, oi.price AS unit_price,
       (oi.qty * oi.price) AS line_total,
       o.status AS order_status,
       pay.pay_method, pay.pay_status
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN ordered_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
LEFT JOIN payments pay ON o.id = pay.order_id
ORDER BY o.id ASC, oi.id ASC;</code></pre>
          <button id="load-joins-btn" class="btn btn-outline btn-sm" style="margin-bottom:16px;">Refresh Joined Data</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table" id="joins-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Patron</th>
                <th>Email</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody id="joins-body">
              <tr><td colspan="9" style="text-align:center;">Click "Refresh Joined Data" to execute query.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: AGGREGATES & ANALYTICS -->
      <div id="tab-aggregates" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            Store Revenue &amp; Inventory Aggregation (GROUP BY)
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Computes product counts, inventory sums, and price metrics per store using standard SQL aggregate functions.
          </p>
          <pre class="code-box"><code>SELECT s.id AS store_id,
       s.name AS store_name,
       s.city, s.rating,
       COUNT(p.id) AS total_products,
       COALESCE(SUM(p.stock), 0) AS total_inventory,
       ROUND(AVG(p.price), 2) AS average_product_price,
       MIN(p.price) AS min_price,
       MAX(p.price) AS max_price
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name, s.city, s.rating
ORDER BY total_products DESC, s.name ASC;</code></pre>
          <button id="load-aggregates-btn" class="btn btn-outline btn-sm" style="margin-bottom:16px;">Refresh Aggregation</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table" id="aggregates-table">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>Store Name</th>
                <th>City</th>
                <th>Rating</th>
                <th>Products</th>
                <th>Total Inventory</th>
                <th>Avg Price (INR)</th>
                <th>Min Price</th>
                <th>Max Price</th>
              </tr>
            </thead>
            <tbody id="aggregates-body">
              <tr><td colspan="9" style="text-align:center;">Click "Refresh Aggregation" to execute query.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: EXPLAIN EXECUTION PLAN -->
      <div id="tab-explain" class="demo-panel">
        <div style="margin-bottom:18px;">
          <h3 style="font-family:var(--font-serif); font-size:1.5rem; color:var(--color-midnight); margin-bottom:6px;">
            Query Execution Plan Analyzer (EXPLAIN)
          </h3>
          <p style="font-size:0.875rem; color:var(--color-text-secondary);">
            Inspect how the relational query optimizer uses indexes versus full table scans to resolve queries.
          </p>
          <div style="display:flex; gap:12px; margin-bottom:14px;">
            <select id="explain-query-select" class="form-select" style="flex-grow:1;">
              <option value="SELECT * FROM products WHERE price > 3000.00;">Query 1: Catalog price range filter (Uses idx_products_price)</option>
              <option value="SELECT * FROM orders WHERE user_id = 4;">Query 2: Order lookup by user (Uses idx_orders_user_id)</option>
              <option value="SELECT * FROM products p JOIN stores s ON p.store_id = s.id;">Query 3: Product-Store Relational Hash/Merge Join</option>
            </select>
            <button id="run-explain-btn" class="btn btn-primary btn-sm">Analyze Plan</button>
          </div>
          <div id="explain-results-box" style="background:var(--color-midnight); color:#9DB0A7; padding:20px; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.8125rem; overflow-x:auto;">
            Select a query above and click "Analyze Plan" to inspect the query plan.
          </div>
        </div>
      </div>

      <!-- TAB 5: COCKROACHDB DISTRIBUTED SQL ARCHITECTURE -->
      <div id="tab-architecture" class="demo-panel">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; margin-bottom:32px;">
          
          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-emerald" style="margin-bottom:12px;">Consensus Layer</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              Multi-Raft Consensus
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              Data is segmented into continuous 64MB chunks called <strong>Ranges</strong>. Each range forms an independent 3-node or 5-node Raft consensus group. Writes require only a quorum of replicas (e.g. 2 of 3) before committing, guaranteeing zero data loss (RPO = 0) even under node or zone failure.
            </p>
          </div>

          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-gold" style="margin-bottom:12px;">Concurrency Control</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              Serializable Isolation &amp; MVCC
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              CockroachDB defaults to the highest SQL isolation level: <strong>SERIALIZABLE</strong>. It combines Multi-Version Concurrency Control (MVCC) with Hybrid Logical Clocks (HLC) to coordinate distributed transactions without centralized clock synchronizers.
            </p>
          </div>

          <div style="background:var(--color-ivory); border:1px solid var(--color-border); padding:24px; border-radius:var(--radius-sm);">
            <span class="badge badge-neutral" style="margin-bottom:12px;">Wire Protocol</span>
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight); margin-bottom:8px;">
              PostgreSQL Wire Compatibility
            </h4>
            <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
              CockroachDB speaks the standard PostgreSQL v3 protocol natively. The Spring Boot backend connects seamlessly using <code>org.postgresql.Driver</code>, executing prepared statements, connection pooling, and SSL encryption without bespoke drivers.
            </p>
          </div>
        </div>

        <div style="background:var(--color-ivory); padding:20px; border-radius:var(--radius-sm); border:1px solid var(--color-border);">
          <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight); margin-bottom:8px;">
            Academic Course Note: Distributed vs. Local Environments
          </h4>
          <p style="font-size:0.875rem; color:var(--color-text-secondary); line-height:1.6;">
            <strong>Distinguishing Live Tests from Conceptual Architecture:</strong> The JDBC transaction, commit, and rollback demonstrations run genuine code against the active database. When pointing to CockroachDB Cloud via <code>DB_URL</code>, the multi-node consensus occurs across distributed regions; when running locally via the offline SQLite fallback, the identical SQL syntax and JDBC transaction primitives ensure zero configuration setup for evaluators.
          </p>
        </div>
      </div>
    </div>
  `;

  // Tab switching logic
  section.querySelectorAll('.demo-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      section.querySelectorAll('.demo-tab-btn').forEach(b => b.classList.remove('active'));
      section.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = section.querySelector(`#${target}`);
      if (panel) panel.classList.add('active');

      // Auto-load tab data
      if (target === 'tab-joins') loadJoins();
      if (target === 'tab-aggregates') loadAggregates();
    });
  });

  // ACID Transaction Demo Controls
  const commitBtn = section.querySelector('#run-commit-btn');
  const rollbackBtn = section.querySelector('#run-rollback-btn');
  const timelineBox = section.querySelector('#transaction-timeline-box');
  const stepsContainer = section.querySelector('#timeline-steps-container');
  const outcomeBadge = section.querySelector('#trans-outcome-badge');
  const engineBadge = section.querySelector('#trans-engine-badge');

  async function runAcidTest(shouldFail) {
    commitBtn.disabled = true;
    rollbackBtn.disabled = true;
    timelineBox.style.display = 'block';
    stepsContainer.innerHTML = '<div style="padding:16px; color:var(--color-text-muted);">Executing JDBC transaction steps...</div>';

    try {
      const resp = await api.runAcidTransactionDemo(shouldFail);

      outcomeBadge.className = resp.rolledBack ? 'badge badge-error' : 'badge badge-success';
      outcomeBadge.textContent = resp.outcome;
      engineBadge.textContent = `Database Engine: ${resp.databaseEngine || 'SQL RDBMS'}`;

      stepsContainer.innerHTML = resp.executionSteps.map(step => {
        let stepClass = 'timeline-step';
        if (step.includes('ROLLBACK') || step.includes('EXCEPTION')) stepClass += ' rollback';
        if (step.includes('COMMITTED') || step.includes('VERIFICATION')) stepClass += ' commit';
        return `<div class="${stepClass}">${escapeHtml(step)}</div>`;
      }).join('');

    } catch (err) {
      stepsContainer.innerHTML = `<div class="timeline-step rollback">Error communicating with backend: ${err.message}</div>`;
    } finally {
      commitBtn.disabled = false;
      rollbackBtn.disabled = false;
    }
  }

  commitBtn.addEventListener('click', () => runAcidTest(false));
  rollbackBtn.addEventListener('click', () => runAcidTest(true));

  // Multi-table Joins Loader
  const loadJoinsBtn = section.querySelector('#load-joins-btn');
  const joinsBody = section.querySelector('#joins-body');

  async function loadJoins() {
    joinsBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Executing multi-table relational join...</td></tr>';
    try {
      const rows = await api.getAdvancedJoins();
      if (rows.length === 0) {
        joinsBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No order records found to join.</td></tr>';
        return;
      }
      joinsBody.innerHTML = rows.map(r => `
        <tr>
          <td><strong>#${r.order_id}</strong></td>
          <td>${escapeHtml(r.customer_name || '')}</td>
          <td>${escapeHtml(r.customer_email || '')}</td>
          <td>${escapeHtml(r.product_name || '')}</td>
          <td>${r.qty}</td>
          <td>&#8377;${parseFloat(r.unit_price).toFixed(2)}</td>
          <td>&#8377;${parseFloat(r.line_total).toFixed(2)}</td>
          <td><span class="badge ${r.order_status === 'completed' ? 'badge-success' : 'badge-gold'}">${r.order_status}</span></td>
          <td>${escapeHtml(r.pay_method || 'None')} (${escapeHtml(r.pay_status || 'unpaid')})</td>
        </tr>
      `).join('');
    } catch (err) {
      joinsBody.innerHTML = `<tr><td colspan="9" style="color:var(--color-error); text-align:center;">Failed to execute join: ${err.message}</td></tr>`;
    }
  }
  loadJoinsBtn.addEventListener('click', loadJoins);

  // Aggregates Loader
  const loadAggBtn = section.querySelector('#load-aggregates-btn');
  const aggBody = section.querySelector('#aggregates-body');

  async function loadAggregates() {
    aggBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Executing GROUP BY aggregation...</td></tr>';
    try {
      const rows = await api.getAdvancedAggregates();
      if (rows.length === 0) {
        aggBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No store records found.</td></tr>';
        return;
      }
      aggBody.innerHTML = rows.map(r => `
        <tr>
          <td>#${r.store_id}</td>
          <td><strong>${escapeHtml(r.store_name)}</strong></td>
          <td>${escapeHtml(r.city || '')}</td>
          <td>&#9733; ${parseFloat(r.rating || 5.0).toFixed(2)}</td>
          <td>${r.total_products}</td>
          <td>${r.total_inventory} units</td>
          <td>&#8377;${parseFloat(r.average_product_price || 0).toFixed(2)}</td>
          <td>&#8377;${parseFloat(r.min_price || 0).toFixed(2)}</td>
          <td>&#8377;${parseFloat(r.max_price || 0).toFixed(2)}</td>
        </tr>
      `).join('');
    } catch (err) {
      aggBody.innerHTML = `<tr><td colspan="9" style="color:var(--color-error); text-align:center;">Failed to execute aggregates: ${err.message}</td></tr>`;
    }
  }
  loadAggBtn.addEventListener('click', loadAggregates);

  // EXPLAIN Plan Loader
  const runExplainBtn = section.querySelector('#run-explain-btn');
  const explainSelect = section.querySelector('#explain-query-select');
  const explainResultsBox = section.querySelector('#explain-results-box');

  async function runExplain() {
    const query = explainSelect.value;
    explainResultsBox.textContent = 'Generating query execution plan...';
    try {
      const plan = await api.explainQuery(query);
      explainResultsBox.textContent = JSON.stringify(plan, null, 2);
    } catch (err) {
      explainResultsBox.textContent = 'Execution plan note: ' + err.message;
    }
  }
  runExplainBtn.addEventListener('click', runExplain);

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return section;
}
