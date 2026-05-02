/* ============================================================
   MAISON ELORIA — Conversion Engine
   - Free-shipping progress bar (in cart drawer)
   - Live social proof toaster
   - Exit-intent newsletter popup
   - Stock urgency badges
   ============================================================ */

import { getCurrentLang } from './i18n.js';
import { cart } from './cart.js';
import { postNewsletter } from './api.js';

/* ---------- Config ---------- */

const FREE_SHIP_THRESHOLD = 500;

const PROOF_NAMES = [
  { name: 'Fatima', city: { fr: 'Casablanca', ar: 'الدار البيضاء' } },
  { name: 'Salma',  city: { fr: 'Rabat',      ar: 'الرباط' } },
  { name: 'Khadija',city: { fr: 'Marrakech',  ar: 'مراكش' } },
  { name: 'Imane',  city: { fr: 'Tanger',     ar: 'طنجة' } },
  { name: 'Asmaa',  city: { fr: 'Fès',        ar: 'فاس' } },
  { name: 'Nadia',  city: { fr: 'Agadir',     ar: 'أكادير' } },
  { name: 'Hanae',  city: { fr: 'Meknès',     ar: 'مكناس' } },
  { name: 'Souad',  city: { fr: 'Oujda',      ar: 'وجدة' } },
  { name: 'Laila',  city: { fr: 'Tétouan',    ar: 'تطوان' } },
  { name: 'Najwa',  city: { fr: 'El Jadida',  ar: 'الجديدة' } },
  { name: 'Mounia', city: { fr: 'Kenitra',    ar: 'القنيطرة' } },
  { name: 'Yasmine',city: { fr: 'Salé',       ar: 'سلا' } }
];

const PROOF_PRODUCTS = {
  fr: [
    'la Housse Cèdre de l\'Atlas',
    'le Pack Famille (4 housses)',
    'le Chemin de table Argile de Salé',
    'les Housses de coussin Safran',
    'le Pack Diplomatique (8 housses)',
    'la Housse Bleu Majorelle',
    'le Pack Salon (6 housses)',
    'le Chemin Olive de Volubilis',
    'la Housse Vin de Meknès',
    'le Pack Découverte'
  ],
  ar: [
    'غطاء أرز الأطلس',
    'حزمة العائلة (4 أغطية)',
    'مفرش طين سلا',
    'أغطية الوسائد الزعفران',
    'الحزمة الدبلوماسية (8 أغطية)',
    'الغطاء الأزرق الماجوريل',
    'حزمة الصالون (6 أغطية)',
    'مفرش زيتون وليلي',
    'الغطاء العنابي مكناس',
    'حزمة الاكتشاف'
  ]
};

const DISMISS_KEY_EXIT = 'maisoneloria_exit_dismissed';
const DISMISS_KEY_PROOF = 'maisoneloria_proof_paused';

/* ---------- Free-shipping progress bar (in cart drawer) ---------- */

export function renderShippingProgress() {
  const subtotal = cart.getSubtotal();
  if (subtotal === 0) return '';

  const lang = getCurrentLang();
  const isFree = subtotal >= FREE_SHIP_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  const msg = isFree
    ? (lang === 'ar' ? '🎉 مبروك! استفدتِ من التوصيل المجاني.' : '🎉 Bravo ! Vous bénéficiez de la livraison gratuite.')
    : (lang === 'ar'
        ? `أضيفي <strong>${remaining} درهم</strong> فقط للحصول على التوصيل المجاني!`
        : `Plus que <strong>${remaining} DH</strong> pour la livraison gratuite !`);

  return `
    <div class="ship-progress ${isFree ? 'is-free' : ''}">
      <div class="ship-progress-text">${msg}</div>
      <div class="ship-progress-bar"><div class="ship-progress-fill" style="width: ${pct}%"></div></div>
    </div>
  `;
}

/* ---------- Live social proof toaster ---------- */

let proofTimer = null;
let proofIndex = 0;

