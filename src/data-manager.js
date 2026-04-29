import { getState, setState, defaultState } from './state.js';

export function exportData() {
  const state = getState();
  const dataStr = JSON.stringify(state, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `money-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function triggerImport() {
  document.getElementById('import-input').click();
}

export function importData(event, onImported) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedState = JSON.parse(e.target.result);

      // Basic validation
      if (!importedState.banks || !importedState.movements) {
        throw new Error('El archivo no tiene el formato correcto.');
      }

      if (confirm('¿Estás seguro de que quieres importar estos datos? Esto reemplazará los datos actuales.')) {
        setState(importedState);
        onImported();
        alert('Datos importados correctamente.');
      }
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
    // Reset input so the same file can be selected again
    event.target.value = '';
  };
  reader.readAsText(file);
}

export function clearAll(onCleared) {
  if (!confirm('⚠️ Esto borrará TODOS los datos guardados. ¿Estás seguro?')) return;
  setState(defaultState());
  onCleared();
}
