/* ============================================================
   MAISON ELORIA — Order Tracking
   ============================================================ */

import { initI18n, getCurrentLang } from './i18n.js';
import { initCartDrawer, setupWhatsAppLinks } from './cart-drawer.js';
import { apiFetch } from './api.js';
import { initScrollReveal } from './reveal.js';

const STATUS_FLOW = ['new', 'contacted', 'confirmed', 'shipped', 'delivered'];

const STATUS_TEXT = {
  fr: {
    new:        { label: 'Nouvelle commande',  desc: 'Votre commande a bien été reçue. Notre équipe va la traiter sous peu.' },
    contacted:  { label: 'Contact établi',     desc: 'Nous vous avons contactée pour confirmer les détails.' },
    confirmed:  { label: 'Commande confirmée', desc: 'Votre commande est confirmée et passe en préparation.' },
    shipped:    { label: 'En cours de livraison', desc: 'Votre commande est entre les mains de notre livreur. Préparez votre paiement (COD).' },
    delivered:  { label: 'Livrée',             desc: 'Votre commande a été livrée. Merci pour votre confiance ❤️' },
    cancelled:  { label: 'Annulée',            desc: 'Cette commande a été annulée. Contactez-nous si vous avez une question.' },
    returned:   { label: 'Retournée',          desc: 'Votre commande a été retournée. Le remboursement est en cours.' }
  },
  ar: {
    new:        { label: 'طلب جديد',           desc: 'استلمنا طلبكِ. سنعالجه قريبًا.' },
    contacted:  { label: 'تم الاتصال بكِ',     desc: 'تواصلنا معكِ لتأكيد التفاصيل.' },
    confirmed:  { label: 'تم تأكيد الطلب',     desc: 'طلبكِ مؤكد وفي مرحلة التحضير.' },
    shipped:    { label: 'قيد التوصيل',        desc: 'طلبكِ مع مندوب التوصيل. جهّزي مبلغ الدفع (COD).' },
    delivered:  { label: 'تم التسليم',         desc: 'تم تسليم طلبكِ. شكرًا على ثقتكِ ❤️' },
    cancelled:  { label: 'مُلغى',              desc: 'تم إلغاء هذا الطلب. تواصلي معنا لأي سؤال.' },
    returned:   { label: 'مُرتجع',             desc: 'تم إرجاع الطلب. الاسترداد قيد المعالجة.' }
  }
};

function fmtDate(iso, lang) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

async function init() {
  initI18n();
  initCartDrawer();
  initScrollReveal();
  fetch('./assets/data/products.json').then((r) => r.json()).then(setupWhatsAppLinks).catch(() => {});

  const form = document.querySelector('[data-track-form]');
  const result = document.querySelector('[data-track-result]');
  const feedback = document.querySelector('[data-track-feedback]');
  const submit = document.querySelector('[data-track-submit]');
  const input = document.getElementById('order-number');

  const url = new URL(location.href);
  const presetOrder = url.searchParams.get('order');
  if (presetOrder) {
    input.value = presetOrder.toUpperCase();
    requestAnimationFrame(() => form.requestSubmit());
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = getCurrentLang();
    const orderNumber = (input.value || '').trim().toUpperCase();
    if (!/^ME-\d{4}-[A-Z0-9]{5}$/.test(orderNumber)) {
      feedback.style.color = 'var(--color-error)';
      feedback.textContent = lang === 'ar'
        ? 'صيغة رقم الطلب غير صحيحة.'
        : 'Format du numéro de commande invalide.';
      return;
    }

    submit.disabled = true;
    feedback.style.color = 'var(--color-text-muted)';
    feedback.textContent = lang === 'ar' ? 'جاري البحث…' : 'Recherche…';

    const res = await apiFetch(`/api/orders/${encodeURIComponent(orderNumber)}/track`);

    submit.disabled = false;

    if (res.ok && res.data?.order) {
      feedback.textContent = '';
      renderResult(result, res.data.order, lang);
    } else if (res.status === 404) {
      feedback.style.color = 'var(--color-error)';
      feedback.textContent = lang === 'ar'
        ? 'لم نعثر على طلب بهذا الرقم.'
        : 'Aucune commande trouvée avec ce numéro.';
      result.classList.add('hidden');
    } else if (res.status === 0) {
      feedback.style.color = 'var(--color-error)';
      feedback.textContent = lang === 'ar'
        ? 'تعذّر الاتصال بالخادم.'
        : 'Connexion au serveur impossible.';
      result.classList.add('hidden');
    } else {
      feedback.style.color = 'var(--color-error)';
      feedback.textContent = lang === 'ar'
        ? 'حدث خطأ. حاولي لاحقًا.'
        : 'Erreur. Réessayez plus tard.';
      result.classList.add('hidden');
    }
  });
}

function renderResult(container, order, lang) {
  const isCancelled = order.status === 'cancelled' || order.status === 'returned';
  const currentIdx = isCancelled ? -1 : STATUS_FLOW.indexOf(order.status);
  const text = STATUS_TEXT[lang]?.[order.status] || STATUS_TEXT.fr[order.status] || { label: order.status, desc: '' };

  const stepsHtml = STATUS_FLOW.map((s, i) => {
    const t = STATUS_TEXT[lang]?.[s] || STATUS_TEXT.fr[s];
    const cls = i < currentIdx ? 'done' : (i === currentIdx ? 'current' : 'pending');
    return `
      <li class="track-step ${cls}">
        <span class="track-step-marker"></span>
        <span class="track-step-label">${t.label}</span>
      </li>
    `;
  }).join('');

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="track-card">
      <div class="track-card-header">
        <div>
          <div class="track-card-number">${order.order_number}</div>
          <div class="track-card-meta">${lang === 'ar' ? 'تم الإنشاء' : 'Créée le'} ${fmtDate(order.created_at, lang)}</div>
        </div>
        <span class="track-status track-status-${order.status}">${text.label}</span>
      </div>
      <p class="track-card-desc">${text.desc}</p>
      ${isCancelled ? '' : `<ol class="track-steps">${stepsHtml}</ol>`}
      <div class="track-card-meta" style="text-align: ${lang === 'ar' ? 'left' : 'right'}; margin-top: var(--space-4);">
        ${lang === 'ar' ? 'آخر تحديث' : 'Dernière mise à jour'} : ${fmtDate(order.updated_at, lang)}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
