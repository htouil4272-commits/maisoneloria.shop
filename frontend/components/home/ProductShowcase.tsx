'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COLORS, IMAGES } from '@/lib/constants';

export default function ProductShowcase() {
  return (
    <section className="section-padding">
      <div className="container-custom mx-auto product-zone py-6 sm:py-8 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="product-dots" aria-hidden>
              ···
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary">
              9 ألوان تناسب كل ديكور ✨
            </h2>
            <span className="product-dots" aria-hidden>
              ···
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اختار اللون اللي يناسب الصالون ديالك من مجموعتنا المتنوعة
          </p>
        </motion.div>

        {/* Viral Overhead Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 photo-editorial"
        >
          <img
            src={IMAGES.viralOverhead}
            alt="مجموعة كراسي بألوان مختلفة على زليج مغربي"
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {COLORS.map((color, i) => (
            <motion.div
              key={color.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href="/product" className="block photo-card group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={color.image}
                    alt={`غطاء كرسي لون ${color.nameAr}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: color.imagePosition || 'center' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute inset-0 flex items-end justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                      شوف المنتج ←
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center bg-white">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                    <p className="font-bold text-primary text-sm">{color.nameAr}</p>
                  </div>
                  <p className="text-[11px] text-gold tracking-[0.2em] uppercase mt-0.5">{color.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/collection" className="btn-outline">
            شوف المجموعة الكاملة ←
          </Link>
        </div>
      </div>
    </section>
  );
}
