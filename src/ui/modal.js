import { getState, save } from '../state.js';
import { uid } from '../utils.js';

let editingId = null;

export function openModal(currentYear, currentMonth, selectedBankId) {
  editingId = null;
  document.getElementById('modal-title').textContent = 'Agregar movimiento';
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('f-date').value = `${currentYear}-${pad(currentMonth + 1)}-${pad(new Date().getDate())}`;
  document.getElementById('f-own-in').value = '';
  document.getElementById('f-own-out').value = '';
  document.getElementById('f-in').value = '';
  document.getElementById('f-out').value = '';
  document.getElementById('f-desc').value = '';
  populateBankSelect(selectedBankId !== 'all' ? selectedBankId : getState().banks[0]?.id);
  document.getElementById('modal').classList.add('open');
}

export function openEdit(id) {
  const state = getState();
  const m = state.movements.find(x => x.id === id);
  if (!m) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar movimiento';
  document.getElementById('f-date').value = m.date;
  document.getElementById('f-own-in').value = m.ownIn || '';
  document.getElementById('f-own-out').value = m.ownOut || '';
  document.getElementById('f-in').value = m['in'] || '';
  document.getElementById('f-out').value = m.out || '';
  document.getElementById('f-desc').value = m.desc || '';
  populateBankSelect(m.bankId);
  document.getElementById('modal').classList.add('open');
}

export function populateBankSelect(selectedId) {
  const state = getState();
  const sel = document.getElementById('f-bank');
  sel.innerHTML = state.banks.map(b =>
    `<option value="${b.id}" ${b.id === selectedId ? 'selected' : ''}>${b.name}</option>`
  ).join('');
}

export function closeModal() {
  document.getElementById('modal').classList.remove('open');
  editingId = null;
}

export function saveMovement(onSaved) {
  const state = getState();
  const date = document.getElementById('f-date').value;
  if (!date) { alert('La fecha es obligatoria.'); return; }
  const bankId = parseInt(document.getElementById('f-bank').value);
  const ownIn = parseFloat(document.getElementById('f-own-in').value) || 0;
  const ownOut = parseFloat(document.getElementById('f-own-out').value) || 0;
  const inp = parseFloat(document.getElementById('f-in').value) || 0;
  const out = parseFloat(document.getElementById('f-out').value) || 0;
  const desc = document.getElementById('f-desc').value.trim();

  if (editingId) {
    const m = state.movements.find(x => x.id === editingId);
    if (m) { Object.assign(m, { bankId, date, ownIn, ownOut, in: inp, out, desc }); }
  } else {
    state.movements.push({ id: uid(), bankId, date, ownIn, ownOut, in: inp, out, desc });
  }
  save();
  closeModal();
  onSaved(date);
}

export function deleteMovement(id, onDeleted) {
  if (!confirm('¿Eliminar este movimiento?')) return;
  const state = getState();
  state.movements = state.movements.filter(m => m.id !== id);
  save();
  onDeleted();
}
