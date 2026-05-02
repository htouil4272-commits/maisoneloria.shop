/* ============================================================
   MAISON ELORIA — Checkout (WhatsApp Order)
   ============================================================ */

import { initI18n, getCurrentLang, t } from './i18n.js';
import { cart } from './cart.js';
import { loadData } from './main.js';
import { postOrder } from './api.js';

let brandData = null;

const moroccanCities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir',
  'Salé', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi',
  'Mohammedia', 'El Jadida', 'Béni Mellal', 'Nador', 'Laâyoune',
  'Khouribga', 'Settat', 'Berrechid', 'Khémisset', 'Guelmim',
  'Berkane', 'Taza', 'Errachidia', 'Ouarzazate', 'Larache',
  'Ksar El Kébir', 'Khénifra', 'Fkih Ben Salah', 'Sidi Slimane',
  'Sidi Kacem', 'Tiznit', 'Taroudant', 'Essaouira', 'Tan-Tan',
  'Dakhla', 'Autre'
];

async function init() {
  initI18n();
  brandData = await loadData();
  renderSummary();
  renderCityOptions();
  setupForm();
  cart.subscribe(() => renderSummary());
  window.addEventListener('lang:changed', () => {
    renderSummary();
    renderCityOptions();
  });
}

function renderCityOptions() {
  const select = document.querySelector('#city');
  if (!select) return;
  const lang = getCurrentLang();
  const placeholder = lang === 'ar' ? '— اختاري مدينتكِ —' : '— Sélectionnez votre ville —';
  select.innerHTML = `<option value="">${placeholder}</option>` +
    moroccanCities.map((c) => `<option value="${c}">${c}</option>`).join('');
}