export function startSocialProof(delayMs = 14000, intervalMs = 22000) {
  if (sessionStorage.getItem(DISMISS_KEY_PROOF) === '1') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let host = document.querySelector('[data-social-proof]');
  if (!host) {
    host = document.createElement('div');
    host.className = 'social-proof';
    host.setAttribute('data-social-proof', '');
    host.setAttribute('aria-live', 'polite');
    host.setAttribute('aria-atomic', 'true');
    document.body.appendChild(host);
  }

  setTimeout(showNext, delayMs);
  function showNext() {
    renderProofToast(host);
    proofTimer = setTimeout(() => {
      hideProof(host);
      proofTimer = setTimeout(showNext, 6000);
    }, intervalMs - 6000);
  }
}

function renderProofToast(host) {
  const lang = getCurrentLang();
  const person = PROOF_NAMES[proofIndex % PROOF_NAMES.length];
  const products = PROOF_PRODUCTS[lang] || PROOF_PRODUCTS.fr;
  const product = products[Math.floor(Math.random() * products.length)];
  const minutesAgo = 3 + Math.floor(Math.random() * 28);
  proofIndex++;

  const cityLabel = person.city[lang] || person.city.fr;
  const text = lang === 'ar'
    ? `<strong>${person.name}</strong> من ${cityLabel} اشترت <strong>${product}</strong>`
    : `<strong>${person.name}</strong> de ${cityLabel} vient d'acheter <strong>${product}</strong>`;
  const time = lang === 'ar' ? `منذ ${minutesAgo} دقيقة` : `il y a ${minutesAgo} min`;

  host.innerHTML = `
    <div class="social-proof-card">
      <div class="social-proof-avatar">${person.name.charAt(0)}</div>
      <div class="social-proof-body">
        <div class="social-proof-text">${text}</div>
        <div class="social-proof-meta">
          <span class="dot"></span> ${time}
        </div>
      </div>
      <button class="social-proof-close" aria-label="Fermer">×</button>
    </div>
  `;

  host.classList.add('show');

  host.querySelector('.social-proof-close')?.addEventListener('click', () => {
    sessionStorage.setItem(DISMISS_KEY_PROOF, '1');
    hideProof(host);
    if (proofTimer) clearTimeout(proofTimer);
  });
}

function hideProof(host) {
  host.classList.remove('show');
}

/* ---------- Exit-intent newsletter popup ---------- */

export function startExitIntent(delayBeforeArmingMs = 8000) {
  if (localStorage.getItem(DISMISS_KEY_EXIT) === '1') return;

  let armed = false;
  setTimeout(() => { armed = true; }, delayBeforeArmingMs);

  let triggered = false;
  function trigger() {
    if (triggered || !armed) return;
    triggered = true;
    showExitPopup();
  }

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && e.clientY < 30) trigger();
  });

  let lastScrollUp = 0;
  document.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollUp - 100 && window.scrollY < 200) trigger();
    lastScrollUp = window.scrollY;
  }, { passive: true });

  if (window.innerWidth < 700) {
    let triedBack = 0;
    setTimeout(() => {
      history.pushState({ exitGuard: true }, '');
      window.addEventListener('popstate', () => {
        triedBack++;
        if (triedBack === 1 && armed) {
          history.pushState({ exitGuard: true }, '');
          trigger();
        }
      });
    }, delayBeforeArmingMs);
  }
}

