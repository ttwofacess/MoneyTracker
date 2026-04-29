import { getState } from './state.js';

export function getMonthMovements(year, month, selectedBankId) {
  const state = getState();
  const pad = n => String(n).padStart(2, '0');
  const prefix = `${year}-${pad(month + 1)}`;
  let mvs = state.movements.filter(m => m.date && m.date.startsWith(prefix));
  if (selectedBankId !== 'all') {
    mvs = mvs.filter(m => m.bankId === selectedBankId);
  }
  return mvs.sort((a, b) => a.date.localeCompare(b.date));
}

export function calcTotals(mvs) {
  return mvs.reduce((acc, m) => {
    acc.ownIn += parseFloat(m.ownIn) || 0;
    acc.ownOut += parseFloat(m.ownOut) || 0;
    acc['in'] += parseFloat(m['in']) || 0;
    acc.out += parseFloat(m.out) || 0;
    return acc;
  }, { ownIn: 0, ownOut: 0, in: 0, out: 0 });
}
