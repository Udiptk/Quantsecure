/**
 * globe.js — Interactive 3D Defense Globe
 * Renders a draggable, auto-rotating SVG globe with threat nodes and tooltips.
 */

export function initGlobe() {
  const globeContainer = document.getElementById('globe-container');
  if (!globeContainer) return;

  const globeGrid  = document.getElementById('globe-grid');
  const globeNodes = document.getElementById('globe-nodes');
  const tooltip    = document.getElementById('globe-tooltip');

  /** ── State ── */
  let rotationX  = -10;
  let rotationY  = 0;
  let isDragging = false;
  let startX, startY;
  let autoRotate = true;
  let autoTimer  = null;

  /** ── Build Grid ── */
  function createGrid() {
    const NS = 'http://www.w3.org/2000/svg';

    // Meridians (vertical)
    for (let i = 0; i < 360; i += 30) {
      const el = document.createElementNS(NS, 'ellipse');
      el.setAttribute('cx', '400');
      el.setAttribute('cy', '400');
      el.setAttribute('rx', Math.abs(300 * Math.cos((i * Math.PI) / 180)).toFixed(2));
      el.setAttribute('ry', '300');
      globeGrid.appendChild(el);
    }
    // Parallels (horizontal)
    for (let i = 0; i < 180; i += 20) {
      const r  = 300 * Math.sin((i * Math.PI) / 180);
      const yp = 400 + 300 * Math.cos((i * Math.PI) / 180);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', (400 - r).toFixed(2));
      line.setAttribute('y1', yp.toFixed(2));
      line.setAttribute('x2', (400 + r).toFixed(2));
      line.setAttribute('y2', yp.toFixed(2));
      globeGrid.appendChild(line);
    }
  }

  /** ── Node data ── */
  const NODE_LOCATIONS = [
    { label: 'New York',   phi: -1.29, theta: 1.06 },
    { label: 'London',     phi: -0.00, theta: 0.91 },
    { label: 'Tokyo',      phi:  2.44, theta: 0.62 },
    { label: 'Singapore',  phi:  1.80, theta: 1.49 },
    { label: 'São Paulo',  phi: -0.74, theta: 1.62 },
    { label: 'Sydney',     phi:  2.64, theta: 1.78 },
    { label: 'Dubai',      phi:  0.97, theta: 0.90 },
    { label: 'Berlin',     phi:  0.23, theta: 0.90 },
    { label: 'Mumbai',     phi:  1.24, theta: 1.02 },
    { label: 'Cairo',      phi:  0.55, theta: 0.97 },
  ];

  const nodes = [];

  function createNodes() {
    const NS = 'http://www.w3.org/2000/svg';
    const total = 40;

    for (let i = 0; i < total; i++) {
      const base    = NODE_LOCATIONS[i % NODE_LOCATIONS.length];
      const phi     = base ? base.phi   + (Math.random() - 0.5) * 0.5 : Math.random() * Math.PI * 2;
      const theta   = base ? base.theta + (Math.random() - 0.5) * 0.2 : Math.acos(Math.random() * 2 - 1);
      const isThreat = Math.random() > 0.8;

      const node = {
        phi, theta,
        status:   isThreat ? 'threat' : 'protected',
        label:    base?.label ?? `NODE-${i}`,
        ip:       `${rnd(255)}.${rnd(255)}.${rnd(255)}.${rnd(255)}`,
        traffic:  `${(Math.random() * 100).toFixed(2)} GB/s`,
      };
      nodes.push(node);

      const circle = document.createElementNS(NS, 'circle');
      circle.setAttribute('r', isThreat ? '6' : '3.5');
      circle.setAttribute('fill', isThreat ? '#ff716c' : '#00F5FF');
      circle.setAttribute('class', `globe-node cursor-pointer${isThreat ? ' flicker-alert' : ''}`);
      circle.setAttribute('filter', 'url(#glow)');
      circle.setAttribute('aria-label', `${node.status === 'threat' ? 'Threat at' : 'Protected node in'} ${node.label}`);
      circle.setAttribute('role', 'img');
      circle.setAttribute('tabindex', '0');

      circle.addEventListener('mouseenter', (e) => showTooltip(e, node));
      circle.addEventListener('mouseleave', hideTooltip);
      circle.addEventListener('focus',      (e) => showTooltip(e, node));
      circle.addEventListener('blur',       hideTooltip);

      globeNodes.appendChild(circle);
      node.el = circle;
    }
  }

  function rnd(max) { return Math.floor(Math.random() * max); }

  /** ── Render loop ── */
  function updateGlobe() {
    if (autoRotate && !isDragging) rotationY += 0.18;

    const radY = (rotationY * Math.PI) / 180;
    const radX = (rotationX * Math.PI) / 180;

    nodes.forEach((node) => {
      let x = Math.sin(node.theta) * Math.cos(node.phi + radY);
      let y = Math.cos(node.theta);
      let z = Math.sin(node.theta) * Math.sin(node.phi + radY);

      const tempY = y * Math.cos(radX) - z * Math.sin(radX);
      const tempZ = y * Math.sin(radX) + z * Math.cos(radX);
      y = tempY;
      z = tempZ;

      const sx = 400 + x * 300;
      const sy = 400 + y * 300;

      node.el.setAttribute('cx', sx.toFixed(2));
      node.el.setAttribute('cy', sy.toFixed(2));
      node.el.style.opacity       = z > 0 ? '1' : '0.12';
      node.el.style.pointerEvents = z > 0 ? 'auto' : 'none';
    });

    requestAnimationFrame(updateGlobe);
  }

  /** ── Tooltip ── */
  function showTooltip(e, node) {
    const rect = globeContainer.getBoundingClientRect();
    const cx   = (e.clientX ?? e.target?.getBoundingClientRect().left + 8) - rect.left;
    const cy   = (e.clientY ?? e.target?.getBoundingClientRect().top) - rect.top;

    const isThreat = node.status === 'threat';
    tooltip.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <span style="width:7px;height:7px;border-radius:50%;background:${isThreat ? '#ff716c' : '#00F5FF'};${isThreat ? 'animation:flicker 1.5s infinite' : ''}"></span>
        <span style="font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:${isThreat ? '#ff716c' : '#00F5FF'}">
          ${isThreat ? 'Active Threat' : 'Protected Node'}
        </span>
      </div>
      <div style="font-size:10px;color:#e4e4e7;font-family:'Fira Code',monospace;white-space:pre">${node.label}\nIP: ${node.ip}\nTRAFFIC: ${node.traffic}</div>
      <div style="font-size:8px;color:#71717a;margin-top:3px;font-family:'Fira Code',monospace">VECTOR_SIG: ALPHA-NODE-${nodes.indexOf(node)}</div>
    `;
    tooltip.classList.add('visible');
    tooltip.style.left = `${cx}px`;
    tooltip.style.top  = `${cy}px`;
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  /** ── Drag (mouse) ── */
  globeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoRotate = false;
    clearTimeout(autoTimer);
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    rotationY += (e.clientX - startX) * 0.22;
    rotationX -= (e.clientY - startY) * 0.22;
    rotationX  = Math.max(-60, Math.min(60, rotationX));
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    autoTimer  = setTimeout(() => { autoRotate = true; }, 3500);
  });

  /** ── Drag (touch) ── */
  globeContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    autoRotate = false;
    clearTimeout(autoTimer);
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    rotationY += (e.touches[0].clientX - startX) * 0.22;
    rotationX -= (e.touches[0].clientY - startY) * 0.22;
    rotationX  = Math.max(-60, Math.min(60, rotationX));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    autoTimer  = setTimeout(() => { autoRotate = true; }, 3500);
  });

  /** ── Keyboard rotation ── */
  globeContainer.setAttribute('tabindex', '0');
  globeContainer.setAttribute('aria-label', 'Interactive 3D defense globe. Use arrow keys to rotate.');
  globeContainer.addEventListener('keydown', (e) => {
    const step = 5;
    if (e.key === 'ArrowLeft')  { rotationY -= step; e.preventDefault(); }
    if (e.key === 'ArrowRight') { rotationY += step; e.preventDefault(); }
    if (e.key === 'ArrowUp')    { rotationX -= step; e.preventDefault(); }
    if (e.key === 'ArrowDown')  { rotationX += step; e.preventDefault(); }
  });

  /** ── Boot ── */
  createGrid();
  createNodes();
  updateGlobe();
}
