import { 
  getNavigationState, 
  showView, 
  changeMonth, 
  updateMonthLabels, 
  setSelectedBankId, 
  setDateFromValue 
} from './src/navigation.js';

import { 
  renderBankTabs, 
  renderSummary, 
  renderTable 
} from './src/ui/movements.js';

import { renderCharts } from './src/ui/charts.js';
import { renderSettings } from './src/ui/settings.js';

import { 
  openModal, 
  openEdit, 
  closeModal, 
  saveMovement, 
  deleteMovement 
} from './src/ui/modal.js';

import { 
  exportData, 
  triggerImport, 
  importData, 
  clearAll 
} from './src/data-manager.js';

// ═══════════════════════════════════════════════════════
//  CORE RENDERER
// ═══════════════════════════════════════════════════════
function render() {
  const { currentView, currentYear, currentMonth, selectedBankId } = getNavigationState();

  updateMonthLabels();

  if (currentView === 'movements') {
    renderBankTabs(selectedBankId, (id) => {
      setSelectedBankId(id);
      render();
    });
    renderSummary(currentYear, currentMonth, selectedBankId);
    renderTable(
      currentYear, 
      currentMonth, 
      selectedBankId, 
      openEdit, 
      (id) => deleteMovement(id, render)
    );
  } else if (currentView === 'charts') {
    renderCharts(currentYear, currentMonth);
  } else if (currentView === 'settings') {
    renderSettings(currentYear, currentMonth, render);
  }
}

// ═══════════════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════════════

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showView(btn.dataset.view, render);
  });
});

const monthButtons = [
  { id: 'prev-month', delta: -1 },
  { id: 'next-month', delta: 1 },
  { id: 'prev-month-chart', delta: -1 },
  { id: 'next-month-chart', delta: 1 },
  { id: 'prev-month-settings', delta: -1 },
  { id: 'next-month-settings', delta: 1 }
];

monthButtons.forEach(btn => {
  const el = document.getElementById(btn.id);
  if (el) {
    el.addEventListener('click', () => changeMonth(btn.delta, render));
  }
});

// Modal Actions
document.getElementById('add-movement-btn').addEventListener('click', () => {
  const { currentYear, currentMonth, selectedBankId } = getNavigationState();
  openModal(currentYear, currentMonth, selectedBankId);
});

document.getElementById('close-modal-btn').addEventListener('click', closeModal);

document.getElementById('save-movement-btn').addEventListener('click', () => {
  saveMovement((dateStr) => {
    setDateFromValue(dateStr);
    render();
  });
});

// Overlay click to close modal
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

// Data Management
document.getElementById('export-btn').addEventListener('click', exportData);
document.getElementById('trigger-import-btn').addEventListener('click', triggerImport);
document.getElementById('import-input').addEventListener('change', (e) => importData(e, render));
document.getElementById('clear-all-btn').addEventListener('click', () => clearAll(render));

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
render();
