import { getState } from '../state.js';
import { calcTotals } from '../logic.js';
import { MONTHS } from '../constants.js';

let chartInstances = {};

export function renderCharts(currentYear, currentMonth) {
  const state = getState();
  const cont = document.getElementById('charts-container');
  // Destroy old instances
  Object.values(chartInstances).forEach(c => c.destroy());
  chartInstances = {};

  cont.innerHTML = `
    <div class="chart-card"><div class="chart-card-title">Totales por banco — ${MONTHS[currentMonth]}</div><canvas id="ch-banks"></canvas></div>
    <div class="chart-card"><div class="chart-card-title">Evolución mensual — año ${currentYear}</div><canvas id="ch-year"></canvas></div>
    <div class="chart-card"><div class="chart-card-title">Own In vs Own Out por banco</div><canvas id="ch-own"></canvas></div>
    <div class="chart-card"><div class="chart-card-title">In vs Out por banco</div><canvas id="ch-inout"></canvas></div>
  `;

  Chart.defaults.color = '#5a6070';
  Chart.defaults.borderColor = '#242830';

  // Chart 1: totals per bank this month
  const pad = n => String(n).padStart(2, '0');
  const prefix = `${currentYear}-${pad(currentMonth + 1)}`;
  const bankLabels = state.banks.map(b => b.name);
  const bankTotIn = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    const t = calcTotals(mvs);
    return t.ownIn + t['in'];
  });
  const bankTotOut = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    const t = calcTotals(mvs);
    return t.ownOut + t.out;
  });

  chartInstances['banks'] = new Chart(document.getElementById('ch-banks'), {
    type: 'bar',
    data: {
      labels: bankLabels,
      datasets: [
        { label: 'Total In', data: bankTotIn, backgroundColor: 'rgba(0,212,170,.7)', borderRadius: 5 },
        { label: 'Total Out', data: bankTotOut, backgroundColor: 'rgba(255,77,106,.7)', borderRadius: 5 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8892a4', boxRadius: 3 } } },
      scales: {
        x: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070' } },
        y: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070', callback: v => '$' + v.toLocaleString('es-AR') } }
      }
    }
  });

  // Chart 2: monthly evolution this year
  const monthlyNet = MONTHS.map((_, mi) => {
    const mpx = `${currentYear}-${pad(mi + 1)}`;
    const mvs = state.movements.filter(m => m.date && m.date.startsWith(mpx));
    const t = calcTotals(mvs);
    return (t.ownIn + t['in']) - (t.ownOut + t.out);
  });
  chartInstances['year'] = new Chart(document.getElementById('ch-year'), {
    type: 'line',
    data: {
      labels: MONTHS.map(m => m.slice(0, 3)),
      datasets: [{
        label: 'Neto', data: monthlyNet,
        borderColor: '#0095ff', backgroundColor: 'rgba(0,149,255,.1)',
        tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: '#0095ff'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070' } },
        y: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070', callback: v => '$' + v.toLocaleString('es-AR') } }
      }
    }
  });

  // Chart 3: Own In vs Own Out
  const ownInData = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    return calcTotals(mvs).ownIn;
  });
  const ownOutData = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    return calcTotals(mvs).ownOut;
  });
  chartInstances['own'] = new Chart(document.getElementById('ch-own'), {
    type: 'bar',
    data: {
      labels: bankLabels,
      datasets: [
        { label: 'Own In', data: ownInData, backgroundColor: 'rgba(0,149,255,.7)', borderRadius: 5 },
        { label: 'Own Out', data: ownOutData, backgroundColor: 'rgba(245,166,35,.7)', borderRadius: 5 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8892a4', boxRadius: 3 } } },
      scales: {
        x: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070' } },
        y: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070', callback: v => '$' + v.toLocaleString('es-AR') } }
      }
    }
  });

  // Chart 4: In vs Out
  const extInData = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    return calcTotals(mvs)['in'];
  });
  const extOutData = state.banks.map(b => {
    const mvs = state.movements.filter(m => m.bankId === b.id && m.date && m.date.startsWith(prefix));
    return calcTotals(mvs).out;
  });
  chartInstances['inout'] = new Chart(document.getElementById('ch-inout'), {
    type: 'bar',
    data: {
      labels: bankLabels,
      datasets: [
        { label: 'In externo', data: extInData, backgroundColor: 'rgba(0,212,170,.7)', borderRadius: 5 },
        { label: 'Out externo', data: extOutData, backgroundColor: 'rgba(255,77,106,.7)', borderRadius: 5 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#8892a4', boxRadius: 3 } } },
      scales: {
        x: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070' } },
        y: { grid: { color: '#1a1f28' }, ticks: { color: '#5a6070', callback: v => '$' + v.toLocaleString('es-AR') } }
      }
    }
  });
}
