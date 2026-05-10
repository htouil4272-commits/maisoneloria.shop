'use client';

import { motion } from 'framer-motion';
import { COLORS, PACKS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';

export default function CrossSells() {
  const addItem = useCartStore((s) => s.addItem);
  const suggestedColors = COLORS.slice(0, 4);
  const defaultPack = PACKS[1]; // pack-6

  return (
    <section className="section-padding">
      <div className="container-custom mx-auto product-zone py-6 sm:py-8 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
            <span className="product-dots" aria-hidden>
              ···
            </span>
            <h2 className="font-playfair text-2xl font-bold text-primary">
              كمّل الديكور ديالك 🏠
            </h2>
            <span className="product-dots" aria-hidden>
              ···
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">ألوان أخرى غادي تعجبك</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {suggestedColors.map((color) => (
            <motion.div
              key={color.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card"
            >
              {/* Product image */}
              <div className="aspect-square relative overflow-hidden bg-cream-dark/30">
                {color.image ? (
                  <img
                    src={color.image}
                    alt={`غطاء كرسي لون ${color.nameAr}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: color.imagePosition || 'center' }}
                  />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: color.hex }} />
                )}
              </div>
              <div className="p-3">
                <p className="font-bold text-primary text-sm">{color.nameAr}</p>
                <p className="text-sm text-gray-500">{formatPrice(defaultPack.price)}</p>
                <button
                  onClick={() => addItem(color.id, defaultPack.id)}
                  className="mt-2 w-full bg-primary/10 text-primary font-bold text-xs py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
                >
                  أضف للسلة
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
