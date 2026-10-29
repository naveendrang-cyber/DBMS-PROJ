/**
 * SQL Sandbox / Console Component
 * Executes live arbitrary queries against CockroachDB (read-only transaction)
 */

import { api } from '../services/api.js';

export function createSqlSandbox() {
  const section = document.createElement('section');
  section.className = 'catalog-section';
  section.id = 'sql-sandbox';
  section.style.backgroundColor = 'var(--color-ivory)';
  section.style.borderTop = '1px solid var(--color-border)';

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <p class="section-label">Interactive SQL Workspace</p>
        <h2 class="section-title">Educational Query Console</h2>
        <p class="section-desc">
          Execute standard ANSI SQL queries against the live CockroachDB database (read-only). Inspect execution time, returned columns, and dataset rows.
        </p>
      </div>

      <div class="admin-card">
        <div style="margin-bottom:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:0.8125rem; font-weight:600; color:var(--color-text-secondary);">Sample Queries:</span>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT id, name, price, stock FROM products ORDER BY price DESC;">Products by Price</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT s.name AS store, COUNT(p.id) AS total_products, AVG(p.price) AS avg_price FROM stores s JOIN products p ON s.id = p.store_id GROUP BY s.id, s.name;">Store Product Counts</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT o.id, u.first_name, o.total_price, o.status FROM orders o JOIN users u ON o.user_id = u.user_id;">Orders with Customer</button>
          <button class="filter-btn sample-sql-btn" data-sql="SELECT * FROM roles;">Roles Table</button>
        </div>

        <div style="margin-bottom:16px;">
          <textarea id="sql-query-input" class="form-input mono" rows="4" style="width:100%; font-size:0.875rem;" placeholder="Enter SQL query (e.g., SELECT * FROM products;)">SELECT id, name, price, stock FROM products ORDER BY price DESC;</textarea>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div id="sql-execution-meta" style="font-size:0.8125rem; color:var(--color-text-muted);">
            Ready to execute.
          </div>
          <button id="run-sql-btn" class="btn btn-primary">Execute Query</button>
        </div>

        <div class="data-table-wrap">
          <table class="data-table" id="sql-results-table">
            <thead id="sql-table-head"><tr><th>Execution results will appear here</th></tr></thead>
            <tbody id="sql-table-body"><tr><td style="color:var(--color-text-muted);">Run a query above to see rows.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  const queryInput = section.querySelector('#sql-query-input');
  const runBtn = section.querySelector('#run-sql-btn');
  const metaEl = section.querySelector('#sql-execution-meta');
  const tableHead = section.querySelector('#sql-table-head');
  const tableBody = section.querySelector('#sql-table-body');

  section.querySelectorAll('.sample-sql-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      queryInput.value = btn.getAttribute('data-sql');
      executeQuery();
    });
  });

  async function executeQuery() {
    const query = queryInput.value.trim();
    if (!query) {
      alert("Please enter a query to execute.");
      return;
    }

    runBtn.disabled = true;
    runBtn.textContent = 'Executing...';
    metaEl.textContent = 'Running query on database...';

    try {
      const resp = await api.executeSql(query);

      if (!resp.success) {
        metaEl.innerHTML = `<span style="color:var(--color-error)">Error: ${resp.error}</span>`;
        tableHead.innerHTML = '<tr><th style="color:var(--color-error)">Error</th></tr>';
        tableBody.innerHTML = `<tr><td style="color:var(--color-error);">${resp.error}</td></tr>`;
        return;
      }

      metaEl.innerHTML = `Query completed in <strong>${resp.executionTime} ms</strong>. Total rows: <strong>${resp.rowCount || 0}</strong>.`;

      if (resp.columns && resp.columns.length > 0) {
        tableHead.innerHTML = `<tr>${resp.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;
      } else {
        tableHead.innerHTML = '<tr><th>Result</th></tr>';
      }

      if (resp.rows && resp.rows.length > 0) {
        tableBody.innerHTML = resp.rows.map(row => `
          <tr>
            ${resp.columns.map(c => {
              const val = row[c];
              return `<td>${val !== null && val !== undefined ? String(val) : '<span style="color:#8E9A94">NULL</span>'}</td>`;
            }).join('')}
          </tr>
        `).join('');
      } else {
        tableBody.innerHTML = `<tr><td colspan="${resp.columns?.length || 1}" style="text-align:center; padding:16px; color:var(--color-text-muted);">${resp.message || 'No rows returned.'}</td></tr>`;
      }

    } catch (err) {
      metaEl.innerHTML = `<span style="color:var(--color-error)">Network / Execution Error: ${err.message}</span>`;
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = 'Execute Query';
    }
  }

  runBtn.addEventListener('click', executeQuery);

  return section;
}
