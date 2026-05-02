/* ============================================================
   MAISON ELORIA — Scroll-reveal animations
   Adds .is-revealed when an element scrolls into view.
   Auto-applies to: .section-header, .manifesto-pillar, .category-card,
                    .product-card, .bundle-card, .testimonial,
                    .faq-item, .beforeafter-card, .story-content
   Respects prefers-reduced-motion.
   ============================================================ */

const SELECTORS = [
  '.section-header',
  '.manifesto-pillar',
  '.manifesto-comparison',
  '.category-card',
  '.product-card',
  '.bundle-card',
  '.testimonial',
  '.faq-item',
  '.beforeafter-card',
  '.story-content',
  '.story-visual',
  '.cta-content',
  '.track-card'
];

export function initScrollReveal() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTORS.join(',')).forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement?.children || [];
        const delay = Math.min(Array.from(siblings).indexOf(el) * 80, 400);
        setTimeout(() => el.classList.add('is-revealed'), delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  apply();

  const mo = new MutationObserver(apply);
  mo.observe(document.body, { childList: true, subtree: true });

  function apply() {
    document.querySelectorAll(SELECTORS.join(',')).forEach((el) => {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = '1';
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
}
