/**
 * Professor Database Management Interface
 * Strict Academic Requirement: Dedicated section with EXACTLY three primary action buttons in order:
 * 1. Insert
 * 2. Delete
 * 3. Update
 * Connected directly to Java backend via JDBC PreparedStatement.
 */

import { api } from '../services/api.js';

export function createProfessorDbManager() {
  const section = document.createElement('section');
  section.className = 'admin-section';
  section.id = 'professor-db';

  let selectedTable = 'products';
  let currentAction = 'none'; // 'insert', 'delete', 'update'
  let tableColumns = [];
  let tableRecords = [];
  let adminApiKey = 'omni-admin-secret-da3';

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <p class="section-label">Faculty Evaluation Module</p>
        <h2 class="section-title">Database Management Interface</h2>
        <p class="section-desc">
          Evaluator interface connected directly to the Java Spring Boot backend. Every action is executed via <code>java.sql.PreparedStatement</code> and standard JDBC drivers.
        </p>
      </div>

      <div class="admin-card">
        <!-- Control bar: Table Selector, API Key, and the EXACT THREE PRIMARY ACTION BUTTONS -->
        <div class="admin-action-bar">
          <div class="table-selector-wrap">
            <label for="admin-table-select" style="font-size:0.875rem; font-weight:600; color:var(--color-midnight);">Target Table:</label>
            <select id="admin-table-select" class="form-select">
              <option value="products" selected>products (Products Catalog)</option>
              <option value="stores">stores (Boutique Flagships)</option>
              <option value="users">users (Marketplace Patrons &amp; Sellers)</option>
              <option value="orders">orders (Sales Transactions)</option>
              <option value="ordered_items">ordered_items (Line Items)</option>
              <option value="sellers">sellers (Vendor Profiles)</option>
              <option value="payments">payments (Settlements)</option>
              <option value="reviews">reviews (Customer Feedback)</option>
              <option value="withdrawals">withdrawals (Seller Payouts)</option>
              <option value="roles">roles (Access Control)</option>
            </select>
          </div>

          <!-- THE EXACT THREE PRIMARY ACTION BUTTONS IN STRICT REQUIRED ORDER -->
          <div class="primary-action-buttons">
            <button id="btn-action-insert" class="btn btn-action-insert" title="Execute Parameterized JDBC INSERT">
              1. Insert
            </button>
            <button id="btn-action-delete" class="btn btn-action-delete" title="Execute Parameterized JDBC DELETE">
              2. Delete
            </button>
            <button id="btn-action-update" class="btn btn-action-update" title="Execute Parameterized JDBC UPDATE">
              3. Update
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--color-text-muted);">Admin Auth:</span>
            <input type="password" id="admin-api-key-input" class="form-input" style="padding:6px 10px; width:140px; font-size:0.75rem;" value="${adminApiKey}" placeholder="API Key" />
          </div>
        </div>

        <!-- Result / Feedback Banner -->
        <div id="mutation-result-banner" class="mutation-result-banner"></div>

        <!-- Dynamic Panels for the 3 Actions -->
        
        <!-- PANEL 1: INSERT FORM -->
        <div id="panel-insert" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-midnight);">
              Action 1: Parameterized JDBC INSERT &mdash; Table: <span class="table-name-badge serif">${selectedTable}</span>
            </h4>
            <span class="badge badge-emerald">PreparedStatement.executeUpdate()</span>
          </div>
          <form id="form-insert">
            <div id="insert-fields-grid" class="form-grid"></div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-emerald" id="submit-insert-btn">Execute Parameterized INSERT</button>
            </div>
          </form>
        </div>

        <!-- PANEL 2: DELETE FORM -->
        <div id="panel-delete" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-error);">
              Action 2: Parameterized JDBC DELETE &mdash; Table: <span class="table-name-badge serif">${selectedTable}</span>
            </h4>
            <span class="badge badge-error">Referential Integrity Enforced</span>
          </div>
          <form id="form-delete">
            <div class="form-group" style="margin-bottom:16px;">
              <label class="form-label">Select Record to Delete:</label>
              <select id="delete-record-select" class="form-select" style="width:100%;"></select>
            </div>
            <div id="delete-preview-box" style="background:var(--color-white); border:1px solid var(--color-border); padding:16px; border-radius:var(--radius-sm); margin-bottom:18px; font-family:var(--font-mono); font-size:0.8125rem;">
              Select a record above to preview entity details.
            </div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-danger" id="submit-delete-btn">Confirm Parameterized DELETE</button>
            </div>
          </form>
        </div>

        <!-- PANEL 3: UPDATE FORM -->
        <div id="panel-update" class="mutation-form-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--color-gold);">
              Action 3: Parameterized JDBC UPDATE &mdash; Table: <span class="table-name-badge serif">${selectedTable}</span>
            </h4>
            <span class="badge badge-gold">PreparedStatement.executeUpdate()</span>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label class="form-label">Select Existing Record to Update:</label>
            <select id="update-record-select" class="form-select" style="width:100%;"></select>
          </div>
          <form id="form-update">
            <div id="update-fields-grid" class="form-grid"></div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="button" class="btn btn-outline cancel-panel-btn">Cancel</button>
              <button type="submit" class="btn btn-gold" id="submit-update-btn">Execute Parameterized UPDATE</button>
            </div>
          </form>
        </div>

        <!-- LIVE RECORD VIEWER -->
        <div style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; color:var(--color-midnight);">
              Live Table Inspector: <span class="table-name-badge">${selectedTable}</span>
              <span id="record-count-badge" class="badge badge-neutral" style="margin-left:8px;">0 rows</span>
            </h4>
            <button id="refresh-records-btn" class="btn btn-outline btn-sm">Refresh Table</button>
          </div>
          <div class="data-table-wrap">
            <table class="data-table" id="admin-data-table">
              <thead><tr id="table-head-row"><th>Loading schema...</th></tr></thead>
              <tbody id="table-body-rows"><tr><td>Loading records...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // UI Element References
  const tableSelect = section.querySelector('#admin-table-select');
  const btnInsert = section.querySelector('#btn-action-insert');
  const btnDelete = section.querySelector('#btn-action-delete');
  const btnUpdate = section.querySelector('#btn-action-update');
  const resultBanner = section.querySelector('#mutation-result-banner');

  const panelInsert = section.querySelector('#panel-insert');
  const panelDelete = section.querySelector('#panel-delete');
  const panelUpdate = section.querySelector('#panel-update');

  const formInsert = section.querySelector('#form-insert');
  const formDelete = section.querySelector('#form-delete');
  const formUpdate = section.querySelector('#form-update');

  const insertGrid = section.querySelector('#insert-fields-grid');
  const updateGrid = section.querySelector('#update-fields-grid');
  const deleteSelect = section.querySelector('#delete-record-select');
  const updateSelect = section.querySelector('#update-record-select');
  const deletePreview = section.querySelector('#delete-preview-box');

  const tableHead = section.querySelector('#table-head-row');
  const tableBody = section.querySelector('#table-body-rows');
  const countBadge = section.querySelector('#record-count-badge');
  const refreshBtn = section.querySelector('#refresh-records-btn');
  const apiKeyInput = section.querySelector('#admin-api-key-input');

  apiKeyInput.addEventListener('input', (e) => {
    adminApiKey = e.target.value.trim();
  });

  function hideAllPanels() {
    panelInsert.classList.remove('active');
    panelDelete.classList.remove('active');
    panelUpdate.classList.remove('active');
    currentAction = 'none';
  }

  section.querySelectorAll('.cancel-panel-btn').forEach(b => {
    b.addEventListener('click', hideAllPanels);
  });

  function showBanner(type, title, message, meta = '') {
    resultBanner.className = `mutation-result-banner ${type}`;
    resultBanner.style.display = 'block';
    resultBanner.innerHTML = `
      <div class="result-header">
        <span>${title}</span>
        <button style="background:none;border:none;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.style.display='none'">&times;</button>
      </div>
      <div>${message}</div>
      ${meta ? `<div class="result-meta">${meta}</div>` : ''}
    `;
  }

  // Load Table Metadata & Records
  async function loadTableData() {
    selectedTable = tableSelect.value;
    section.querySelectorAll('.table-name-badge').forEach(b => b.textContent = selectedTable);

    try {
      tableColumns = await api.getAdminColumns(selectedTable);
      tableRecords = await api.getAdminRecords(selectedTable, 50, 0);

      renderTableInspector();
      populateDeleteSelector();
      populateUpdateSelector();
    } catch (err) {
      showBanner('error', 'Metadata Load Failed', err.message);
    }
  }

  function renderTableInspector() {
    if (tableColumns.length === 0) {
      tableHead.innerHTML = '<th>No columns found</th>';
      tableBody.innerHTML = '<tr><td>Table empty or uninitialized</td></tr>';
      countBadge.textContent = '0 rows';
      return;
    }

    countBadge.textContent = `${tableRecords.length} row(s)`;

    // Render Table Header
    tableHead.innerHTML = tableColumns.map(col => `
      <th>
        ${col.name}
        <span style="font-size:0.65rem; color:var(--color-text-muted); font-weight:400; display:block;">${col.type}</span>
      </th>
    `).join('');

    // Render Table Body
    if (tableRecords.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${tableColumns.length}" style="text-align:center; padding:24px; color:var(--color-text-muted);">No records currently exist in '${selectedTable}'.</td></tr>`;
      return;
    }

    tableBody.innerHTML = tableRecords.map(row => `
      <tr>
        ${tableColumns.map(col => {
          const val = row[col.name];
          if (val === null || val === undefined) return '<td style="color:var(--color-text-muted);font-style:italic;">NULL</td>';
          return `<td>${escapeHtml(String(val))}</td>`;
        }).join('')}
      </tr>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ACTION 1: INSERT
  btnInsert.addEventListener('click', () => {
    hideAllPanels();
    currentAction = 'insert';
    panelInsert.classList.add('active');

    // Dynamically render schema inputs
    insertGrid.innerHTML = '';
    tableColumns.forEach(col => {
      // Primary keys with auto-increment: don't require user input
      if (col.isPk) {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
          <label class="form-label">${col.name} (Primary Key)</label>
          <input type="text" class="form-input" disabled value="Auto-Generated by Database" style="background:#F4F5F0; color:#8E9A94;" />
          <span class="form-help">Database sequence auto-assigns next serial identifier.</span>
        `;
        insertGrid.appendChild(div);
        return;
      }

      const div = document.createElement('div');
      div.className = 'form-group';
      const isNumber = col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('numeric') || col.type.toLowerCase().includes('decimal');
      const inputType = isNumber ? 'number' : 'text';
      const step = col.type.toLowerCase().includes('decimal') || col.type.toLowerCase().includes('numeric') ? '0.01' : '1';

      div.innerHTML = `
        <label class="form-label" for="insert-col-${col.name}">
          ${col.name} ${col.nullable ? '' : '<span style="color:var(--color-error)">*</span>'}
          <span style="font-size:0.7rem; font-weight:400; color:var(--color-text-muted);">(${col.type})</span>
        </label>
        <input type="${inputType}" id="insert-col-${col.name}" name="${col.name}" class="form-input" ${col.nullable ? '' : 'required'} ${isNumber ? `step="${step}"` : ''} placeholder="Enter ${col.name}" />
      `;
      insertGrid.appendChild(div);
    });

    panelInsert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  formInsert.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = section.querySelector('#submit-insert-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Executing Parameterized INSERT...';

    const payload = {};
    tableColumns.forEach(col => {
      if (col.isPk) return;
      const input = section.querySelector(`#insert-col-${col.name}`);
      if (input && input.value !== '') {
        const isNum = col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('numeric') || col.type.toLowerCase().includes('decimal');
        payload[col.name] = isNum ? (input.value.includes('.') ? parseFloat(input.value) : parseInt(input.value, 10)) : input.value;
      }
    });

    try {
      const resp = await api.adminInsert(selectedTable, payload, adminApiKey);
      showBanner(
        'success',
        'Action 1 (INSERT) Executed Successfully via JDBC',
        resp.message,
        `<span>Target Table: <strong>${selectedTable}</strong></span> · <span>Generated ID: <strong>${resp.id}</strong></span> · <span>Affected: <strong>${resp.affectedRows} row</strong></span> · <span>Time: <strong>${resp.executionTimeMs} ms</strong></span>`
      );
      hideAllPanels();
      await loadTableData();
    } catch (err) {
      showBanner('error', 'JDBC INSERT Failed', err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Execute Parameterized INSERT';
    }
  });

  // ACTION 2: DELETE
  function populateDeleteSelector() {
    deleteSelect.innerHTML = '';
    if (tableRecords.length === 0) {
      deleteSelect.innerHTML = '<option value="">No records available</option>';
      deletePreview.innerHTML = 'Table currently contains zero records.';
      return;
    }

    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    tableRecords.forEach((rec, idx) => {
      const opt = document.createElement('option');
      opt.value = rec[pkCol];
      const summaryText = rec.name || rec.store_name || rec.email || rec.first_name || `Record #${rec[pkCol]}`;
      opt.textContent = `[${pkCol}=${rec[pkCol]}] ${summaryText}`;
      deleteSelect.appendChild(opt);
    });

    updateDeletePreview();
  }

  function updateDeletePreview() {
    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    const id = deleteSelect.value;
    const found = tableRecords.find(r => String(r[pkCol]) === String(id));
    if (found) {
      deletePreview.innerHTML = `<strong>Selected Record for Parameterized Deletion:</strong><br/><pre style="margin-top:6px; overflow-x:auto;">${escapeHtml(JSON.stringify(found, null, 2))}</pre>`;
    } else {
      deletePreview.textContent = 'Select a record to preview.';
    }
  }

  deleteSelect.addEventListener('change', updateDeletePreview);

  btnDelete.addEventListener('click', () => {
    hideAllPanels();
    currentAction = 'delete';
    panelDelete.classList.add('active');
    populateDeleteSelector();
    panelDelete.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  formDelete.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    const id = deleteSelect.value;
    if (!id) {
      alert("Please select a record to delete.");
      return;
    }

    const confirmed = confirm(`[Confirmation Required]\nAre you sure you want to execute a parameterized DELETE on table '${selectedTable}' for ${pkCol} = ${id}?`);
    if (!confirmed) return;

    const submitBtn = section.querySelector('#submit-delete-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Executing Parameterized DELETE...';

    try {
      const resp = await api.adminDelete(selectedTable, id, adminApiKey);
      showBanner(
        'success',
        'Action 2 (DELETE) Executed Successfully via JDBC',
        resp.message,
        `<span>Target Table: <strong>${selectedTable}</strong></span> · <span>Deleted Key: <strong>${id}</strong></span> · <span>Affected: <strong>${resp.affectedRows} row</strong></span> · <span>Time: <strong>${resp.executionTimeMs} ms</strong></span>`
      );
      hideAllPanels();
      await loadTableData();
    } catch (err) {
      showBanner('error', 'JDBC DELETE Rejected (Constraint Guard)', err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Parameterized DELETE';
    }
  });

  // ACTION 3: UPDATE
  function populateUpdateSelector() {
    updateSelect.innerHTML = '';
    if (tableRecords.length === 0) {
      updateSelect.innerHTML = '<option value="">No records available</option>';
      updateGrid.innerHTML = '';
      return;
    }

    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    tableRecords.forEach(rec => {
      const opt = document.createElement('option');
      opt.value = rec[pkCol];
      const summaryText = rec.name || rec.store_name || rec.email || rec.first_name || `Record #${rec[pkCol]}`;
      opt.textContent = `[${pkCol}=${rec[pkCol]}] ${summaryText}`;
      updateSelect.appendChild(opt);
    });

    renderUpdateFields();
  }

  function renderUpdateFields() {
    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    const id = updateSelect.value;
    const currentRecord = tableRecords.find(r => String(r[pkCol]) === String(id));

    updateGrid.innerHTML = '';
    if (!currentRecord) return;

    tableColumns.forEach(col => {
      if (col.isPk) {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
          <label class="form-label">${col.name} (Primary Key &mdash; Read Only)</label>
          <input type="text" class="form-input" disabled value="${currentRecord[col.name]}" style="background:#F4F5F0; color:#8E9A94;" />
        `;
        updateGrid.appendChild(div);
        return;
      }

      const div = document.createElement('div');
      div.className = 'form-group';
      const isNumber = col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('numeric') || col.type.toLowerCase().includes('decimal');
      const inputType = isNumber ? 'number' : 'text';
      const step = col.type.toLowerCase().includes('decimal') || col.type.toLowerCase().includes('numeric') ? '0.01' : '1';
      const val = currentRecord[col.name] !== null && currentRecord[col.name] !== undefined ? currentRecord[col.name] : '';

      div.innerHTML = `
        <label class="form-label" for="update-col-${col.name}">
          ${col.name}
          <span style="font-size:0.7rem; font-weight:400; color:var(--color-text-muted);">(${col.type})</span>
        </label>
        <input type="${inputType}" id="update-col-${col.name}" name="${col.name}" class="form-input" value="${escapeHtml(String(val))}" ${isNumber ? `step="${step}"` : ''} />
      `;
      updateGrid.appendChild(div);
    });
  }

  updateSelect.addEventListener('change', renderUpdateFields);

  btnUpdate.addEventListener('click', () => {
    hideAllPanels();
    currentAction = 'update';
    panelUpdate.classList.add('active');
    populateUpdateSelector();
    panelUpdate.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  formUpdate.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pkCol = tableColumns.find(c => c.isPk)?.name || 'id';
    const id = updateSelect.value;
    if (!id) {
      alert("Please select a record to update.");
      return;
    }

    const submitBtn = section.querySelector('#submit-update-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Executing Parameterized UPDATE...';

    const payload = {};
    tableColumns.forEach(col => {
      if (col.isPk) return;
      const input = section.querySelector(`#update-col-${col.name}`);
      if (input) {
        const isNum = col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('numeric') || col.type.toLowerCase().includes('decimal');
        payload[col.name] = isNum ? (input.value.includes('.') ? parseFloat(input.value) : parseInt(input.value, 10)) : input.value;
      }
    });

    try {
      const resp = await api.adminUpdate(selectedTable, id, payload, adminApiKey);
      showBanner(
        'success',
        'Action 3 (UPDATE) Executed Successfully via JDBC',
        resp.message,
        `<span>Target Table: <strong>${selectedTable}</strong></span> · <span>Updated Key: <strong>${id}</strong></span> · <span>Affected: <strong>${resp.affectedRows} row</strong></span> · <span>Time: <strong>${resp.executionTimeMs} ms</strong></span>`
      );
      hideAllPanels();
      await loadTableData();
    } catch (err) {
      showBanner('error', 'JDBC UPDATE Failed', err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Execute Parameterized UPDATE';
    }
  });

  tableSelect.addEventListener('change', () => {
    hideAllPanels();
    loadTableData();
  });

  refreshBtn.addEventListener('click', loadTableData);

  // Initial load
  loadTableData();

  return section;
}
