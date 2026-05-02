/* ============================================================
   MAISON ELORIA — Product Detail Page
   ============================================================ */

import { initI18n, getCurrentLang, t } from './i18n.js';
import { cart } from './cart.js';
import { loadData } from './main.js';
import { initCartDrawer, setupWhatsAppLinks } from './cart-drawer.js';
import { initConversion, renderStockBadge } from './conversion.js';
import { initScrollReveal } from './reveal.js';

const state = {
  data: null,
  product: null,
  bundle: null,
  selectedColor: null,
  selectedSize: null,
  selectedPack: 'single',
  quantity: 1
};

function getQuery(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function init() {
  initI18n();

  state.data = await loadData();
  if (!state.data) return showError();

  const productId = getQuery('id');
  const bundleId = getQuery('bundle');
  const colorId = getQuery('color');

  if (bundleId) {
    state.bundle = state.data.bundles.find((b) => b.id === bundleId);
    if (!state.bundle) return showError();
    renderBundle();
  } else if (productId) {
    state.product = state.data.products.find((p) => p.id === productId);
    if (!state.product) return showError();
    state.selectedColor = state.data.colors.find((c) => c.id === colorId) || state.data.colors[0];
    state.selectedSize = state.product.sizes ? state.product.sizes[0] : null;
    renderProduct();
  } else {
    state.product = state.data.products[0];
    state.selectedColor = state.data.colors[0];
    state.selectedSize = state.product.sizes ? state.product.sizes[0] : null;
    renderProduct();
  }

  initCartDrawer();
  initConversion();
  initScrollReveal();
  setupWhatsAppLinks(state.data);

  window.addEventListener('lang:changed', () => {
    if (state.bundle) renderBundle(); else renderProduct();
  });
}

function productGallerySvg(category, colorId, small = false) {
  const cls = small ? 'product-gallery-thumb-svg' : 'product-gallery-svg';
  const fill = 'rgba(255,255,255,0.95)';
  const accent = 'rgba(0,0,0,0.12)';
  const wid = `pgw-${colorId}-${category}-${small ? 't' : 'm'}`;
  const weave = `<defs><pattern id="${wid}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0 L6 6 M6 0 L0 6" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/></pattern></defs>`;
  if (category === 'covers') {
    return `<svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid meet" class="${cls}" aria-hidden="true">
      ${weave}
      <ellipse cx="140" cy="262" rx="84" ry="6" fill="rgba(0,0,0,0.18)"/>
      <path d="M84 90 L84 70 Q84 56 100 56 L180 56 Q196 56 196 70 L196 90 Z" fill="${fill}"/>
      <rect x="84" y="88" width="112" height="116" rx="8" fill="${fill}"/>
      <rect x="84" y="88" width="112" height="116" rx="8" fill="url(#${wid})"/>
      <text x="140" y="166" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="46" font-weight="500">N</text>
      <rect x="92" y="204" width="8" height="46" fill="rgba(58,40,30,0.55)"/>
      <rect x="180" y="204" width="8" height="46" fill="rgba(58,40,30,0.55)"/>
    </svg>`;
  }
  if (category === 'table') {
    return `<svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid meet" class="${cls}" aria-hidden="true">
      ${weave}
      <ellipse cx="140" cy="252" rx="92" ry="5" fill="rgba(0,0,0,0.18)"/>
      <rect x="50" y="138" width="180" height="8" fill="rgba(232,220,198,0.95)"/>
      <rect x="58" y="146" width="8" height="106" fill="rgba(232,220,198,0.85)"/>
      <rect x="214" y="146" width="8" height="106" fill="rgba(232,220,198,0.85)"/>
      <path d="M92 138 L92 222 L188 222 L188 138 Z" fill="${fill}"/>
      <path d="M92 138 L92 222 L188 222 L188 138 Z" fill="url(#${wid})"/>
      <rect x="100" y="148" width="80" height="3" fill="rgba(184,153,104,0.6)"/>
      <rect x="100" y="208" width="80" height="3" fill="rgba(184,153,104,0.6)"/>
      <text x="140" y="190" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="32" font-weight="500">N</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 280 280" preserveAspectRatio="xMidYMid meet" class="${cls}" aria-hidden="true">
    ${weave}
    <ellipse cx="140" cy="258" rx="80" ry="5" fill="rgba(0,0,0,0.18)"/>
    <g transform="translate(80, 80) rotate(-6)">
      <rect x="0" y="0" width="120" height="120" rx="14" fill="${fill}"/>
      <rect x="0" y="0" width="120" height="120" rx="14" fill="url(#${wid})"/>
      <path d="M8 8 Q60 2 112 8 L112 112 Q60 118 8 112 Z" stroke="${accent}" stroke-width="1" fill="none"/>
      <text x="60" y="82" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="42">N</text>
    </g>
  </svg>`;
}

function showError() {
  document.querySelector('[data-product-page]').innerHTML = `
    <div class="container section text-center">
      <h2>Produit introuvable</h2>
      <a href="./shop.html" class="btn btn-primary mt-6">Retour à la boutique</a>
    </div>
  `;
}

function renderProduct() {
  const lang = getCurrentLang();
  const p = state.product;
  const c = state.selectedColor;
  const target = document.querySelector('[data-product-page]');
  if (!target) return;

  const pricing = p.pricing[state.selectedPack];
  const unitPrice = pricing.price;
  const compareAt = pricing.compareAt;

  target.innerHTML = `
    <section class="section" style="padding-top: var(--space-12);">
      <div class="container">
        <nav style="margin-bottom: var(--space-8); font-size: var(--text-sm); color: var(--color-text-muted);">
          <a href="./" style="color: inherit;">${t('nav.home')}</a>
          <span style="margin: 0 0.5rem;">/</span>
          <a href="./shop.html" style="color: inherit;">${t('nav.shop')}</a>
          <span style="margin: 0 0.5rem;">/</span>
          <span style="color: var(--color-charcoal);">${p.name[lang] || p.name.fr}</span>
        </nav>

        <div class="product-detail-grid">
          <div class="product-gallery">
            <div class="product-gallery-main" style="background: ${c.gradient};">
              ${productGallerySvg(p.category, c.id)}
              <div class="product-gallery-label">
                <span style="font-family: var(--font-display); font-style: italic; font-size: 1.5rem;">${c.name[lang] || c.name.fr}</span>
              </div>
              ${p.badge ? `<span class="product-card-badge" style="top: 1rem; left: 1rem;">${p.badge[lang] || p.badge.fr}</span>` : ''}
            </div>
            <div class="product-gallery-thumbs">
              ${[1,2,3,4].map((i) => `
                <div class="product-gallery-thumb" style="background: ${c.gradient}; opacity: ${i === 1 ? 1 : 0.55};">
                  ${productGallerySvg(p.category, c.id, true)}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="product-info">
            <span class="eyebrow">${c.inspiration[lang] || c.inspiration.fr}</span>
            <h1 style="margin: var(--space-3) 0 var(--space-2);">${p.name[lang] || p.name.fr}</h1>
            <p class="lead" style="margin-bottom: var(--space-6);">${p.shortDesc[lang] || p.shortDesc.fr}</p>

            <div class="product-rating" style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
              <div style="color: var(--color-gold); display: flex; gap: 2px;">
                ${'★'.repeat(5).split('').map(() => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}
              </div>
              <span style="font-size: var(--text-sm); color: var(--color-text-muted);">4.9 — 127 ${lang === 'ar' ? 'تقييم' : 'avis'}</span>
            </div>

            <div class="product-price-block">
              <div class="product-price">
                <span class="product-price-now">${unitPrice} ${t('common.currency')}</span>
                ${compareAt ? `<span class="product-price-old">${compareAt} ${t('common.currency')}</span>` : ''}
                ${pricing.save ? `<span class="product-save-badge">${t('product.save')} ${pricing.save} ${t('common.currency')}</span>` : ''}
              </div>
              <div class="product-cod-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                <span>${t('topbar.cod')}</span>
              </div>
            </div>

            ${renderStockBadge(p.id)}

            <div class="option-block">
              <div class="option-label">
                <span>${t('product.color')}</span>
                <span class="option-value">${c.name[lang] || c.name.fr}</span>
              </div>
              <div class="swatches">
                ${state.data.colors.map((col) => `
                  <button class="swatch swatch-lg ${col.id === c.id ? 'active' : ''}" 
                    style="background: ${col.gradient};"
                    data-color="${col.id}"
                    title="${col.name[lang] || col.name.fr}"
                    aria-label="${col.name[lang] || col.name.fr}"></button>
                `).join('')}
              </div>
            </div>

            ${p.sizes ? `
              <div class="option-block">
                <div class="option-label">
                  <span>${t('product.size')}</span>
                  <span class="option-value">${state.selectedSize.name[lang] || state.selectedSize.name.fr}</span>
                </div>
                <div class="size-options">
                  ${p.sizes.map((s) => `
                    <button class="size-option ${s.id === state.selectedSize.id ? 'active' : ''}" data-size="${s.id}">
                      <span class="size-name">${s.name[lang] || s.name.fr}</span>
                      <span class="size-desc">${s.desc[lang] || s.desc.fr}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="option-block">
              <div class="option-label"><span>${t('product.pack')}</span></div>
              <div class="pack-options">
                ${Object.entries(p.pricing).map(([key, pack]) => `
                  <button class="pack-option ${key === state.selectedPack ? 'active' : ''}" data-pack="${key}">
                    ${pack.featured ? `<span class="pack-badge">${t('bundles.featured')}</span>` : ''}
                    <div class="pack-name">${pack.label[lang] || pack.label.fr}</div>
                    <div class="pack-price">
                      <span class="pack-price-now">${pack.price} ${t('common.currency')}</span>
                      ${pack.compareAt ? `<span class="pack-price-old">${pack.compareAt} ${t('common.currency')}</span>` : ''}
                    </div>
                    ${pack.save ? `<div class="pack-save">${t('bundles.save')} ${pack.save} ${t('common.currency')}</div>` : ''}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="option-block">
              <div class="option-label"><span>${t('product.quantity')}</span></div>
              <div class="qty-control" style="display: inline-flex;">
                <button class="qty-btn" data-qty-action="dec">−</button>
                <span class="qty-value" data-qty-display>${state.quantity}</span>
                <button class="qty-btn" data-qty-action="inc">+</button>
              </div>
            </div>

            <div class="product-actions">
              <button class="btn btn-accent btn-lg btn-block" data-add-to-cart>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                ${t('product.addToCart')}
              </button>
              <a href="#" class="btn btn-whatsapp btn-lg btn-block" data-whatsapp-now>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
                ${t('product.orderWhatsapp')}
              </a>
            </div>

            <div class="product-features-grid">
              ${p.features.map((f) => `
                <div class="product-feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${f[lang] || f.fr}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="product-description-section">
          <h2 style="margin-bottom: var(--space-6);">${lang === 'ar' ? 'وصف المنتج' : 'Description'}</h2>
          <p class="lead">${p.description[lang] || p.description.fr}</p>
        </div>
      </div>
    </section>
  `;

  setupProductInteractions();
}

function renderBundle() {
  const lang = getCurrentLang();
  const b = state.bundle;
  const target = document.querySelector('[data-product-page]');
  if (!target) return;

  target.innerHTML = `
    <section class="section" style="padding-top: var(--space-12);">
      <div class="container">
        <nav style="margin-bottom: var(--space-8); font-size: var(--text-sm); color: var(--color-text-muted);">
          <a href="./" style="color: inherit;">${t('nav.home')}</a>
          <span style="margin: 0 0.5rem;">/</span>
          <a href="./index.html#bundles" style="color: inherit;">${t('nav.bundles')}</a>
          <span style="margin: 0 0.5rem;">/</span>
          <span style="color: var(--color-charcoal);">${b.name[lang] || b.name.fr}</span>
        </nav>

        <div class="product-detail-grid">
          <div class="product-gallery">
            <div class="product-gallery-main" style="background: linear-gradient(135deg, var(--color-terracotta) 0%, var(--color-wine) 100%);">
              <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-family: var(--font-display); font-style: italic; font-size: 8rem;">M.E.</div>
              <span class="product-card-badge" style="top: 1rem; left: 1rem;">${b.featured ? t('bundles.featured') : (lang === 'ar' ? 'حزمة' : 'Pack')}</span>
            </div>
          </div>

          <div class="product-info">
            <span class="eyebrow" data-i18n="nav.bundles">${t('nav.bundles')}</span>
            <h1 style="margin: var(--space-3) 0 var(--space-2);">${b.name[lang] || b.name.fr}</h1>
            <p class="lead" style="margin-bottom: var(--space-6);">${b.desc[lang] || b.desc.fr}</p>

            <div class="product-price-block">
              <div class="product-price">
                <span class="product-price-now">${b.price} ${t('common.currency')}</span>
                <span class="product-price-old">${b.compareAt} ${t('common.currency')}</span>
                <span class="product-save-badge">${t('product.save')} ${b.save} ${t('common.currency')}</span>
              </div>
              <div class="product-cod-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                <span>${t('topbar.cod')}</span>
              </div>
            </div>

            <div class="option-block">
              <div class="option-label"><span>${lang === 'ar' ? 'محتويات الحزمة' : 'Contenu du pack'}</span></div>
              <ul class="bundle-features">
                ${b.features.map((f) => `<li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ${f[lang] || f.fr}
                </li>`).join('')}
              </ul>
            </div>

            <div class="product-actions">
              <button class="btn btn-accent btn-lg btn-block" data-add-bundle>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                ${t('product.addToCart')}
              </button>
              <a href="#" class="btn btn-whatsapp btn-lg btn-block" data-whatsapp-bundle>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
                ${t('product.orderWhatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  document.querySelector('[data-add-bundle]')?.addEventListener('click', () => {
    cart.add({
      productId: 'bundle',
      bundleId: b.id,
      name: b.name,
      price: b.price,
      qty: 1,
      swatch: 'linear-gradient(135deg, var(--color-terracotta), var(--color-wine))'
    });
    showToast(getCurrentLang() === 'ar' ? 'تمت الإضافة للسلة!' : 'Ajouté au panier !');
  });

  document.querySelector('[data-whatsapp-bundle]')?.addEventListener('click', (e) => {
    e.preventDefault();
    cart.clear();
    cart.add({
      productId: 'bundle',
      bundleId: b.id,
      name: b.name,
      price: b.price,
      qty: 1
    });
    setTimeout(() => { window.location.href = './checkout.html'; }, 100);
  });
}

function setupProductInteractions() {
  document.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = state.data.colors.find((c) => c.id === btn.dataset.color);
      if (color) {
        state.selectedColor = color;
        const url = new URL(window.location);
        url.searchParams.set('color', color.id);
        window.history.replaceState({}, '', url);
        renderProduct();
      }
    });
  });

  document.querySelectorAll('[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const size = state.product.sizes.find((s) => s.id === btn.dataset.size);
      if (size) { state.selectedSize = size; renderProduct(); }
    });
  });

  document.querySelectorAll('[data-pack]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedPack = btn.dataset.pack;
      renderProduct();
    });
  });

  document.querySelectorAll('[data-qty-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.qtyAction === 'inc') state.quantity++;
      else if (state.quantity > 1) state.quantity--;
      document.querySelector('[data-qty-display]').textContent = state.quantity;
    });
  });

  document.querySelector('[data-add-to-cart]')?.addEventListener('click', () => {
    addProductToCart();
    showToast(getCurrentLang() === 'ar' ? 'تمت الإضافة للسلة!' : 'Ajouté au panier !');
  });

  document.querySelector('[data-whatsapp-now]')?.addEventListener('click', (e) => {
    e.preventDefault();
    cart.clear();
    addProductToCart();
    setTimeout(() => { window.location.href = './checkout.html'; }, 100);
  });
}

function addProductToCart() {
  const lang = getCurrentLang();
  const p = state.product;
  const c = state.selectedColor;
  const s = state.selectedSize;
  const pricing = p.pricing[state.selectedPack];

  cart.add({
    productId: p.id,
    name: { fr: `${p.name.fr} — ${pricing.label.fr}`, ar: `${p.name.ar} — ${pricing.label.ar}` },
    price: pricing.price,
    qty: state.quantity,
    color: c.name[lang] || c.name.fr,
    size: s ? (s.name[lang] || s.name.fr) : null,
    pack: state.selectedPack,
    swatch: c.gradient
  });
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (toast) toast.remove();
  toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

document.addEventListener('DOMContentLoaded', init);