function showExitPopup() {
  const lang = getCurrentLang();
  const t = lang === 'ar'
    ? {
        eyebrow: 'انتظري دقيقة...',
        title: 'هدية لكِ قبل أن تذهبي',
        subtitle: 'استلمي كود <strong>-10%</strong> على طلبكِ الأول. صالح 24 ساعة فقط.',
        placeholder: 'بريدكِ الإلكتروني',
        button: 'احصلي على كود الخصم',
        small: 'لا spam، عبر البريد فقط. يمكنكِ الإلغاء في أي وقت.',
        success: '✓ تحقّقي من بريدكِ! الكود ينتظركِ.',
        no: 'لا، شكرًا'
      }
    : {
        eyebrow: 'Attendez une seconde...',
        title: 'Un cadeau avant de partir',
        subtitle: 'Recevez un code <strong>-10%</strong> sur votre première commande. Valable 24h seulement.',
        placeholder: 'Votre email',
        button: 'Recevoir mon code',
        small: 'Pas de spam, uniquement par email. Désinscription à tout moment.',
        success: '✓ Vérifiez votre boîte mail ! Votre code vous attend.',
        no: 'Non, merci'
      };

  const overlay = document.createElement('div');
  overlay.className = 'exit-popup-overlay';
  overlay.innerHTML = `
    <div class="exit-popup" role="dialog" aria-labelledby="exit-popup-title">
      <button class="exit-popup-close" aria-label="Fermer">×</button>
      <div class="exit-popup-decor" aria-hidden="true">
        <span class="exit-popup-mark">N</span>
      </div>
      <span class="eyebrow exit-popup-eyebrow">${t.eyebrow}</span>
      <h2 id="exit-popup-title" class="exit-popup-title">${t.title}</h2>
      <p class="exit-popup-subtitle">${t.subtitle}</p>
      <form class="exit-popup-form" novalidate>
        <input type="email" class="exit-popup-input" required placeholder="${t.placeholder}" autocomplete="email" />
        <button type="submit" class="btn btn-accent btn-lg">${t.button}</button>
      </form>
      <p class="exit-popup-small">${t.small}</p>
      <button type="button" class="exit-popup-decline">${t.no}</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const close = (mark = false) => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
    if (mark) localStorage.setItem(DISMISS_KEY_EXIT, '1');
  };

  overlay.querySelector('.exit-popup-close').addEventListener('click', () => close(true));
  overlay.querySelector('.exit-popup-decline').addEventListener('click', () => close(true));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(true); });

  const form = overlay.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const email = input.value.trim();
    if (!email) return;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    const orig = submit.textContent;
    submit.textContent = '...';
    const res = await postNewsletter({ email, language: lang, source: 'exit-popup' });
    submit.disabled = false;
    submit.textContent = orig;
    if (res.ok || res.status === 0) {
      localStorage.setItem(DISMISS_KEY_EXIT, '1');
      const card = overlay.querySelector('.exit-popup');
      card.innerHTML = `
        <div class="exit-popup-success">
          <div class="exit-popup-success-mark">✓</div>
          <h2 class="exit-popup-title">${t.success}</h2>
          <button class="btn btn-primary btn-lg" data-close>OK</button>
        </div>
      `;
      card.querySelector('[data-close]').addEventListener('click', () => close(true));
    }
  });
}

/* ---------- Stock urgency ---------- */

export function getStockState(productId, baseSeed = 0) {
  const cacheKey = `eloria_stock_${productId}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  const seed = (baseSeed + productId.length * 7) % 100;
  const stock = 3 + (seed % 9);
  const watchers = 5 + (seed % 23);
  const ordersToday = 2 + (seed % 14);
  const state = { stock, watchers, ordersToday };
  sessionStorage.setItem(cacheKey, JSON.stringify(state));
  return state;
}

export function renderStockBadge(productId, baseSeed = 0) {
  const lang = getCurrentLang();
  const s = getStockState(productId, baseSeed);
  const isLow = s.stock <= 5;
  const stockLabel = isLow
    ? (lang === 'ar' ? `بقي ${s.stock} فقط في المخزون!` : `Plus que ${s.stock} en stock !`)
    : (lang === 'ar' ? `${s.stock} متوفّر` : `${s.stock} en stock`);
  const watchersLabel = lang === 'ar'
    ? `${s.watchers} شخص ينظرون لهذا المنتج الآن`
    : `${s.watchers} personnes regardent en ce moment`;

  return `
    <div class="stock-urgency">
      <div class="stock-row">
        <span class="stock-dot ${isLow ? 'is-low' : ''}"></span>
        <span class="stock-label ${isLow ? 'is-low' : ''}">${stockLabel}</span>
      </div>
      <div class="stock-watchers">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ${watchersLabel}
      </div>
    </div>
  `;
}

/* ---------- Public init ---------- */

export function initConversion() {
  startSocialProof();
  startExitIntent();
}
