/**
 * OMNI ATELIER — ACADEMIC DATABASE SUITE CONTAINER
 * Orchestrates Professor DB Manager (Actions 1, 2, 3), Advanced Relational Demonstrations,
 * and SQL Query Console in a unified, executive tabbed control panel.
 */

import { createProfessorDbManager } from './ProfessorDbManager.js';
import { createAdvancedDbDemo } from './AdvancedDbDemo.js';
import { createSqlSandbox } from './SqlSandbox.js';

export function createAcademicSections() {
  const section = document.createElement('section');
  section.className = 'academic-suite-section';
  section.id = 'academic-suite';

  section.innerHTML = `
    <div class="container">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin-bottom:28px;">
        <div>
          <p class="section-eyebrow">03 / DBMS Academic Demonstration Suite</p>
          <h2 class="section-headline">Distributed Relational Architecture &amp; Direct JDBC</h2>
          <p class="section-subheadline">
            Curated evaluation panel for Course Faculty (Dr. Sobitha Ahila). Direct Java JDBC CRUD, 5-table relational joins, explicit ACID transaction rollback proofs, and interactive SQL execution.
          </p>
        </div>
        <div style="display:flex; gap:8px;">
          <span class="badge badge-emerald">Course: DBMS DA3</span>
          <span class="badge badge-gold">Branch: Harsh2</span>
        </div>
      </div>

      <!-- Executive Tabbed Navigation -->
      <div class="academic-nav-tabs" role="tablist">
        <button class="academic-tab-btn active" data-tab="tab-professor" role="tab" aria-selected="true">
          <span>🎓</span>
          <span>Professor Database Manager (Actions 1, 2, 3)</span>
        </button>
        <button class="academic-tab-btn" data-tab="tab-advanced" role="tab" aria-selected="false">
          <span>🔬</span>
          <span>Advanced Relational Demonstrations &amp; ACID Proof</span>
        </button>
        <button class="academic-tab-btn" data-tab="tab-sandbox" role="tab" aria-selected="false">
          <span>💻</span>
          <span>Interactive SQL Query Console</span>
        </button>
      </div>

      <!-- Tab Content Panels -->
      <div class="academic-tab-panel active" id="tab-professor" role="tabpanel">
        <!-- Render ProfessorDbManager -->
      </div>

      <div class="academic-tab-panel" id="tab-advanced" role="tabpanel">
        <!-- Render AdvancedDbDemo -->
      </div>

      <div class="academic-tab-panel" id="tab-sandbox" role="tabpanel">
        <!-- Render SqlSandbox -->
      </div>
    </div>
  `;

  // Instantiate subcomponents
  const profManager = createProfessorDbManager();
  const advDemo = createAdvancedDbDemo();
  const sqlConsole = createSqlSandbox();

  section.querySelector('#tab-professor').appendChild(profManager);
  section.querySelector('#tab-advanced').appendChild(advDemo);
  section.querySelector('#tab-sandbox').appendChild(sqlConsole);

  // Tab switching logic
  const tabBtns = section.querySelectorAll('.academic-tab-btn');
  const tabPanels = section.querySelectorAll('.academic-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = section.querySelector(`#${targetId}`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  return {
    element: section,
    switchTab(tabName) {
      const btn = section.querySelector(`.academic-tab-btn[data-tab="tab-${tabName}"]`);
      if (btn) btn.click();
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
}
