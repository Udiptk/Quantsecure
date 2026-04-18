/**
 * theme.js — Light / Dark mode toggle
 * Persists preference in localStorage.
 * Applies [data-theme] on <html> element.
 */

const STORAGE_KEY = 'qs-theme';

export function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // ── On load: honour stored pref, or system setting ──────────
  const stored  = localStorage.getItem(STORAGE_KEY);
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored ?? (sysDark ? 'dark' : 'light');

  applyTheme(initial, btn, root, /* animate= */ false);

  // ── Toggle on click ─────────────────────────────────────────
  btn?.addEventListener('click', () => {
    const current = root.dataset.theme;
    const next    = current === 'light' ? 'dark' : 'light';

    // Brief spin / icon swap
    btn.classList.add('spinning');
    setTimeout(() => {
      applyTheme(next, btn, root, /* animate= */ true);
      btn.classList.remove('spinning');
    }, 200);

    localStorage.setItem(STORAGE_KEY, next);
  });

  // ── Keyboard support ─────────────────────────────────────────
  btn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  // ── Sync if OS preference changes ───────────────────────────
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light', btn, root, true);
    }
  });
}

// ────────────────────────────────────────────────────────────
function applyTheme(theme, btn, root, animate) {
  root.dataset.theme = theme;

  const isDark = theme === 'dark';
  const icon   = btn?.querySelector('.theme-icon');

  if (icon) {
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  if (btn) {
    btn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    btn.setAttribute('aria-pressed', isDark ? 'false' : 'true');
  }

  // Announce change to screen readers
  if (animate) {
    const msg = document.getElementById('theme-announce');
    if (msg) {
      msg.textContent = `${isDark ? 'Dark' : 'Light'} mode enabled`;
      setTimeout(() => { msg.textContent = ''; }, 1500);
    }
  }
}
