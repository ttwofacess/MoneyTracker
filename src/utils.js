import { BANK_COLORS } from './constants.js';

export function fmt(n) {
  if (!n && n !== 0) return '—';
  const v = parseFloat(n);
  if (v === 0) return '—';
  return '$' + v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function bankColor(id) { 
  return BANK_COLORS[(id - 1) % BANK_COLORS.length]; 
}

export function uid() { 
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); 
}
