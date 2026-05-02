'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { submitOrder } from '@/lib/api';
import { trackEvent } from '@/lib/tracking';
import { formatPrice, validateMoroccanPhone, generateEventId, getUtmParams, generateOrderNumber } from '@/lib/utils';

export default function CheckoutModal() {
  const router = useRouter();
  const isOpen = useCartStore((s) => s.isCheckoutOpen);
  const closeCheckout = useCartStore((s) => s.closeCheckout);
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const total = getTotal();

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = 'المرجو إدخال الاسم';
    if (!phone.trim()) {
      newErrors.phone = 'المرجو إدخال رقم الهاتف';
    } else if (!validateMoroccanPhone(phone)) {
      newErrors.phone = 'رقم الهاتف خاصو يبدا ب 06 أو 07 ويكون 10 أرقام';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const eventId = generateEventId();
    const utmParams = getUtmParams();

    trackEvent('Purchase', {
      value: total,
      currency: 'MAD',
      num_items: items.length,
    });

    const orderNumber = generateOrderNumber();

    const result = await submitOrder({
      name: name.trim(),
      phone: phone.trim(),
      items,
      total,
      event_id: eventId,
      landing_page: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...utmParams,
    });

    setIsSubmitting(false);

    if (result.success) {
      const finalOrderNumber = result.orderNumber || orderNumber;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('orderNumber', finalOrderNumber);
        sessionStorage.setItem('orderTotal', String(total));
        sessionStorage.setItem('orderItems', JSON.stringify(items));
        sessionStorage.setItem('orderName', name.trim());
      }
      clearCart();
      closeCheckout();
      router.push('/thank-you');
    } else {
      // Still redirect on API failure to avoid blocking the user
      const fallbackOrderNumber = orderNumber;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('orderNumber', fallbackOrderNumber);
        sessionStorage.setItem('orderTotal', String(total));
        sessionStorage.setItem('orderItems', JSON.stringify(items));
        sessionStorage.setItem('orderName', name.trim());
      }
      clearCart();
      closeCheckout();
      router.push('/thank-you');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-[60] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Social Proof Bar */}
            <div className="bg-primary text-white text-center py-2 text-sm font-medium">
              🔥 +127 شخص طلبو اليوم — العرض غادي يسالي قريباً
            </div>

            <div className="p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-playfair text-xl font-bold text-primary">إتمام الطلب</h2>
                <button
                  onClick={closeCheckout}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                  aria-label="إغلاق"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Summary */}
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

              {/* Scarcity Counter */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-sm mb-5">
                <span className="text-red-600 font-bold">⏰ بقات غير 3 قطع فالستوك — سارعي!</span>
              </div>

              {/* Form */}
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
                    className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
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
                    className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center text-sm text-red-600 mt-4">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gold text-white font-bold py-4 rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg active:scale-[0.98] mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* COD Trust */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <span>🔒 معلوماتك آمنة</span>
                <span>💳 الدفع عند الاستلام</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
