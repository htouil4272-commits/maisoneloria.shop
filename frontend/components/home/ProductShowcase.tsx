'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COLORS } from '@/lib/constants';

export default function ProductShowcase() {
  return (
    <section className="section-padding">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            9 ألوان تناسب كل ديكور ✨
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اختاري اللون اللي يناسب الصالون ديالك من مجموعتنا المتنوعة
          </p>
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
              <Link href="/product" className="block card group">
                {/* Product image placeholder - replace with real product photo */}
                <div
                  className="aspect-square relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-full">
                      شوفي المنتوج
                    </span>
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-primary text-sm">{color.nameAr}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/collection" className="btn-outline">
            شوفي المجموعة الكاملة ←
          </Link>
        </div>
      </div>
    </section>
  );
}
