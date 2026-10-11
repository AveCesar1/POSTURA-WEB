/* =========================================================
   POSTURA — Lógica de la aplicación
   ========================================================= */

/* ---------------------------------------------------------
   1. DATOS MOCK
   --------------------------------------------------------- */
const DATA = {
  user: { name: 'Carlos' },

  kpis: [
    { icon: '⏱️', label: 'TIEMPO SENTADO', value: '42 min' },
    { icon: '🔄', label: 'VARIABILIDAD',   value: 'Moderada' },
    { icon: '⚖️', label: 'DISTRIBUCIÓN',    value: 'Equilibrada' },
    { icon: '🪑', label: 'CONTACTO LUMBAR', value: 'Adecuado' }
  ],

  /* Matriz de presión — sesión actual
     Backrest: 6 cols x 5 rows — Seat: 7 cols x 4 rows
     Valores entre 0 y 1 */
  pressure: {
    backrest: [
      [0.10, 0.20, 0.30, 0.30, 0.20, 0.10],
      [0.25, 0.45, 0.55, 0.55, 0.45, 0.25],
      [0.30, 0.50, 0.60, 0.60, 0.50, 0.30],
      [0.35, 0.55, 0.65, 0.65, 0.55, 0.35],
      [0.30, 0.50, 0.60, 0.60, 0.50, 0.30]
    ],
    seat: [
      [0.20, 0.35, 0.50, 0.55, 0.50, 0.35, 0.20],
      [0.40, 0.55, 0.70, 0.75, 0.70, 0.55, 0.40],
      [0.45, 0.60, 0.75, 0.80, 0.75, 0.60, 0.45],
      [0.30, 0.45, 0.55, 0.60, 0.55, 0.45, 0.30]
    ]
  },

  /* Segunda matriz (Mi postura) — ligeramente más cargada a la derecha
     para ilustrar una sesión "actual" con matices */
  pressureSecondary: {
    backrest: [
      [0.15, 0.25, 0.35, 0.40, 0.30, 0.20],
      [0.30, 0.45, 0.55, 0.60, 0.50, 0.35],
      [0.35, 0.50, 0.60, 0.65, 0.55, 0.40],
      [0.40, 0.55, 0.65, 0.70, 0.60, 0.45],
      [0.35, 0.50, 0.60, 0.65, 0.55, 0.40]
    ],
    seat: [
      [0.25, 0.40, 0.50, 0.55, 0.60, 0.45, 0.30],
      [0.40, 0.55, 0.65, 0.70, 0.75, 0.60, 0.45],
      [0.45, 0.60, 0.70, 0.75, 0.80, 0.65, 0.50],
      [0.30, 0.45, 0.55, 0.60, 0.65, 0.50, 0.35]
    ]
  },

  /* Pilares — Mi postura */
  pillars: [
    {
      id: 'presion',
      icon: '▦',
      title: 'PRESIÓN',
      accent: 'var(--navy)',
      accentBg: 'rgba(30,58,95,0.10)',
      rows: [
        { label: 'Distribución de carga',          value: 'Equilibrada',            status: 'ok' },
        { label: 'Simetría izquierda/derecha',     value: 'Ligeramente derecha',    status: 'warn' },
        { label: 'Centro de presión',              value: 'Centrado',               status: 'ok' },
        { label: 'Contacto lumbar',                value: 'Adecuado',               status: 'ok' },
        { label: 'Contacto dorsal',                value: 'Presente',               status: 'ok' }
      ]
    },
    {
      id: 'movimiento',
      icon: '⇄',
      title: 'MOVIMIENTO',
      accent: 'var(--teal)',
      accentBg: 'rgba(43,179,163,0.12)',
      rows: [
        { label: 'Cambios de posición',            value: 'Frecuentes',             status: 'ok' },
        { label: 'Frecuencia de reajustes',        value: 'Moderada',               status: 'ok' },
        { label: 'Desplazamientos',                value: 'Ocasionales',            status: 'warn' },
        { label: 'Variabilidad postural',          value: 'Moderada',               status: 'ok' }
      ]
    },
    {
      id: 'tiempo',
      icon: '⏱',
      title: 'TIEMPO',
      accent: 'var(--purple)',
      accentBg: 'rgba(139,127,209,0.14)',
      rows: [
        { label: 'Tiempo total sentado',           value: '3 h 12 min',             status: 'info' },
        { label: 'Tiempo continuo',                value: '42 min',                 status: 'warn' },
        { label: 'Duración de posiciones',         value: 'Estable',                status: 'ok' },
        { label: 'Frecuencia de pausas',           value: 'Adecuada',               status: 'ok' }
      ]
    }
  ],

  /* Evolución — series por rango */
  evolution: {
    hoy: {
      caption: 'Hoy',
      labels: ['8h','10h','12h','14h','16h','18h','20h','22h'],
      values: [45, 52, 48, 60, 55, 65, 70, 62]
    },
    '7d': {
      caption: 'Últimos 7 días',
      labels: ['L','M','X','J','V','S','D'],
      values: [48, 55, 52, 60, 65, 70, 72]
    },
    '30d': {
      caption: 'Últimos 30 días',
      labels: ['1','4','7','10','13','16','19','22','25','28'],
      values: [40, 45, 50, 48, 55, 58, 62, 65, 68, 72]
    }
  },

  /* Tiempo continuo sentado (min) — 7 días */
  sitting: {
    labels: ['L','M','X','J','V','S','D'],
    values: [55, 48, 62, 45, 40, 35, 38]
  },

  /* Consejos */
  tips: [
    {
      icon: '💡',
      title: 'Sugerencia',
      text: 'Has permanecido en una posición similar durante un periodo prolongado. Un pequeño ajuste puede marcar la diferencia.'
    },
    {
      icon: '🚶',
      title: 'Pausa',
      text: 'Levántate y camina unos minutos antes de continuar. Las pausas breves mejoran tu variabilidad postural.'
    },
    {
      icon: '🪑',
      title: 'Posición',
      text: 'Se ha detectado una distribución de presión predominantemente lateral. Apoyar ambos isquiones reparte mejor la carga.'
    }
  ]
};

