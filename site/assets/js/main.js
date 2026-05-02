/* ============================================================
   MAISON ELORIA — Main Entry Point
   ============================================================ */

import { initI18n, getCurrentLang, t } from './i18n.js';
import { cart } from './cart.js';
import { initCartDrawer, setupWhatsAppLinks } from './cart-drawer.js';
import { postNewsletter } from './api.js';
import { initConversion } from './conversion.js';
import { initScrollReveal } from './reveal.js';

let dataPromise = null;

export async function loadData() {
  if (!dataPromise) {
    dataPromise = fetch('./assets/data/products.json').then((r) => r.json()).catch(() => null);
  }
  return dataPromise;
}

function initFAQ() {
  document.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

async function renderColorPalette() {
  const target = document.querySelector('[data-colors-grid]');
  if (!target) return;

  const data = await loadData();
  if (!data) return;

  const lang = getCurrentLang();
  target.innerHTML = data.colors.map((c) => `
    <a href="./shop.html?color=${c.id}" class="product-card">
      <div class="product-card-image">
        <div class="product-card-color" style="background: ${c.gradient};">
          <span class="product-card-color-name">${c.name[lang] || c.name.fr}</span>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-card-name">${c.name[lang] || c.name.fr}</div>
        <div class="product-card-meta">${c.inspiration[lang] || c.inspiration.fr}</div>
        <div class="product-card-price">199 ${t('common.currency')} <span class="product-card-price-old">299 ${t('common.currency')}</span></div>
      </div>
    </a>
  `).join('');
}

async function renderBundles() {
  const target = document.querySelector('[data-bundles-grid]');
  if (!target) return;

  const data = await loadData();
  if (!data) return;

  const lang = getCurrentLang();
  target.innerHTML = data.bundles.map((b) => `
    <div class="bundle-card${b.featured ? ' featured' : ''}">
      ${b.featured ? `<div class="bundle-badge" data-i18n="bundles.featured">${t('bundles.featured')}</div>` : ''}
      <h3 class="bundle-name">${b.name[lang] || b.name.fr}</h3>
      <p class="bundle-desc">${b.desc[lang] || b.desc.fr}</p>
      <div class="bundle-price">
        <span class="bundle-price-now">${b.price} ${t('common.currency')}</span>
        <span class="bundle-price-old">${b.compareAt} ${t('common.currency')}</span>
      </div>
      <ul class="bundle-features">
        ${b.features.map((f) => `<li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ${f[lang] || f.fr}
        </li>`).join('')}
      </ul>
      <a href="./product.html?bundle=${b.id}" class="btn btn-primary btn-block">${t('bundles.cta')}</a>
    </div>
  `).join('');
}

async function renderTestimonials() {
  const target = document.querySelector('[data-testimonials-grid]');
  if (!target) return;

  const data = await loadData();
  if (!data) return;

  const lang = getCurrentLang();
  target.innerHTML = data.testimonials.map((tt) => {
    const initial = tt.name.charAt(0).toUpperCase();
    return `
      <div class="testimonial-card">
        <div class="testimonial-stars">
          ${'★'.repeat(tt.rating).split('').map(() => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}
        </div>
        <p class="testimonial-text">"${tt.text[lang] || tt.text.fr}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${initial}</div>
          <div>
            <div class="testimonial-name">${tt.name}</div>
            <div class="testimonial-meta">${tt.city[lang] || tt.city.fr} · ${tt.product[lang] || tt.product.fr}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function renderFAQ() {
  const target = document.querySelector('[data-faq-list]');
  if (!target) return;

  const data = await loadData();
  if (!data) return;

  const lang = getCurrentLang();
  target.innerHTML = data.faq.map((f, idx) => `
    <div class="faq-item${idx === 0 ? ' open' : ''}">
      <button class="faq-question" data-faq-toggle aria-expanded="${idx === 0}">
        <span>${f.q[lang] || f.q.fr}</span>
        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner">${f.a[lang] || f.a.fr}</div>
      </div>
    </div>
  `).join('');

  initFAQ();
}

async function renderHomeContent() {
  await Promise.all([
    renderColorPalette(),
    renderBundles(),
    renderTestimonials(),
    renderFAQ()
  ]);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initNewsletter() {
  const form = document.querySelector('[data-newsletter-form]');
  if (!form) return;
  const feedback = document.querySelector('[data-newsletter-feedback]');
  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getCurrentLang();
    const email = (input?.value || '').trim();
    if (!email) return;

    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = lang === 'ar' ? '...' : '...';
    if (feedback) feedback.textContent = '';

    const res = await postNewsletter({ email, language: lang, source: 'homepage' });

    button.disabled = false;
    button.textContent = originalLabel;

    if (res.ok) {
      if (input) input.value = '';
      if (feedback) {
        feedback.style.color = 'var(--color-cream-light)';
        feedback.textContent = lang === 'ar'
          ? '✓ شكرًا! سنرسل لكِ كود الخصم قريبًا.'
          : '✓ Merci ! Vous recevrez votre code -10% par email.';
      }
    } else {
      if (feedback) {
        feedback.style.color = '#ffd9d9';
        const msg = res.status === 0
          ? (lang === 'ar' ? 'تعذّر الاتصال — حاولي لاحقًا.' : 'Connexion impossible — réessayez.')
          : (lang === 'ar' ? 'البريد غير صالح.' : 'Email invalide.');
        feedback.textContent = msg;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initI18n();
  initCartDrawer();
  initSmoothScroll();
  initNewsletter();
  initConversion();
  initScrollReveal();
  const data = await loadData();
  setupWhatsAppLinks(data);
  window.addEventListener('lang:changed', () => renderHomeContent());
  await renderHomeContent();
});
