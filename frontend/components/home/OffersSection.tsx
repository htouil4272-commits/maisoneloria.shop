'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PACKS, PRICE_PER_PIECE } from '@/lib/constants';
import { formatPrice, calculateDiscount } from '@/lib/utils';

export default function OffersSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-red-50 text-red-600 font-bold text-sm px-4 py-2 rounded-full mb-4">
            🔥 عرض محدود
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            اختاري الباك ديالك 🎁
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ثمن القطعة الواحدة: <span className="line-through text-red-500">{PRICE_PER_PIECE} درهم</span>
            {' '}— وفري أكثر مع الباكات ديالنا
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PACKS.map((pack, i) => {
            const discount = calculateDiscount(pack.originalPrice, pack.price);
            const isPopular = pack.id === 'pack-6';
            const isBestValue = pack.id === 'pack-9';
            const pricePerPiece = Math.round(pack.price / pack.quantity);

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative card p-6 text-center ${
                  isPopular
                    ? 'border-2 border-gold ring-4 ring-gold/10 scale-105'
                    : isBestValue
                    ? 'border-2 border-primary'
                    : 'border border-gray-200'
                }`}
              >
                {pack.badgeAr && (
                  <span
                    className={`absolute -top-3 right-1/2 translate-x-1/2 ${
                      isPopular ? 'badge-popular' : 'badge-value'
                    }`}
                  >
                    {pack.badgeAr}
                  </span>
                )}

                <h3 className="font-playfair text-2xl font-bold text-primary mb-2 mt-2">
                  {pack.labelAr}
                </h3>

                <div className="mb-4">
                  <span className="line-through text-gray-400 text-lg">
                    {formatPrice(pack.originalPrice)}
                  </span>
                  <div className="text-4xl font-bold text-primary mt-1">
                    {formatPrice(pack.price)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {pricePerPiece} درهم / القطعة
                  </div>
                </div>

                <div className="bg-green-50 text-green-700 font-bold text-sm py-2 px-4 rounded-full inline-block mb-4">
                  وفري {discount}% — أي {formatPrice(pack.originalPrice - pack.price)}
                </div>

                <Link
                  href="/product"
                  className={`block w-full py-3 rounded-xl font-bold transition-all ${
                    isPopular
                      ? 'bg-gold text-white hover:bg-gold-dark shadow-lg'
                      : 'bg-primary text-white hover:bg-primary-light'
                  }`}
                >
                  اطلبي دابا
                </Link>

                <p className="text-xs text-gray-400 mt-3">🚚 توصيل مجاني | 💳 الدفع عند الاستلام</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
