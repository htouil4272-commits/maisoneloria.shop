/* ============================================================
   MAISON ELORIA — Funnel Landing Page Engine
   Single-product, direct checkout, AR-first.
   Reuses /api/orders endpoint via api.js
   ============================================================ */

import { MOROCCAN_CITIES } from './cities.js';
import { postOrder } from '../../assets/js/api.js';

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function getLang() {
  const html = document.documentElement;
  return (html.getAttribute('lang') || 'ar').toLowerCase().startsWith('ar') ? 'ar' : 'fr';
}

/* ---------- Cities dropdown ---------- */
function fillCities(select) {
  if (!select) return;
  const lang = getLang();
  const sortedCities = [...MOROCCAN_CITIES].sort((a, b) => {
    if (a.id === 'autre') return 1;
    if (b.id === 'autre') return -1;
    return (a.name[lang] || a.name.fr).localeCompare(b.name[lang] || b.name.fr, lang);
  });
  const placeholder = lang === 'ar' ? '— اختاري المدينة —' : '— Choisissez votre ville —';
  select.innerHTML = `<option value="" disabled selected>${placeholder}</option>` +
    sortedCities.map((c) => `<option value="${c.id}" data-shipping="${c.shipping}" data-eta="${c.eta}">${c.name[lang] || c.name.fr}</option>`).join('');
}

/* ---------- Quantity / pack selector ---------- */
function initPackSelector(form) {
  const radios = $$('[data-pack-option]', form);
  const totalEl = $('[data-funnel-total]', form);
  const shipEl = $('[data-funnel-ship]', form);
  const subtotalEl = $('[data-funnel-subtotal]', form);
  const compareEl = $('[data-funnel-compare]', form);
  const saveEl = $('[data-funnel-save]', form);
  const citySelect = $('[name="city"]', form);

  const recompute = () => {
    const checked = radios.find((r) => r.checked);
    if (!checked) return;
    const price = parseInt(checked.dataset.price, 10) || 0;
    const compare = parseInt(checked.dataset.compare, 10) || 0;
    const opt = citySelect?.selectedOptions?.[0];
    const ship = opt?.dataset?.shipping ? parseInt(opt.dataset.shipping, 10) : 0;
    const freeShip = price >= 500;
    const finalShip = freeShip ? 0 : ship;
    const total = price + finalShip;
    const save = compare > price ? (compare - price) : 0;

    if (subtotalEl) subtotalEl.textContent = price + ' DH';
    if (compareEl) compareEl.textContent = compare ? compare + ' DH' : '';
    if (compareEl) compareEl.style.display = compare ? '' : 'none';
    if (shipEl) shipEl.textContent = freeShip
      ? (getLang() === 'ar' ? 'مجاني' : 'GRATUITE')
      : (ship ? ship + ' DH' : (getLang() === 'ar' ? 'يُحدَّد بعد اختيار المدينة' : 'selon ville'));
    if (totalEl) totalEl.textContent = total + ' DH';
    if (saveEl) saveEl.textContent = save ? (getLang() === 'ar' ? `وفّري ${save} DH` : `Économisez ${save} DH`) : '';
    if (saveEl) saveEl.style.display = save ? '' : 'none';
  };

  radios.forEach((r) => r.addEventListener('change', recompute));
  citySelect?.addEventListener('change', recompute);
  recompute();
}

/* ---------- Color selector (optional, on single product LPs) ---------- */
function initColorSelector(form) {
  const swatches = $$('[data-color-swatch]', form);
  const hidden = $('[name="color"]', form);
  const label = $('[data-color-label]', form);
  if (!swatches.length || !hidden) return;

  swatches.forEach((sw) => {
    sw.addEventListener('click', (e) => {
      e.preventDefault();
      swatches.forEach((s) => s.classList.remove('is-active'));
      sw.classList.add('is-active');
      hidden.value = sw.dataset.colorSwatch;
      if (label) label.textContent = sw.dataset.colorLabel || sw.dataset.colorSwatch;
    });
  });
}

