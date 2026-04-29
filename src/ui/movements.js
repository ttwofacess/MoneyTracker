import { getState, bankName } from '../state.js';
import { bankColor, fmt } from '../utils.js';
import { getMonthMovements, calcTotals } from '../logic.js';
import { MONTHS } from '../constants.js';

export function renderBankTabs(selectedBankId, onSelectBank) {
  const state = getState();
  const cont = document.getElementById('bank-tabs');
  let html = `<button class="all-tab ${selectedBankId === 'all' ? 'active' : ''}" data-id="all">Todos</button>`;
  state.banks.forEach(b => {
    const col = bankColor(b.id);
    html += `<button class="bank-tab ${selectedBankId === b.id ? 'active' : ''}" data-id="${b.id}" style="${selectedBankId === b.id ? `color:${col};border-color:${col};background:${col}18` : ''}">`
      + `<span class="dot" style="background:${col}"></span>${b.name}</button>`;
  });
  cont.innerHTML = html;

  cont.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => onSelectBank(btn.dataset.id);
  });
}

export function renderSummary(currentYear, currentMonth, selectedBankId) {
  const mvs = getMonthMovements(currentYear, currentMonth, selectedBankId);
  const t = calcTotals(mvs);
  const net = (t.ownIn + t['in']) - (t.ownOut + t.out);
  const cont = document.getElementById('summary-cards');
  cont.innerHTML = `
    <div class="card"><div class="card-label">Own In</div><div class="card-value own-in">${fmt(t.ownIn)}</div></div>
    <div class="card"><div class="card-label">Own Out</div><div class="card-value own-out">${fmt(t.ownOut)}</div></div>
    <div class="card"><div class="card-label">Ingresos externos</div><div class="card-value in">${fmt(t['in'])}</div></div>
    <div class="card"><div class="card-label">Egresos externos</div><div class="card-value out">${fmt(t.out)}</div></div>
    <div class="card"><div class="card-label">Neto del mes</div><div class="card-value net ${net >= 0 ? 'pos' : 'neg'}">${fmt(net)}</div></div>
    <div class="card"><div class="card-label">Movimientos</div><div class="card-value" style="color:var(--muted2)">${mvs.length}</div></div>
  `;
  const bname = selectedBankId === 'all' ? 'Todos los bancos' : bankName(selectedBankId);
  document.getElementById('table-title').textContent = `${bname} — ${MONTHS[currentMonth]} ${currentYear}`;
}

export function renderTable(currentYear, currentMonth, selectedBankId, onEdit, onDelete) {
  const mvs = getMonthMovements(currentYear, currentMonth, selectedBankId);
  const t = calcTotals(mvs);
  const cont = document.getElementById('table-container');
  if (mvs.length === 0) {
    cont.innerHTML = `<div class="empty"><div class="empty-icon">📋</div><p>No hay movimientos este mes.<br>Hacé clic en "+ Agregar" para cargar uno.</p></div>`;
    return;
  }
  const showBankCol = selectedBankId === 'all';
  cont.innerHTML = `<table>
    <thead><tr>
      <th>Fecha</th>
      ${showBankCol ? '<th>Banco</th>' : ''}
      <th>Own In</th><th>Own Out</th><th>In</th><th>Out</th>
      <th>Descripción</th><th></th>
    </tr></thead>
    <tbody>
      ${mvs.map(m => `<tr>
        <td class="date-cell">${m.date}</td>
        ${showBankCol ? `<td class="bank-cell"><span style="color:${bankColor(m.bankId)}">${bankName(m.bankId)}</span></td>` : ''}
        <td class="own-in-cell">${fmt(m.ownIn)}</td>
        <td class="own-out-cell">${fmt(m.ownOut)}</td>
        <td class="in-cell">${fmt(m['in'])}</td>
        <td class="out-cell">${fmt(m.out)}</td>
        <td style="color:var(--muted2);max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.desc || ''}</td>
        <td><div class="actions">
          <button class="icon-btn edit-btn" data-id="${m.id}">✎</button>
          <button class="icon-btn del del-btn" data-id="${m.id}">✕</button>
        </div></td>
      </tr>`).join('')}
    </tbody>
    <tfoot><tr>
      <td class="lbl" ${showBankCol ? 'colspan="2"' : ''}>Totales</td>
      <td class="own-in-cell">${fmt(t.ownIn)}</td>
      <td class="own-out-cell">${fmt(t.ownOut)}</td>
      <td class="in-cell">${fmt(t['in'])}</td>
      <td class="out-cell">${fmt(t.out)}</td>
      <td colspan="2"></td>
    </tr></tfoot>
  </table>`;

  cont.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => onEdit(btn.dataset.id);
  });
  cont.querySelectorAll('.del-btn').forEach(btn => {
    btn.onclick = () => onDelete(btn.dataset.id);
  });
}
