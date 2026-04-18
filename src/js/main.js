/**
 * main.js — Entry point
 * Boots all modules after DOM is ready.
 */

import { initGlobe }         from './globe.js';
import { initTerminal }      from './terminal.js';
import { initScrollEffects, initCounters } from './scroll.js';
import { initNav }           from './nav.js';
import { initTheme }         from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();          // first — applies [data-theme] before paint
  initNav();
  initScrollEffects();
  initCounters();
  initGlobe();
  initTerminal();
});
