import { getState, save } from '../state.js';
import { bankColor } from '../utils.js';
import { MONTHS } from '../constants.js';

export function renderSettings(currentYear, currentMonth, onUpdate) {
  const state = getState();
  const cont = document.getElementById('banks-grid');
  const pad = n => String(n).padStart(2, '0');
  const monthKey = `${currentYear}-${pad(currentMonth + 1)}`;

  cont.innerHTML = state.banks.map(b => {
    const mData = (b.monthlyData && b.monthlyData[monthKey]) || { saldoInicial: 0, fci: 0 };
    return `
      <div class="bank-setting">
        <div class="bank-setting-header">
          <span class="bank-num">Banco ${b.id}</span>
          <div class="bank-color-dot" style="background:${bankColor(b.id)}"></div>
        </div>
        <input type="text" class="bank-name-input" data-id="${b.id}" value="${b.name}" placeholder="Nombre del banco"
          style="font-weight:600">
        <div class="saldo-row">
          <div class="form-group">
            <label>Saldo Inicial (${MONTHS[currentMonth]})</label>
            <input type="number" class="bank-field-input" data-id="${b.id}" data-field="saldoInicial" value="${mData.saldoInicial || 0}" placeholder="0" step="0.01">
          </div>
          <div class="form-group">
            <label>FCI (${MONTHS[currentMonth]})</label>
            <input type="number" class="bank-field-input" data-id="${b.id}" data-field="fci" value="${mData.fci || 0}" placeholder="0" step="0.01">
          </div>
        </div>
      </div>
    `;
  }).join('');

  cont.querySelectorAll('.bank-name-input').forEach(input => {
    input.onchange = () => {
      updateBankName(parseInt(input.dataset.id), input.value);
      onUpdate();
    };
  });

  cont.querySelectorAll('.bank-field-input').forEach(input => {
    input.onchange = () => {
      updateBankField(parseInt(input.dataset.id), input.dataset.field, input.value, currentYear, currentMonth);
      onUpdate();
    };
  });
}

function updateBankName(id, val) {
  const state = getState();
  const b = state.banks.find(b => b.id === id);
  if (b) { 
    b.name = val.trim() || `Banco ${id}`; 
    save(); 
  }
}

function updateBankField(id, field, val, currentYear, currentMonth) {
  const state = getState();
  const b = state.banks.find(b => b.id === id);
  if (b) {
    if (!b.monthlyData) b.monthlyData = {};
    const pad = n => String(n).padStart(2, '0');
    const monthKey = `${currentYear}-${pad(currentMonth + 1)}`;
    if (!b.monthlyData[monthKey]) b.monthlyData[monthKey] = { saldoInicial: 0, fci: 0 };
    b.monthlyData[monthKey][field] = parseFloat(val) || 0;
    save();
  }
}