/* ---------------------------------------------------------
   2. UTILIDADES
   --------------------------------------------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/* ---------------------------------------------------------
   3. NAVEGACIÓN SPA
   --------------------------------------------------------- */
const VIEW_TITLES = {
  inicio: 'Inicio',
  postura: 'Mi postura',
  evolucion: 'Evolución',
  recomendaciones: 'Consejos',
  configuracion: 'Configuración',
  'sobre-nosotros': 'Sobre nosotros'
};

let currentView = 'inicio';

function switchView(next) {
  if (next === currentView) return;
  const oldSection = $(`.view[data-view="${currentView}"]`);
  const newSection = $(`.view[data-view="${next}"]`);

  oldSection.classList.add('is-leaving');
  oldSection.classList.remove('is-active');

  setTimeout(() => {
    oldSection.classList.remove('is-leaving');
    oldSection.hidden = true;

    newSection.hidden = false;
    newSection.classList.add('is-active');

    // Re-render de elementos dependientes del tamaño visible
    if (next === 'inicio') {
      animatePressureMap($('[data-pressure-map="main"]'));
    }
    if (next === 'postura') {
      animatePressureMap($('[data-pressure-map="secondary"]'));
    }
    if (next === 'evolucion') {
      renderChart('variability', currentRange);
      renderChart('sitting');
    }
    currentView = next;
    updateNav();
    updateTopbarTitle();
  }, 200);
}