/* ---------- Phone validation (Morocco) ---------- */
function isValidMoroccanPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10 && /^0[567]/.test(digits)) return true;
  if (digits.length === 12 && /^212[567]/.test(digits)) return true;
  if (digits.length === 9 && /^[567]/.test(digits)) return true;
  return false;
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10 && /^0/.test(digits)) return '+212' + digits.slice(1);
  if (digits.length === 9 && /^[567]/.test(digits)) return '+212' + digits;
  if (digits.length === 12 && /^212/.test(digits)) return '+' + digits;
  return digits;
}

/* ---------- Form submit ---------- */
function initFormSubmit(form, productMeta) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getLang();
    clearErrors(form);

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const cityId = String(fd.get('city') || '').trim();
    const address = String(fd.get('address') || '').trim();
    const note = String(fd.get('note') || '').trim();
    const colorId = String(fd.get('color') || productMeta.defaultColor || '').trim();
    const packId = String(fd.get('pack') || productMeta.defaultPack || '').trim();

    let hasError = false;
    if (name.length < 2) { setError(form, 'name', lang === 'ar' ? 'المرجو إدخال اسمك الكامل' : 'Veuillez entrer votre nom complet'); hasError = true; }
    if (!isValidMoroccanPhone(phone)) { setError(form, 'phone', lang === 'ar' ? 'رقم هاتف غير صحيح (مثال: 0612345678)' : 'Numéro invalide (ex: 0612345678)'); hasError = true; }
    if (!cityId) { setError(form, 'city', lang === 'ar' ? 'المرجو اختيار المدينة' : 'Veuillez choisir votre ville'); hasError = true; }
    if (hasError) {
      const firstErr = $('.lp-field.has-error input, .lp-field.has-error select', form);
      firstErr?.focus();
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const city = MOROCCAN_CITIES.find((c) => c.id === cityId) || { name: { fr: cityId, ar: cityId }, shipping: 50 };
    const pack = productMeta.packs.find((p) => p.id === packId) || productMeta.packs[0];
    const color = (productMeta.colors || []).find((c) => c.id === colorId) || null;

    const subtotal = pack.price;
    const shipping = subtotal >= 500 ? 0 : city.shipping;
    const total = subtotal + shipping;

    const submitBtn = $('[data-funnel-submit]', form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.innerHTML = lang === 'ar' ? '⏳ جاري إرسال طلبك...' : '⏳ Envoi en cours...';
    }

    const productNameStr = (productMeta.name[lang] || productMeta.name.fr) + (pack.label ? ' — ' + (pack.label[lang] || pack.label.fr) : '');
    const colorStr = color ? (color.name[lang] || color.name.fr) : null;

    const items = [{
      productId: productMeta.id,
      productName: productNameStr,
      variant: {
        color: colorStr,
        pack: pack.id || null
      },
      unitPrice: pack.price,
      quantity: 1,
      lineTotal: pack.price
    }];

    const fallbackAddress = address || (lang === 'ar'
      ? 'سيتم تأكيد العنوان عبر الهاتف'
      : 'Adresse à confirmer par téléphone');

    const sourceTag = 'funnel:' + (productMeta.id || 'unknown');
    const noteWithSource = [note, '[source: ' + sourceTag + ']'].filter(Boolean).join(' · ');

    const payload = {
      customer: {
        name,
        phone: normalizePhone(phone),
        city: city.name[lang] || city.name.fr,
        address: fallbackAddress,
        notes: noteWithSource
      },
      items,
      subtotal,
      shipping,
      total,
      language: lang
    };

    let orderNumber = null;
    try {
      const res = await postOrder(payload);
      orderNumber = res.data?.order?.orderNumber || res.data?.orderNumber || null;
    } catch (err) {
      console.warn('Order submission failed, continuing with local fallback', err);
    }

    if (!orderNumber) {
      orderNumber = 'ME-' + Date.now().toString(36).toUpperCase().slice(-6);
    }

    sessionStorage.setItem('eloria_lp_lastOrder', JSON.stringify({
      orderNumber, name, phone: payload.customer.phone, city: payload.customer.city,
      productName: productMeta.name[lang] || productMeta.name.fr,
      packLabel: pack.label[lang] || pack.label.fr,
      color: color ? (color.name[lang] || color.name.fr) : null,
      total, subtotal, shipping, lang,
      productId: productMeta.id
    }));

    window.location.href = './confirmation.html';
  });
}

