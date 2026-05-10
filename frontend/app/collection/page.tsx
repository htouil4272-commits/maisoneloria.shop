'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { COLORS, PACKS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import { trackEvent } from '@/lib/tracking';

export default function CollectionPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const filteredColors = activeFilter
    ? COLORS.filter((c) => c.id === activeFilter)
    : COLORS;

  const defaultPack = PACKS[1]; // Pack 6

  const handleQuickAdd = (colorId: string) => {
    addItem(colorId, defaultPack.id);
    trackEvent('AddToCart', {
      content_name: `أغطية كراسي - ${COLORS.find((c) => c.id === colorId)?.nameAr}`,
      content_ids: [colorId],
      value: defaultPack.price,
      currency: 'MAD',
    });
  };

  return (
    <section className="section-padding">
      <div className="container-custom mx-auto product-zone py-6 sm:py-8 px-3 sm:px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 flex-wrap mb-3">
            <span className="product-dots" aria-hidden>
              ···
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-primary">
              المجموعة الكاملة ✨
            </h1>
            <span className="product-dots" aria-hidden>
              ···
            </span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            اختار اللون المفضل ديالك من 9 ألوان أنيقة تناسب كل ديكور
          </p>
        </motion.div>

        {/* Color Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              !activeFilter
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            الكل ({COLORS.length})
          </button>
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setActiveFilter(activeFilter === color.id ? null : color.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === color.id
                  ? 'bg-primary text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              {color.nameAr}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredColors.map((color, i) => (
            <motion.div
              key={color.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={color.image}
                  alt={`غطاء كرسي لون ${color.nameAr}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: color.imagePosition || 'center' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                {/* Quick add overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <button
                    onClick={() => handleQuickAdd(color.id)}
                    className="w-full bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-gold hover:text-white transition-colors shadow-lg"
                  >
                    إضافة سريعة 🛒
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="font-bold text-primary text-sm">{color.nameAr}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">{color.name}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex gap-0.5 text-gold text-xs">★★★★★</div>
                  <span className="text-xs text-gray-500">(4.9)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{formatPrice(defaultPack.price)}</span>
                  <span className="line-through text-gray-400 text-xs">
                    {formatPrice(defaultPack.originalPrice)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">باك 6 قطع</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