function renderSummary() {
  const lang = getCurrentLang();
  const target = document.querySelector('[data-checkout-summary]');
  const empty = document.querySelector('[data-checkout-empty]');
  const form = document.querySelector('[data-checkout-form]');
  if (!target) return;

  const s = cart.getState();

  if (s.items.length === 0) {
    target.innerHTML = '';
    empty?.classList.remove('hidden');
    form?.classList.add('hidden');
    return;
  }

  empty?.classList.add('hidden');
  form?.classList.remove('hidden');

  target.innerHTML = `
    <h3 style="margin-bottom: var(--space-5);">${lang === 'ar' ? 'ملخص الطلب' : 'Résumé de la commande'}</h3>
    <div class="checkout-items">
      ${s.items.map((item) => {
        const name = typeof item.name === 'object' ? (item.name[lang] || item.name.fr) : item.name;
        const meta = [];
        if (item.size) meta.push(item.size);
        if (item.color) meta.push(item.color);
        return `
          <div class="checkout-item">
            <div class="checkout-item-image" style="background: ${item.swatch || 'var(--color-cream-dark)'};"></div>
            <div class="checkout-item-info">
              <div class="checkout-item-name">${name}</div>
              ${meta.length ? `<div class="checkout-item-meta">${meta.join(' · ')}</div>` : ''}
              <div class="checkout-item-meta">${lang === 'ar' ? 'الكمية' : 'Qté'}: ${item.qty}</div>
            </div>
            <div class="checkout-item-price">${item.price * item.qty} ${t('common.currency')}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="checkout-totals">
      <div class="cart-summary-row"><span>${t('cart.subtotal')}</span><span>${s.subtotal} ${t('common.currency')}</span></div>
      <div class="cart-summary-row"><span>${t('cart.shipping')}</span><span>${s.shipping === 0 ? t('cart.free') : s.shipping + ' ' + t('common.currency')}</span></div>
      <div class="cart-summary-row total"><span>${t('cart.total')}</span><span>${s.total} ${t('common.currency')}</span></div>
    </div>
    <div class="checkout-cod-note">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
      <div>
        <strong>${t('topbar.cod')}</strong>
        <div>${lang === 'ar' ? 'لا تدفعين أي شيء الآن — تدفعين فقط عند الاستلام.' : 'Vous ne payez rien maintenant — uniquement à la réception.'}</div>
      </div>
    </div>
  `;
}

function setupForm() {
  const form = document.querySelector('[data-checkout-form]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const lang = getCurrentLang();

    const fd = new FormData(form);
    const customer = {
      name: fd.get('name')?.trim(),
      phone: fd.get('phone')?.trim(),
      email: fd.get('email')?.trim() || '',
      city: fd.get('city')?.trim(),
      address: fd.get('address')?.trim(),
      note: fd.get('note')?.trim() || ''
    };

    if (!customer.name || !customer.phone || !customer.city || !customer.address) {
      alert(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs requis');
      return;
    }

    const phoneClean = customer.phone.replace(/\D/g, '');
    if (phoneClean.length < 9) {
      alert(lang === 'ar' ? 'رقم الهاتف غير صحيح' : 'Numéro de téléphone invalide');
      return;
    }

    const originalLabel = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...';
    }

    const apiPayload = buildApiPayload(customer);
    let orderNumber = null;
    try {
      const res = await postOrder(apiPayload);
      if (res.ok && res.data?.order?.orderNumber) {
        orderNumber = res.data.order.orderNumber;
      } else if (res.status === 0) {
        console.warn('[checkout] backend unreachable — falling back to WhatsApp only');
      } else {
        console.warn('[checkout] backend error', res);
      }
    } catch (err) {
      console.warn('[checkout] backend exception', err);
    }

    saveOrderHistory({ ...customer, orderNumber });

    const whatsappNumber = brandData?.brand?.whatsapp || '212600000000';
    const link = cart.buildWhatsAppLink(whatsappNumber, {
      ...customer,
      orderNumber
    });
    window.open(link, '_blank');

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }

    setTimeout(() => {
      showSuccess(orderNumber);
    }, 500);
  });
}

function buildApiPayload(customer) {
  const items = cart.items.map((it) => {
    const name = typeof it.name === 'object' ? (it.name.fr || Object.values(it.name)[0]) : (it.name || it.productName || it.id);
    return {
      productId: it.id || it.productId || 'unknown',
      productName: String(name).slice(0, 200),
      variant: {
        color: it.color || null,
        size: it.size || null,
        pack: it.pack || null
      },
      unitPrice: Math.round(it.price || 0),
      quantity: Math.max(1, parseInt(it.qty, 10) || 1),
      lineTotal: Math.round((it.price || 0) * (it.qty || 1))
    };
  });
  return {
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      city: customer.city,
      address: customer.address,
      notes: customer.note || ''
    },
    items,
    subtotal: cart.getSubtotal(),
    shipping: cart.getShipping(),
    total: cart.getTotal(),
    language: getCurrentLang()
  };
}

function saveOrderHistory(customer) {
  try {
    const history = JSON.parse(localStorage.getItem('maisoneloria_orders') || '[]');
    history.push({
      ...customer,
      items: cart.items,
      total: cart.getTotal(),
      timestamp: Date.now()
    });
    localStorage.setItem('maisoneloria_orders', JSON.stringify(history));
  } catch (e) {
    console.warn('Could not save order history', e);
  }
}

function showSuccess(orderNumber) {
  const lang = getCurrentLang();
  const main = document.querySelector('main.container') || document.querySelector('main');
  if (!main) return;
  const refLine = orderNumber
    ? `<p style="font-family: var(--font-display); font-size: 1.1rem; color: var(--color-charcoal); margin-bottom: var(--space-2);">
         ${lang === 'ar' ? 'رقم طلبكِ' : 'Votre numéro de commande'} :
         <strong style="color: var(--color-terracotta); letter-spacing: 0.05em;">${orderNumber}</strong>
       </p>
       <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-6);">
         <a href="./track.html?order=${encodeURIComponent(orderNumber)}" style="color: var(--color-terracotta); font-weight: 600; text-decoration: underline;">
           ${lang === 'ar' ? 'تتبع طلبي →' : 'Suivre ma commande →'}
         </a>
       </p>`
    : '';
  main.innerHTML = `
    <div class="section text-center" style="padding: var(--space-32) 0;">
      <div style="font-size: 5rem; margin-bottom: var(--space-6);">🌹</div>
      <h1 style="margin-bottom: var(--space-4);">${lang === 'ar' ? 'تم إرسال طلبكِ!' : 'Commande envoyée !'}</h1>
      ${refLine}
      <p class="lead" style="max-width: 540px; margin: 0 auto var(--space-8);">${lang === 'ar' ? 'استلمنا طلبكِ على واتساب. سنتصل بكِ خلال 30 دقيقة لتأكيد التفاصيل وموعد التسليم.' : 'Nous avons reçu votre commande sur WhatsApp. Nous vous contacterons sous 30 minutes pour confirmer les détails et la livraison.'}</p>
      <div style="display: inline-flex; flex-direction: column; gap: var(--space-4);">
        <a href="./" class="btn btn-primary btn-lg">${lang === 'ar' ? 'العودة للرئيسية' : "Retour à l'accueil"}</a>
        <a href="./shop.html" class="btn btn-outline">${lang === 'ar' ? 'متابعة التسوق' : 'Continuer mes achats'}</a>
      </div>
    </div>
  `;
  cart.clear();
}

document.addEventListener('DOMContentLoaded', init);
