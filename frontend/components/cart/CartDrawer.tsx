'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';
import CartItem from './CartItem';
import CrossSellCart from './CrossSellCart';

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const openCheckout = useCartStore((s) => s.openCheckout);
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowScrollHint(el.scrollHeight > el.clientHeight + 10 && el.scrollTop < el.scrollHeight - el.clientHeight - 10);
    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [isOpen, items]);

  const total = getTotal();
  const count = getItemCount();

  const handleCheckout = () => {
    trackEvent('InitiateCheckout', {
      value: total,
      currency: 'MAD',
      num_items: count,
    });
    openCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — behind navbar (z-99) so navbar stays visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-[99]"
          />

          {/* Drawer — starts below navbar (top-16), above navbar (z-[101]) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 w-full max-w-md bg-white z-[101] flex flex-col shadow-2xl rounded-tl-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-primary text-lg">
                🛒 السلة ({count})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors border border-gray-200"
                aria-label="إغلاق"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items — scroll area with fade hint */}
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={scrollRef}
                className="h-full overflow-y-scroll hide-scrollbar p-4 overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-500 font-medium">السلة فارغة</p>
                  <p className="text-sm text-gray-400 mt-1">أضف منتجات للسلة</p>
                  <button
                    onClick={closeCart}
                    className="btn-primary mt-4 text-sm"
                  >
                    تسوّق دابا
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Cross-sell */}
                  <CrossSellCart />
                </>
              )}
              </div>

              {/* Scroll hint gradient */}
              {showScrollHint && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 animate-bounce">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    مرّر للأسفل
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                {/* Free shipping badge */}
                <div className="bg-green-50 text-green-700 text-sm font-bold text-center py-2 rounded-lg border border-green-200">
                  🚚 توصيل مجاني لجميع المدن
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">المجموع:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

                {/* COD Badge — تباين عالي بدل bg-primary/5 الباهت */}
                <div className="bg-gold/15 text-primary text-sm font-bold text-center py-2.5 rounded-lg border border-gold/40">
                  💳 الدفع عند الاستلام — ما تخلص حتى يوصلك
                </div>

                {/* CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gold text-white font-bold py-4 rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg active:scale-[0.98]"
                >
                  إتمام الطلب ✅
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
