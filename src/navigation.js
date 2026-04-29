import { MONTHS } from './constants.js';

let currentView = 'movements';
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-based
let selectedBankId = 'all';

export function getNavigationState() {
  return { currentView, currentYear, currentMonth, selectedBankId };
}

export function setView(v) {
  currentView = v;
}

export function setSelectedBankId(id) {
  selectedBankId = id === 'all' ? 'all' : parseInt(id);
}

export function changeMonth(delta, renderCallback) {
  currentMonth += delta;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCallback();
}

export function updateMonthLabels() {
  const html = `<span>${MONTHS[currentMonth]}</span>`;
  const el1 = document.getElementById('month-label');
  const el2 = document.getElementById('month-label-chart');
  const el3 = document.getElementById('month-label-settings');
  const yr = document.getElementById('year-label');
  if (el1) el1.innerHTML = html;
  if (el2) el2.innerHTML = html;
  if (el3) el3.innerHTML = html;
  if (yr) yr.textContent = currentYear;
}

export function showView(v, renderCallback) {
  currentView = v;
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`view-${v}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(el => {
    if (el.textContent.toLowerCase().includes(v === 'movements' ? 'movim' : v === 'charts' ? 'gráf' : 'config'))
      el.classList.add('active');
  });
  renderCallback();
}

export function setDateFromValue(dateStr) {
  const parts = dateStr.split('-');
  currentYear = parseInt(parts[0]);
  currentMonth = parseInt(parts[1]) - 1;
}
