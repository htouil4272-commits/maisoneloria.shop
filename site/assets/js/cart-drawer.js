/* ============================================================
   MAISON ELORIA — Shared Cart Drawer
   Used on: index, shop, product, about, contact pages
   ============================================================ */

import { getCurrentLang, t } from './i18n.js';
import { cart } from './cart.js';
import { renderShippingProgress } from './conversion.js';

export function initMobileNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Ensure hamburger button exists; inject it if the page omitted it
  let menuBtn = document.querySelector('.menu-btn');
  if (!menuBtn) {
    menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn icon-btn';
    menuBtn.setAttribute('aria-label', 'Menu');
    menuBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    const actions = document.querySelector('.header-actions');
    if (actions) actions.appendChild(menuBtn);
  }

  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';

  const panel = document.createElement('div');
  panel.className = 'mobile-nav-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Navigation');

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  const buildPanel = () => {
    const links = Array.from(nav.querySelectorAll('a'));
    panel.innerHTML = `
      <div class="mobile-nav-header">
        <span class="mobile-nav-title">Maison Eloria</span>
        <button class="mobile-nav-close icon-btn" aria-label="Fermer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="mobile-nav-links">
        ${links.map((a) => `<a href="${a.getAttribute('href')}">${a.textContent.trim()}</a>`).join('')}
      </nav>
    `;
    panel.querySelector('.mobile-nav-close').addEventListener('click', close);
    panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  };

  const open = () => {
    buildPanel();
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  window.addEventListener('lang:changed', () => { if (panel.classList.contains('open')) buildPanel(); });
}

export function initCartDrawer() {
  const overlay = document.querySelector('[data-cart-overlay]');
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!overlay || !drawer) return;

  const open = () => {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderItems();
  };
  const close = () => {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-cart-open]').forEach((b) => {
    b.addEventListener('click', (e) => { e.preventDefault(); open(); });
  });
  document.querySelectorAll('[data-cart-close]').forEach((b) => {
    b.addEventListener('click', close);
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  cart.subscribe(() => {
    updateBadge();
    if (drawer.classList.contains('open')) renderItems();
  });
  window.addEventListener('lang:changed', () => {
    if (drawer.classList.contains('open')) renderItems();
  });

  updateBadge();
  initMobileNav();
}

function updateBadge() {
  const c = cart.getCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = c;
    el.style.display = c > 0 ? 'flex' : 'none';
  });
}

function renderItems() {
  const list = document.querySelector('[data-cart-items]');
  const summary = document.querySelector('[data-cart-summary]');
  const empty = document.querySelector('[data-cart-empty]');
  if (!list) return;

  const lang = getCurrentLang();
  const s = cart.getState();

  if (s.items.length === 0) {
    list.innerHTML = '';
    empty?.classList.remove('hidden');
    summary?.classList.add('hidden');
    return;
  }

  empty?.classList.add('hidden');
  summary?.classList.remove('hidden');

  list.innerHTML = s.items.map((item) => {
    const key = cart.itemKey(item);
    const name = typeof item.name === 'object' ? (item.name[lang] || item.name.fr) : item.name;
    const meta = [];
    if (item.size) meta.push(item.size);
    if (item.color) meta.push(item.color);
    return `
      <div class="cart-item">
        <div class="cart-item-image" style="background: ${item.swatch || 'var(--color-cream-dark)'};"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          ${meta.length ? `<div class="cart-item-meta">${meta.join(' · ')}</div>` : ''}
          <div class="cart-item-price">${item.price * item.qty} ${t('common.currency')}</div>
          <div class="qty-control">
            <button class="qty-btn" data-cart-dec="${key}" aria-label="-">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-cart-inc="${key}" aria-label="+">+</button>
            <button class="qty-btn" data-cart-rm="${key}" aria-label="remove" style="margin-left:8px;color:var(--color-error);">×</button>
          </div>
        </div>
      </div>`;
  }).join('');

  if (summary) {
    summary.innerHTML = `
      ${renderShippingProgress()}
      <div class="cart-summary">
        <div class="cart-summary-row">
          <span>${t('cart.subtotal')}</span>
          <span>${s.subtotal} ${t('common.currency')}</span>
        </div>
        <div class="cart-summary-row">
          <span>${t('cart.shipping')}</span>
          <span>${s.shipping === 0 ? t('cart.free') : s.shipping + ' ' + t('common.currency')}</span>
        </div>
        <div class="cart-summary-row total">
          <span>${t('cart.total')}</span>
          <span>${s.total} ${t('common.currency')}</span>
        </div>
      </div>
      <a href="./checkout.html" class="btn btn-accent btn-block btn-lg">${t('cart.checkout')}</a>
    `;
  }

  list.querySelectorAll('[data-cart-dec]').forEach((b) => b.addEventListener('click', () => {
    const it = cart.items.find((i) => cart.itemKey(i) === b.dataset.cartDec);
    if (it) cart.update(b.dataset.cartDec, it.qty - 1);
  }));
  list.querySelectorAll('[data-cart-inc]').forEach((b) => b.addEventListener('click', () => {
    const it = cart.items.find((i) => cart.itemKey(i) === b.dataset.cartInc);
    if (it) cart.update(b.dataset.cartInc, it.qty + 1);
  }));
  list.querySelectorAll('[data-cart-rm]').forEach((b) => b.addEventListener('click', () => cart.remove(b.dataset.cartRm)));
}

export function setupWhatsAppLinks(brandData) {
  if (!brandData) return;
  const whatsapp = brandData.brand?.whatsapp || '212600000000';
  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    const customMessage = el.getAttribute('data-whatsapp-message');
    const text = customMessage ? '?text=' + encodeURIComponent(customMessage) : '';
    el.setAttribute('href', `https://wa.me/${whatsapp}${text}`);
  });
}
