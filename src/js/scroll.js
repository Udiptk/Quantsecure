/**
 * scroll.js — Scroll-triggered animations & parallax
 */

export function initScrollEffects() {
  /** ── Reveal on scroll (IntersectionObserver) ── */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve once done to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  /** ── Parallax background ── */
  const bg = document.getElementById('parallax-bg');
  if (bg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          bg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/** ── Counter animation for stat numbers ── */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = el.dataset.count;
        const suffix   = el.dataset.suffix ?? '';
        const prefix   = el.dataset.prefix ?? '';
        const duration = 1800;
        const isFloat  = target.includes('.');
        const numTarget = parseFloat(target);
        const start    = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = numTarget * eased;
          el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
