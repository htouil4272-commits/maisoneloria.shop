'use client';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer - slides from left in RTL */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-primary text-lg">
                🛒 السلة ({count})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="إغلاق"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-gray-500 font-medium">السلة فارغة</p>
                  <p className="text-sm text-gray-400 mt-1">أضيفي منتجات للسلة</p>
                  <button
                    onClick={closeCart}
                    className="btn-primary mt-4 text-sm"
                  >
                    تسوقي دابا
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                {/* Free shipping badge */}
                <div className="bg-green-50 text-green-700 text-sm font-medium text-center py-2 rounded-lg">
                  🚚 توصيل مجاني لجميع المدن
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المجموع:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                </div>

                {/* COD Badge */}
                <div className="bg-primary/5 text-primary text-xs font-medium text-center py-2 rounded-lg">
                  💳 الدفع عند الاستلام — ما تخلصي حتى توصلك
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
