/**
 * nav.js — Mobile navigation toggle
 */

export function initNav() {
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let open = false;

  hamburger.addEventListener('click', () => {
    open = !open;
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.hidden = !open;

    // Animate hamburger lines → X
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) hamburger.click();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (open && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.click();
    }
  });
}
