/* ============================================================
   MAISON ELORIA — Cart Manager (localStorage + WhatsApp checkout)
   ============================================================ */

import { getCurrentLang, t } from './i18n.js';

const CART_KEY = 'maisoneloria_cart_v1';
const FREE_SHIPPING_THRESHOLD = 500;

export class Cart {
  constructor() {
    this.items = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this.emit();
  }

  emit() {
    this.listeners.forEach((fn) => fn(this.getState()));
    window.dispatchEvent(new CustomEvent('cart:changed', { detail: this.getState() }));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.getState());
    return () => this.listeners.delete(fn);
  }

  add(item) {
    const key = this.itemKey(item);
    const existing = this.items.find((i) => this.itemKey(i) === key);
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      this.items.push({ ...item, qty: item.qty || 1, addedAt: Date.now() });
    }
    this.save();
  }

  update(key, qty) {
    const item = this.items.find((i) => this.itemKey(i) === key);
    if (!item) return;
    if (qty <= 0) {
      this.remove(key);
    } else {
      item.qty = qty;
      this.save();
    }
  }

  remove(key) {
    this.items = this.items.filter((i) => this.itemKey(i) !== key);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  itemKey(item) {
    return `${item.productId}::${item.variant || ''}::${item.size || ''}::${item.color || ''}::${item.bundleId || ''}`;
  }

  getCount() {
    return this.items.reduce((sum, i) => sum + (i.qty || 1), 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
  }

  getShipping() {
    if (this.items.length === 0) return 0;
    return this.getSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : 30;
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping();
  }

  getState() {
    return {
      items: this.items,
      count: this.getCount(),
      subtotal: this.getSubtotal(),
      shipping: this.getShipping(),
      total: this.getTotal(),
      freeShippingProgress: Math.min(100, (this.getSubtotal() / FREE_SHIPPING_THRESHOLD) * 100),
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - this.getSubtotal())
    };
  }

  buildWhatsAppMessage(customerInfo = {}) {
    const lang = getCurrentLang();
    const isAr = lang === 'ar';
    const lines = [];

    if (isAr) {
      lines.push('🌹 *طلب جديد — ميزون إيلوريا* 🌹');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push('*المنتجات:*');
    } else {
      lines.push('🌹 *Nouvelle commande — Maison Eloria* 🌹');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push('*Articles :*');
    }

    this.items.forEach((item, idx) => {
      const num = idx + 1;
      const name = typeof item.name === 'object' ? item.name[lang] || item.name.fr : item.name;
      lines.push(`${num}. ${name}`);
      const meta = [];
      if (item.size) meta.push(`${isAr ? 'المقاس' : 'Taille'}: ${item.size}`);
      if (item.color) meta.push(`${isAr ? 'اللون' : 'Couleur'}: ${item.color}`);
      if (meta.length > 0) lines.push(`   ${meta.join(' · ')}`);
      lines.push(`   ${isAr ? 'الكمية' : 'Qté'}: ${item.qty} × ${item.price} ${isAr ? 'درهم' : 'DH'} = *${item.qty * item.price} ${isAr ? 'درهم' : 'DH'}*`);
      lines.push('');
    });

    lines.push('━━━━━━━━━━━━━━━━━━');
    if (isAr) {
      lines.push(`*المجموع الفرعي:* ${this.getSubtotal()} درهم`);
      lines.push(`*التوصيل:* ${this.getShipping() === 0 ? 'مجاني 🎁' : this.getShipping() + ' درهم'}`);
      lines.push(`*الإجمالي:* ${this.getTotal()} درهم`);
      lines.push('');
      lines.push('💵 *الدفع عند الاستلام*');
    } else {
      lines.push(`*Sous-total :* ${this.getSubtotal()} DH`);
      lines.push(`*Livraison :* ${this.getShipping() === 0 ? 'Gratuite 🎁' : this.getShipping() + ' DH'}`);
      lines.push(`*Total :* ${this.getTotal()} DH`);
      lines.push('');
      lines.push('💵 *Paiement à la livraison*');
    }

    if (customerInfo.name || customerInfo.phone || customerInfo.address) {
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push(isAr ? '*معلومات الزبونة:*' : '*Coordonnées :*');
      if (customerInfo.name) lines.push(`👤 ${customerInfo.name}`);
      if (customerInfo.phone) lines.push(`📱 ${customerInfo.phone}`);
      if (customerInfo.city) lines.push(`🏙️ ${customerInfo.city}`);
      if (customerInfo.address) lines.push(`📍 ${customerInfo.address}`);
      if (customerInfo.note) lines.push(`📝 ${customerInfo.note}`);
    }

    lines.push('');
    lines.push(isAr ? 'شكراً لاختياركِ ميزون إيلوريا 🌹' : 'Merci d\'avoir choisi Maison Eloria 🌹');

    return lines.join('\n');
  }

  buildWhatsAppLink(whatsappNumber, customerInfo = {}) {
    const message = this.buildWhatsAppMessage(customerInfo);
    const encoded = encodeURIComponent(message);
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  }
}

export const cart = new Cart();

if (typeof window !== 'undefined') {
  window.maisonCart = cart;
}
