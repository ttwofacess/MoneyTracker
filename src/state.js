import { STORAGE_KEY } from './constants.js';

export function defaultState() {
  return {
    banks: [
      { id: 1, name: 'Banco 1', saldoInicial: 0, fci: 0 },
      { id: 2, name: 'Banco 2', saldoInicial: 0, fci: 0 },
      { id: 3, name: 'Banco 3', saldoInicial: 0, fci: 0 },
      { id: 4, name: 'Banco 4', saldoInicial: 0, fci: 0 },
      { id: 5, name: 'Banco 5', saldoInicial: 0, fci: 0 },
      { id: 6, name: 'Banco 6', saldoInicial: 0, fci: 0 },
    ],
    movements: [] // { id, bankId, date(YYYY-MM-DD), ownIn, ownOut, in, out, desc }
  };
}

let state = load();

export function getState() {
  return state;
}

export function setState(newState) {
  state = newState;
  save();
}

export function load() {
  try { 
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState(); 
  } catch { 
    return defaultState(); 
  }
}

export function save() { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
}

export function bankName(id) { 
  return state.banks.find(b => b.id === id)?.name || `Banco ${id}`; 
}