function clearErrors(form) {
  $$('.lp-field', form).forEach((f) => f.classList.remove('has-error'));
  $$('.lp-error', form).forEach((e) => e.remove());
}

function setError(form, name, message) {
  const field = $(`[name="${name}"]`, form)?.closest('.lp-field');
  if (!field) return;
  field.classList.add('has-error');
  const err = document.createElement('div');
  err.className = 'lp-error';
  err.textContent = message;
  field.appendChild(err);
}

/* ---------- Sticky bottom CTA on mobile ---------- */
function initStickyCta() {
  const stickyBar = $('[data-sticky-cta]');
  const orderForm = $('[data-funnel-form]');
  if (!stickyBar || !orderForm) return;

  const observer = new IntersectionObserver(([entry]) => {
    stickyBar.classList.toggle('is-visible', !entry.isIntersecting);
  }, { threshold: 0.1 });
  observer.observe(orderForm);

  stickyBar.addEventListener('click', () => {
    orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('[name="name"]', orderForm)?.focus(), 600);
  });
}

/* ---------- Live counter (orders today / stock left) ---------- */
function initUrgencyCounters() {
  $$('[data-urgency-stock]').forEach((el) => {
    const seed = el.dataset.urgencyStock || '7';
    const base = parseInt(seed, 10) || 7;
    const stock = base + (Date.now() % 4);
    el.textContent = stock;
  });
  $$('[data-urgency-watching]').forEach((el) => {
    const min = parseInt(el.dataset.urgencyWatching || '8', 10);
    const watching = min + Math.floor(Math.random() * 12);
    el.textContent = watching;
    setInterval(() => {
      const next = min + Math.floor(Math.random() * 12);
      el.textContent = next;
    }, 9000);
  });
  $$('[data-urgency-today]').forEach((el) => {
    const base = parseInt(el.dataset.urgencyToday || '17', 10);
    el.textContent = base + Math.floor(Math.random() * 8);
  });
}

/* ---------- Countdown (24h offer) ---------- */
function initCountdown() {
  const cd = $('[data-countdown]');
  if (!cd) return;
  const KEY = 'eloria_lp_offer_started';
  let started = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (!started || Date.now() - started > 24 * 3600 * 1000) {
    started = Date.now();
    localStorage.setItem(KEY, String(started));
  }
  const endsAt = started + 24 * 3600 * 1000;

  const tick = () => {
    const remaining = Math.max(0, endsAt - Date.now());
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    cd.innerHTML = `<span>${String(h).padStart(2, '0')}</span>:<span>${String(m).padStart(2, '0')}</span>:<span>${String(s).padStart(2, '0')}</span>`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Smooth scroll for anchor links ---------- */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- WhatsApp links ---------- */
function setupWhatsApp() {
  fetch('../assets/data/products.json').then((r) => r.json()).then((data) => {
    const phone = data.brand?.whatsapp || '212600000000';
    $$('[data-whatsapp]').forEach((el) => {
      const msg = el.getAttribute('data-whatsapp-message');
      const text = msg ? '?text=' + encodeURIComponent(msg) : '';
      el.setAttribute('href', `https://wa.me/${phone}${text}`);
    });
  }).catch(() => {});
}

/* ---------- Public init ---------- */
export function initLP(productMeta) {
  const form = $('[data-funnel-form]');
  if (form) {
    fillCities($('[name="city"]', form));
    initColorSelector(form);
    initPackSelector(form);
    initFormSubmit(form, productMeta);
  }
  initStickyCta();
  initUrgencyCounters();
  initCountdown();
  initSmoothScroll();
  setupWhatsApp();
}
