'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cart-store';
import { submitOrder } from '@/lib/api';
import { trackEvent } from '@/lib/tracking';
import { formatPrice, validateMoroccanPhone, generateEventId, getUtmParams, computeOrderTotalMAD } from '@/lib/utils';
import { IMAGES } from '@/lib/constants';

export default function CheckoutModal() {
  const isOpen = useCartStore((s) => s.isCheckoutOpen);
  const closeCheckout = useCartStore((s) => s.closeCheckout);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; city?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderNumber?: string;
    message?: string;
    customerName?: string;
    customerPhone?: string;
    customerCity?: string;
    orderedItems?: typeof items;
    orderTotal?: number;
  } | null>(null);

  const total = computeOrderTotalMAD(items);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSubmittedOrder(null);
      setSubmitError('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: { name?: string; phone?: string; city?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) newErrors.name = 'المرجو إدخال الاسم';
    else if (trimmedName.length < 3) newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (!phone.trim()) {
      newErrors.phone = 'المرجو إدخال رقم الهاتف';
    } else if (!validateMoroccanPhone(phone)) {
      newErrors.phone = 'رقم الهاتف خاصو يبدا ب 06 أو 07 ويكون 10 أرقام';
    }
    if (!city.trim()) newErrors.city = 'المرجو إدخال المدينة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || submittedOrder) return;
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const eventId = generateEventId();
    const utmParams = getUtmParams();

    try {
      const result = await submitOrder({
        name: name.trim(),
        phone: phone.trim().replace(/\s/g, ''),
        city: city.trim(),
        items,
        total,
        event_id: eventId,
        landing_page: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        ...utmParams,
      });

      if (result.success) {
        trackEvent('Purchase', {
          value: total,
          currency: 'MAD',
          num_items: items.length,
          content_ids: items.map((i) => i.colorId || i.id),
          content_type: 'product',
          event_id: eventId,
        });
        const snapItems = [...items];
        const snapTotal = total;
        clearCart();
        setSubmittedOrder({
          orderNumber: result.orderNumber,
          message: result.message || 'شكراً لك، طلبك قيد المراجعة وسنتواصل معك قريباً لتأكيده.',
          customerName: name.trim(),
          customerPhone: phone.trim().replace(/\s/g, ''),
          customerCity: city.trim(),
          orderedItems: snapItems,
          orderTotal: snapTotal,
        });
      } else {
        setSubmitError(result.error || 'حدث خطأ، المرجو المحاولة مرة أخرى');
      }
    } catch {
      setSubmitError('تعذّر إرسال الطلب. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    closeCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none sm:items-center sm:p-4"
          >
            <div
              className="pointer-events-auto flex w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border-2 border-green-200 bg-white shadow-2xl"
              style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)', maxHeight: 'calc(var(--vh, 1vh) * 95)', height: 'auto' }}
            >
              {submittedOrder ? (
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  {/* Success Header */}
                  <div className="flex-shrink-0 bg-green-600 px-5 py-5 text-center text-white">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-green-100 mb-0.5">شكراً لك {submittedOrder.customerName}!</p>
                    <h2 className="font-playfair text-xl font-bold">تم استلام طلبك ✅</h2>
                    <p className="text-xs text-green-100 mt-1">طلبك قيد المراجعة، سنتواصل معك قريباً</p>
                    {submittedOrder.orderNumber && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-mono font-bold">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                        {submittedOrder.orderNumber}
                      </div>
                    )}
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

                    {/* What happens next */}
                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white">
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                        </div>
                        <h3 className="font-bold text-green-800 text-sm">شنو يحصل بعد الطلب؟</h3>
                      </div>
                      <ul className="space-y-2.5 text-sm text-green-800">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">1</span>
                          <span>سنتصل بك في أقرب وقت لتأكيد الطلب والعنوان</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">2</span>
                          <span>التوصيل مجاني لجميع المدن المغربية خلال 24-72 ساعة</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">3</span>
                          <span>ما تخلص حتى تشوف المنتج فيدك — الدفع عند الاستلام فقط</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">4</span>
                          <span>لو ما رضيتيش، تواصل معنا ورسالة واتساب وسنحل طلبك بسهولة</span>
                        </li>
                      </ul>
                    </div>

                    {/* Customer data */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-500" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        بيانات التواصل
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">الاسم:</span>
                          <span className="font-bold text-gray-800">{submittedOrder.customerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">الهاتف:</span>
                          <span className="font-bold text-gray-800 font-mono" dir="ltr">{submittedOrder.customerPhone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">المدينة:</span>
                          <span className="font-bold text-gray-800">{submittedOrder.customerCity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order summary */}
                    {submittedOrder.orderedItems && submittedOrder.orderedItems.length > 0 && (
                      <div className="rounded-2xl border border-gray-100 bg-white p-4">
                        <h3 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-500" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                          ملخص الطلب
                        </h3>
                        <div className="space-y-2.5">
                          {submittedOrder.orderedItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-full flex-shrink-0 border border-gray-200" style={{ backgroundColor: item.colorHex }} />
                                <span className="text-gray-700">{item.colorNameAr} — باك {item.packQuantity} قطع</span>
                                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-bold text-gray-600">×{item.quantity}</span>
                              </div>
                              <span className="font-bold text-green-700">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="font-bold text-gray-700">المجموع الكلي:</span>
                          <span className="text-lg font-bold text-green-700">{formatPrice(submittedOrder.orderTotal ?? 0)}</span>
                        </div>
                        <p className="mt-1.5 text-center text-xs font-medium text-green-600">🚚 التوصيل مجاني | 💳 الدفع عند الاستلام</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                    <button
                      onClick={handleClose}
                      className="w-full rounded-xl bg-gold py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-gold-dark active:scale-[0.98]"
                    >
                      حسناً، شكراً! 👍
                    </button>
                    <p className="mt-2 text-center text-xs text-gray-400">سنتصل بك في أقرب وقت ممكن</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-shrink-0 bg-primary text-white text-center py-2 text-sm font-medium">
                    🔥 +127 شخص طلبو اليوم — العرض غادي يسالى قريباً
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex flex-shrink-0 items-center justify-between px-5 pt-5 sm:px-6">
                      <h2 className="font-playfair text-xl font-bold text-primary">إتمام الطلب</h2>
                      <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="إغلاق"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-5 sm:px-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={IMAGES.codDelivery}
                      alt="التوصيل والدفع عند الاستلام"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-green-700 text-sm">💳 الدفع عند الاستلام</p>
                    <p className="text-xs text-green-600">ما تخلص حتى تشوف المنتج</p>
                  </div>
                </div>

                <div className="bg-cream rounded-xl p-4 mb-5">
                  <h3 className="font-bold text-primary text-sm mb-3">ملخص الطلب</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-gray-700">
                            {item.colorNameAr} — باك {item.packQuantity} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
                    <span className="font-bold text-primary">المجموع:</span>
                    <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                  </div>
                  <p className="text-center text-xs text-green-600 font-medium mt-2">
                    🚚 التوصيل مجاني
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: فاطمة بنعلي"
                      className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all ${
                        errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06XXXXXXXX"
                      dir="ltr"
                      className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all ${
                        errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary mb-1">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: الدار البيضاء"
                      required
                      className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-all ${
                        errors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-sm text-red-600 mt-4">
                    {submitError}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gold text-white font-bold py-4 rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      جاري التأكيد...
                    </span>
                  ) : (
                    '✅ تأكيد الطلب — الدفع عند الاستلام'
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                  <span>🔒 معلوماتك محمية</span>
                  <span>💳 الدفع عند الاستلام</span>
                  <span>🚚 توصيل مجاني</span>
                </div>
              </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
