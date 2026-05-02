/* ============================================================
   MAISON ELORIA — Shop Page
   ============================================================ */

import { initI18n, getCurrentLang, t } from './i18n.js';
import { cart } from './cart.js';
import { loadData } from './main.js';
import { initCartDrawer, setupWhatsAppLinks } from './cart-drawer.js';
import { initConversion } from './conversion.js';
import { initScrollReveal } from './reveal.js';

const state = {
  category: 'all',
  color: 'all',
  search: '',
  data: null
};

function productSilhouette(category, colorId) {
  const fill = 'rgba(255,255,255,0.95)';
  const accent = 'rgba(0,0,0,0.12)';
  const weave = `<defs><pattern id="pw-${colorId}-${category}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0 L6 6 M6 0 L0 6" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/></pattern></defs>`;
  if (category === 'covers') {
    return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" class="product-card-svg" aria-hidden="true">
      ${weave}
      <ellipse cx="100" cy="186" rx="60" ry="5" fill="rgba(0,0,0,0.18)"/>
      <path d="M62 70 L62 56 Q62 46 72 46 L128 46 Q138 46 138 56 L138 70 Z" fill="${fill}"/>
      <rect x="62" y="68" width="76" height="78" rx="6" fill="${fill}"/>
      <rect x="62" y="68" width="76" height="78" rx="6" fill="url(#pw-${colorId}-${category})"/>
      <text x="100" y="118" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="32" font-weight="500">N</text>
      <rect x="68" y="146" width="6" height="32" fill="rgba(58,40,30,0.55)"/>
      <rect x="126" y="146" width="6" height="32" fill="rgba(58,40,30,0.55)"/>
    </svg>`;
  }
  if (category === 'table') {
    return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" class="product-card-svg" aria-hidden="true">
      ${weave}
      <ellipse cx="100" cy="180" rx="68" ry="4" fill="rgba(0,0,0,0.18)"/>
      <rect x="38" y="100" width="124" height="6" fill="rgba(232,220,198,0.95)"/>
      <rect x="44" y="106" width="6" height="74" fill="rgba(232,220,198,0.85)"/>
      <rect x="150" y="106" width="6" height="74" fill="rgba(232,220,198,0.85)"/>
      <path d="M68 100 L68 160 L132 160 L132 100 Z" fill="${fill}"/>
      <path d="M68 100 L68 160 L132 160 L132 100 Z" fill="url(#pw-${colorId}-${category})"/>
      <rect x="74" y="108" width="52" height="2" fill="rgba(184,153,104,0.6)"/>
      <rect x="74" y="150" width="52" height="2" fill="rgba(184,153,104,0.6)"/>
      <text x="100" y="138" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="22" font-weight="500">N</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" class="product-card-svg" aria-hidden="true">
    ${weave}
    <ellipse cx="100" cy="186" rx="60" ry="4" fill="rgba(0,0,0,0.18)"/>
    <g transform="translate(60, 70) rotate(-6)">
      <rect x="0" y="0" width="80" height="80" rx="10" fill="${fill}"/>
      <rect x="0" y="0" width="80" height="80" rx="10" fill="url(#pw-${colorId}-${category})"/>
      <path d="M5 5 Q40 0 75 5 L75 75 Q40 80 5 75 Z" stroke="${accent}" stroke-width="1" fill="none"/>
      <text x="40" y="55" text-anchor="middle" fill="${accent}" font-family="Georgia, serif" font-style="italic" font-size="28">N</text>
    </g>
  </svg>`;
}

function urgencyBadge(productId, idx) {
  const h = (productId.length * 7 + idx * 3) % 100;
  const stock = 3 + (h % 9);
  if (stock <= 4) {
    const lang = getCurrentLang();
    return `<span class="product-card-urgency">${lang === 'ar' ? `بقي ${stock} فقط` : `Plus que ${stock} !`}</span>`;
  }
  return '';
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function applyFiltersFromUrl() {
  const c = getQueryParam('category');
  const col = getQueryParam('color');
  if (c) state.category = c;
  if (col) state.color = col;
}

function renderFilters() {
  if (!state.data) return;
  const lang = getCurrentLang();

  const catContainer = document.querySelector('[data-filter-categories]');
  const colorContainer = document.querySelector('[data-filter-colors]');

  const categories = [
    { id: 'all', label: { fr: 'Tous', ar: 'الكل' } },
    { id: 'covers', label: { fr: 'Housses de chaise', ar: 'أغطية الكراسي' } },
    { id: 'table', label: { fr: 'Chemins de table', ar: 'مفارش الطاولة' } },
    { id: 'cushions', label: { fr: 'Housses de coussin', ar: 'أغطية الوسائد' } }
  ];

  if (catContainer) {
    catContainer.innerHTML = categories.map((c) => `
      <button class="filter-chip${state.category === c.id ? ' active' : ''}" data-category="${c.id}">
        ${c.label[lang] || c.label.fr}
      </button>
    `).join('');

    catContainer.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.category;
        renderFilters();
        renderProducts();
      });
    });
  }

  if (colorContainer) {
    colorContainer.innerHTML = `
      <button class="swatch-with-label${state.color === 'all' ? ' active' : ''}" data-color="all">
        <span class="swatch swatch-lg" style="background: linear-gradient(135deg, var(--color-cream), var(--color-charcoal));"></span>
        <span>${lang === 'ar' ? 'الكل' : 'Toutes'}</span>
      </button>
    ` + state.data.colors.map((c) => `
      <button class="swatch-with-label${state.color === c.id ? ' active' : ''}" data-color="${c.id}" title="${c.name[lang] || c.name.fr}">
        <span class="swatch swatch-lg" style="background: ${c.gradient};"></span>
        <span>${c.name[lang] || c.name.fr}</span>
      </button>
    `).join('');

    colorContainer.querySelectorAll('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.color = btn.dataset.color;
        renderFilters();
        renderProducts();
      });
    });
  }
}