function updateNav() {
  $$('.nav-item, .bottom-nav__item').forEach(btn => {
    const active = btn.dataset.view === currentView;
    btn.classList.toggle('is-active', active);
    if (active) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
}

function updateTopbarTitle() {
  $('#topbarTitle').textContent = VIEW_TITLES[currentView] || '';
}

/* Listeners de navegación */
$$('.nav-item, .bottom-nav__item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

/* ---------------------------------------------------------
   4. RENDER — KPIs (Inicio)
   --------------------------------------------------------- */
function renderKpis() {
  const target = $('[data-render="kpis"]');
  if (!target) return;
  target.innerHTML = '';
  DATA.kpis.forEach((k, i) => {
    const card = document.createElement('div');
    card.className = 'kpi';
    card.style.animation = `viewIn 400ms ${i * 60}ms var(--ease) both`;
    card.innerHTML = `
      <span class="kpi__icon" aria-hidden="true">${k.icon}</span>
      <span class="kpi__label">${k.label}</span>
      <span class="kpi__value">${k.value}</span>
    `;
    target.appendChild(card);
  });
}

/* ---------------------------------------------------------
   5. RENDER — PILARES (Mi postura)
   --------------------------------------------------------- */
function renderPillars() {
  const target = $('[data-render="pillars"]');
  if (!target) return;
  target.innerHTML = '';
  DATA.pillars.forEach(p => {
    const el = document.createElement('article');
    el.className = 'pillar';
    el.style.animation = `viewIn 420ms var(--ease) both`;

    const rows = p.rows.map(r => `
      <div class="pillar__row">
        <span class="pillar__row-label">${r.label}</span>
        <span class="pillar__row-value is-${r.status}">${r.value}</span>
      </div>
    `).join('');

    el.innerHTML = `
      <header class="pillar__header">
        <div class="pillar__icon" style="background:${p.accentBg}; color:${p.accent};">${p.icon}</div>
        <div class="pillar__title" style="color:${p.accent};">${p.title}</div>
      </header>
      <div class="pillar__rows">${rows}</div>
    `;
    target.appendChild(el);
  });
}

/* ---------------------------------------------------------
   6. MAPA DE PRESIÓN (SVG dinámico)
   --------------------------------------------------------- */
function pressureColor(v) {
  /* Devuelve {color, r} para un valor 0..1 */
  if (v < 0.15) return { color: '#E4E7EC', r: 4.5 };   // sin contacto
  if (v < 0.35) return { color: '#BFE7DF', r: 6 };     // contacto suave
  if (v < 0.55) return { color: '#7FD4C7', r: 7.5 };   // turquesa claro
  if (v < 0.72) return { color: '#2BB3A3', r: 9 };     // turquesa
  if (v < 0.85) return { color: '#F0B429', r: 10 };    // ámbar
  return { color: '#E8833A', r: 11 };                   // naranja
}

function renderPressureMap(container, matrix) {
  if (!container) return;
  container.innerHTML = '';

  const svg = svgEl('svg', {
    viewBox: '0 0 300 420',
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': 'Mapa de presión de la silla'
  });

  /* Silueta de la silla (respaldo + asiento) */
  const backrestBg = svgEl('rect', {
    x: 55, y: 20, width: 190, height: 220, rx: 24, ry: 24,
    class: 'pressure-chair'
  });
  const seatBg = svgEl('rect', {
    x: 35, y: 245, width: 230, height: 140, rx: 24, ry: 24,
    class: 'pressure-chair'
  });
  svg.appendChild(backrestBg);
  svg.appendChild(seatBg);

  /* Función para colocar una matriz de puntos */
  const placeGrid = (rows, xStart, xEnd, yStart, yEnd, delayStart) => {
    const rowCount = rows.length;
    const colCount = rows[0].length;
    let idx = delayStart;
    const frag = document.createDocumentFragment();

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        const v = rows[r][c];
        const { color, r: radius } = pressureColor(v);
        const x = colCount === 1
          ? (xStart + xEnd) / 2
          : xStart + (c / (colCount - 1)) * (xEnd - xStart);
        const y = rowCount === 1
          ? (yStart + yEnd) / 2
          : yStart + (r / (rowCount - 1)) * (yEnd - yStart);

        const dot = svgEl('circle', {
          cx: x, cy: y, r: radius,
          fill: color,
          class: 'pressure-dot'
        });
        dot.style.animationDelay = (idx * 20) + 'ms';
        frag.appendChild(dot);
        idx++;
      }
    }
    return { frag, nextIdx: idx };
  };

  const g1 = placeGrid(matrix.backrest, 82, 218, 48, 212, 0);
  const g2 = placeGrid(matrix.seat,     62, 238, 268, 362, g1.nextIdx);

  svg.appendChild(g1.frag);
  svg.appendChild(g2.frag);

  container.appendChild(svg);
}

function animatePressureMap(container) {
  if (!container) return;
  const dots = $$('.pressure-dot', container);
  dots.forEach((d, i) => {
    d.style.animation = 'none';
    d.getBoundingClientRect(); // reflow
    d.style.animation = '';
    d.style.animationDelay = (i * 20) + 'ms';
  });
}

/* ---------------------------------------------------------
   7. GRÁFICAS SVG
   --------------------------------------------------------- */
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function renderLineChart(container, series, opts = {}) {
  container.innerHTML = '';
  const W = 800, H = 260;
  const pad = { top: 20, right: 24, bottom: 34, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': opts.ariaLabel || 'Gráfica de evolución'
  });

  const { labels, values } = series;
  const maxV = 100, minV = 0;

  /* Gradiente para el área */
  const defs = svgEl('defs');
  const gradId = 'grad-' + Math.random().toString(36).slice(2, 8);
  const grad = svgEl('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
  grad.appendChild(svgEl('stop', { offset: '0%',   'stop-color': '#2BB3A3', 'stop-opacity': '0.32' }));
  grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#2BB3A3', 'stop-opacity': '0' }));
  defs.appendChild(grad);
  svg.appendChild(defs);

  /* Líneas de grid horizontales sutiles */
  const gridLines = 4;
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + (i / gridLines) * innerH;
    svg.appendChild(svgEl('line', {
      x1: pad.left, y1: y, x2: pad.left + innerW, y2: y,
      class: 'chart-grid'
    }));
  }

  /* Puntos en coordenadas SVG */
  const pts = values.map((v, i) => {
    const x = pad.left + (values.length === 1 ? innerW / 2 : (i / (values.length - 1)) * innerW);
    const y = pad.top + innerH - ((v - minV) / (maxV - minV)) * innerH;
    return { x, y, v };
  });

  /* Área rellena */
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z`;

  const area = svgEl('path', { d: areaPath, fill: `url(#${gradId})`, opacity: 0 });
  area.style.transition = 'opacity 500ms ease-out';
  svg.appendChild(area);

  /* Línea principal */
  const line = svgEl('path', {
    d: linePath,
    fill: 'none',
    stroke: '#2BB3A3',
    'stroke-width': 2.8,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  svg.appendChild(line);

  /* Animación del trazo (stroke-dasharray) */
  try {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = 'stroke-dashoffset 750ms cubic-bezier(0.22,1,0.36,1)';
    requestAnimationFrame(() => {
      line.style.strokeDashoffset = '0';
      area.style.opacity = '1';
    });
  } catch (e) {
    area.style.opacity = '1';
  }

  /* Puntos visibles */
  pts.forEach((p, i) => {
    const c = svgEl('circle', { cx: p.x, cy: p.y, r: 3.5, fill: '#fff', stroke: '#2BB3A3', 'stroke-width': 2 });
    c.style.opacity = '0';
    c.style.transition = `opacity 320ms ${300 + i * 40}ms ease-out`;
    svg.appendChild(c);
    requestAnimationFrame(() => { c.style.opacity = '1'; });
  });

  /* Etiquetas X */
  pts.forEach((p, i) => {
    // Para no saturar, mostramos todas si son <= 8, si no cada 2
    if (labels.length > 8 && i % 2 !== 0 && i !== labels.length - 1) return;
    const t = svgEl('text', {
      x: p.x, y: H - 10,
      'text-anchor': 'middle',
      class: 'chart-label'
    });
    t.textContent = labels[i];
    svg.appendChild(t);
  });

  /* Etiquetas Y sutiles (0, 50, 100) */
  [0, 50, 100].forEach(v => {
    const y = pad.top + innerH - ((v - minV) / (maxV - minV)) * innerH;
    const t = svgEl('text', {
      x: pad.left - 8, y: y + 4,
      'text-anchor': 'end',
      class: 'chart-label'
    });
    t.textContent = v;
    svg.appendChild(t);
  });

  /* Línea base X */
  svg.appendChild(svgEl('line', {
    x1: pad.left, y1: pad.top + innerH,
    x2: pad.left + innerW, y2: pad.top + innerH,
    class: 'chart-axis-line'
  }));

  container.appendChild(svg);
}

function renderBarChart(container, series) {
  container.innerHTML = '';
  const W = 800, H = 220;
  const pad = { top: 20, right: 24, bottom: 34, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: 'xMidYMid meet',
    role: 'img',
    'aria-label': 'Tiempo continuo sentado por día'
  });

  const { labels, values } = series;
  const maxV = Math.max(...values, 10) * 1.15;

  const n = values.length;
  const gap = 14;
  const barW = (innerW - gap * (n - 1)) / n;

  values.forEach((v, i) => {
    const h = (v / maxV) * innerH;
    const x = pad.left + i * (barW + gap);
    const y = pad.top + innerH - h;

    const rect = svgEl('rect', {
      x, y, width: barW, height: 0, rx: 8,
      fill: i === n - 1 ? '#2BB3A3' : 'rgba(43,179,163,0.55)'
    });
    rect.style.transition = `height 500ms ${i * 60}ms var(--ease), y 500ms ${i * 60}ms var(--ease)`;
    svg.appendChild(rect);
    requestAnimationFrame(() => {
      rect.setAttribute('y', y);
      rect.setAttribute('height', h);
    });

    const t = svgEl('text', {
      x: x + barW / 2, y: H - 10,
      'text-anchor': 'middle',
      class: 'chart-label'
    });
    t.textContent = labels[i];
    svg.appendChild(t);
  });

  svg.appendChild(svgEl('line', {
    x1: pad.left, y1: pad.top + innerH,
    x2: pad.left + innerW, y2: pad.top + innerH,
    class: 'chart-axis-line'
  }));

  container.appendChild(svg);
}

function renderChart(kind, range) {
  const container = $(`[data-chart="${kind}"]`);
  if (!container) return;

  if (kind === 'variability') {
    const series = DATA.evolution[range || '7d'];
    const cap = $('[data-chart-caption]');
    if (cap) cap.textContent = series.caption;
    renderLineChart(container, series, { ariaLabel: 'Evolución de la variabilidad postural' });
  }
  if (kind === 'sitting') {
    renderBarChart(container, DATA.sitting);
  }
}

/* ---------------------------------------------------------
   8. CHIPS DE RANGO (Evolución)
   --------------------------------------------------------- */
let currentRange = '7d';

$$('.range-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const range = chip.dataset.range;
    if (range === currentRange) return;
    currentRange = range;

    $$('.range-chips .chip').forEach(c => {
      const active = c === chip;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    renderChart('variability', range);
  });
});

/* ---------------------------------------------------------
   9. TOGGLE "Ver detalles" del mapa (Inicio)
   --------------------------------------------------------- */
const detailBtn = $('[data-toggle-details]');
if (detailBtn) {
  detailBtn.addEventListener('click', () => {
    const card = detailBtn.closest('.card');
    const list = $('.pressure-legend-list', card);
    const isHidden = list.hasAttribute('data-hidden');
    list.toggleAttribute('data-hidden');
    if (isHidden) {
      list.style.display = '';
      detailBtn.textContent = 'Ver detalles';
      detailBtn.setAttribute('aria-expanded', 'false');
    } else {
      list.style.display = 'none';
      detailBtn.textContent = 'Ocultar detalles';
      detailBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ---------------------------------------------------------
   10. RENDER — Consejos
   --------------------------------------------------------- */
function renderTips() {
  const target = $('[data-render="tips"]');
  if (!target) return;
  target.innerHTML = '';
  DATA.tips.forEach((t, i) => {
    const el = document.createElement('article');
    el.className = 'tip';
    el.style.animation = `viewIn 420ms ${i * 70}ms var(--ease) both`;
    el.innerHTML = `
      <div class="tip__icon" aria-hidden="true">${t.icon}</div>
      <h3 class="tip__title">${t.title}</h3>
      <p class="tip__text">${t.text}</p>
    `;
    target.appendChild(el);
  });
}

/* ---------------------------------------------------------
   11. SLIDER DE RECORDATORIO
   --------------------------------------------------------- */
const slider = $('#reminderSlider');
const sliderValue = $('#reminderValue');
if (slider) {
  const update = () => {
    sliderValue.textContent = slider.value;
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #2BB3A3 0%, #2BB3A3 ${pct}%, #EAECEF ${pct}%, #EAECEF 100%)`;
  };
  slider.addEventListener('input', update);
  update();
}

/* ---------------------------------------------------------
   12. TOAST — Recordatorio sutil
   --------------------------------------------------------- */
let toastShown = false;
function showToast(msg) {
  const toast = $('#toast');
  if (!toast) return;
  toast.querySelector('span:last-child').textContent = msg;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 400);
  }, 5200);
}

/* Campana: muestra un recordatorio simulado */
$('#bellBtn')?.addEventListener('click', () => {
  showToast('Llevas 50 minutos sentado. Considera cambiar de posición.');
});

/* Recordatorio automático a los 14 s (una sola vez) */
setTimeout(() => {
  if (!toastShown && currentView === 'inicio') {
    toastShown = true;
    showToast('Pequeño recordatorio: puedes ajustar tu posición.');
  }
}, 14000);

/* ---------------------------------------------------------
   13. INICIALIZACIÓN
   --------------------------------------------------------- */
function init() {
  renderKpis();
  renderPillars();
  renderTips();

  // Mapa principal (Inicio)
  renderPressureMap($('[data-pressure-map="main"]'), DATA.pressure);
  // Mapa secundario (Mi postura)
  renderPressureMap($('[data-pressure-map="secondary"]'), DATA.pressureSecondary);

  // Gráficas de Evolución (se renderizan al entrar, pero las dejamos listas)
  renderChart('variability', '7d');
  renderChart('sitting');

  updateTopbarTitle();

  // Repintar gráficas al cambiar tamaño (por si el contenedor cambia de ancho)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentView === 'evolucion') {
        renderChart('variability', currentRange);
        renderChart('sitting');
      }
    }, 180);
  });

  // Repintar al volver a la vista Evolución (por si acaso)
  $$('.nav-item, .bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view === 'evolucion') {
        setTimeout(() => {
          renderChart('variability', currentRange);
          renderChart('sitting');
        }, 60);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
