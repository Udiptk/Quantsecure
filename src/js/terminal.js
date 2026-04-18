/**
 * terminal.js — Live Threat Terminal
 * Generates scrolling, live-updating terminal log entries.
 */

const LOG_TEMPLATES = [
  { color: null,        template: '[{time}] HEARTBEAT: NODE_{id} ACTIVE.' },
  { color: null,        template: '[{time}] SYNCING GLOBAL_NODE_ARRAY ({n} ACTIVE NODES)' },
  { color: '#c47fff',   template: '[{time}] ENCRYPTION HANDSHAKE ESTABLISHED: {city1} → {city2}' },
  { color: '#ff716c',   template: '[{time}] ALERT: MULTI-VECTOR ATTACK MITIGATED — NODE_{id}', alert: true },
  { color: '#00F5FF',   template: '[{time}] THREAT NEUTRALIZED. SOURCE: TOR_EXIT_NODE_{id}' },
  { color: null,        template: '[{time}] VULNERABILITY SCAN COMPLETE. EXPOSURES FOUND: 0' },
  { color: '#8596ff',   template: '[{time}] COMPLIANCE AUDIT TRIGGERED: SOC2 — PASSED' },
  { color: '#ff716c',   template: '[{time}] ANOMALOUS TRAFFIC DETECTED: PORT 443 — US_WEST_1', alert: true },
  { color: null,        template: '[{time}] DEPLOYING SENTINEL_DAEMON — ACTION: BLOCK' },
  { color: '#00F5FF',   template: '[{time}] QUANTUM-SAFE TUNNEL: {city1} ↔ {city2}' },
];

const CITIES = ['NYC', 'LON', 'TYO', 'SIN', 'DXB', 'SFO', 'HKG', 'SYD', 'BER', 'MUM'];

function randInt(max)  { return Math.floor(Math.random() * max); }
function randCity()    { return CITIES[randInt(CITIES.length)]; }
function timeStr()     { return new Date().toLocaleTimeString('en-US', { hour12: false }); }

function renderLog(tmpl) {
  const text = tmpl.template
    .replace('{time}',  timeStr())
    .replace('{id}',    String(randInt(999)).padStart(3, '0'))
    .replace('{n}',     (7000 + randInt(500)).toLocaleString())
    .replace('{city1}', randCity())
    .replace('{city2}', randCity());

  const el = document.createElement('div');
  el.style.marginBottom = '4px';
  if (tmpl.color) el.style.color = tmpl.color;
  if (tmpl.alert) el.classList.add('flicker-alert');
  el.textContent = text;
  return el;
}

export function initTerminal() {
  const container = document.querySelector('.animate-logs');
  if (!container) return;

  // Seed initial entries
  const initial = [
    { color: null,      template: '[{time}] INITIALIZING NEURAL_MESH_v4.2...' },
    { color: null,      template: '[{time}] SYNCING GLOBAL_NODE_ARRAY ({n} ACTIVE NODES)' },
    { color: '#c47fff', template: '[{time}] VULNERABILITY SCAN COMPLETE. EXPOSURES: 0' },
    { color: '#ff716c', template: '[{time}] ALERT: ANOMALOUS TRAFFIC DETECTED — PORT 443', alert: true },
    { color: null,      template: '[{time}] DEPLOYING SENTINEL_DAEMON_3 — ACTION: BLOCK' },
    { color: '#00F5FF', template: '[{time}] THREAT NEUTRALIZED. SOURCE: TOR_EXIT_NODE_{id}' },
    { color: null,      template: '[{time}] LOGGING ADVERSARY SIGNATURE...' },
    { color: '#8596ff', template: '[{time}] UPDATING GLOBAL DEFENSE MESH...' },
    { color: null,      template: '[{time}] STANDBY — ALL SYSTEMS NOMINAL' },
  ];

  initial.forEach((t) => container.appendChild(renderLog(t)));

  // Live updates every 3s
  setInterval(() => {
    const tmpl = LOG_TEMPLATES[randInt(LOG_TEMPLATES.length)];
    container.appendChild(renderLog(tmpl));

    // Keep DOM lean
    while (container.children.length > 24) {
      container.removeChild(container.firstElementChild);
    }
  }, 3000);
}