function renderProducts() {
  if (!state.data) return;
  const lang = getCurrentLang();
  const target = document.querySelector('[data-products-grid]');
  const countEl = document.querySelector('[data-products-count]');
  if (!target) return;

  let filteredColors = state.data.colors;
  if (state.color !== 'all') {
    filteredColors = state.data.colors.filter((c) => c.id === state.color);
  }

  const search = state.search.trim().toLowerCase();
  const products = state.data.products.filter((p) => {
    if (state.category !== 'all' && p.category !== state.category) return false;
    if (search) {
      const haystack = [
        p.name?.fr, p.name?.ar,
        p.shortDesc?.fr, p.shortDesc?.ar,
        p.category
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const cards = [];

  products.forEach((product) => {
    filteredColors.forEach((color) => {
      const minPrice = product.pricing.single ? product.pricing.single.price : Object.values(product.pricing)[0].price;
      const compareAt = product.pricing.single ? product.pricing.single.compareAt : null;
      cards.push({ product, color, price: minPrice, compareAt });
    });
  });

  if (countEl) {
    const txt = lang === 'ar' ? `${cards.length} منتج` : `${cards.length} produits`;
    countEl.textContent = txt;
  }

  if (cards.length === 0) {
    target.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--color-text-muted);">
        <p>${lang === 'ar' ? 'لا توجد منتجات تطابق الفلتر' : 'Aucun produit ne correspond à ce filtre'}</p>
      </div>
    `;
    return;
  }

  target.innerHTML = cards.map(({ product, color, price, compareAt }, idx) => `
    <a href="./product.html?id=${product.id}&color=${color.id}" class="product-card">
      <div class="product-card-image">
        <div class="product-card-color" style="background: ${color.gradient};">
          ${productSilhouette(product.category, color.id)}
          <span class="product-card-color-name">${color.name[lang] || color.name.fr}</span>
        </div>
        ${product.badge ? `<span class="product-card-badge">${product.badge[lang] || product.badge.fr}</span>` : ''}
        ${urgencyBadge(product.id, idx)}
      </div>
      <div class="product-card-info">
        <div class="product-card-name">${product.name[lang] || product.name.fr}</div>
        <div class="product-card-meta">${color.inspiration[lang] || color.inspiration.fr}</div>
        <div class="product-card-price">
          ${price} ${t('common.currency')}
          ${compareAt ? `<span class="product-card-price-old">${compareAt} ${t('common.currency')}</span>` : ''}
        </div>
      </div>
    </a>
  `).join('');
}

function initSearch() {
  const input = document.querySelector('[data-shop-search]');
  if (!input) return;
  let timer = null;
  input.addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = e.target.value;
      renderProducts();
    }, 220);
  });
}

async function init() {
  initI18n();
  initCartDrawer();
  initConversion();
  initScrollReveal();
  state.data = await loadData();
  setupWhatsAppLinks(state.data);
  applyFiltersFromUrl();
  renderFilters();
  renderProducts();
  initSearch();

  window.addEventListener('lang:changed', () => {
    renderFilters();
    renderProducts();
  });
}

document.addEventListener('DOMContentLoaded', init);
