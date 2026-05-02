'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-cream via-cream to-primary/5">
      <div className="container-custom mx-auto px-4 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gold/10 text-gold font-bold text-sm px-4 py-2 rounded-full mb-6">
              🏠 جددي ديكور دارك بأقل ثمن
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              حولي الكراسي ديالك
              <br />
              <span className="text-gold">لقطع ديكور فاخرة</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              أغطية كراسي أنيقة وعملية، بقماش مطاطي ممتاز كيتناسب مع جميع الكراسي.
              جودة عالية بثمن معقول.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/product" className="btn-primary text-lg relative pulse-ring">
                اطلبي دابا 🛒
              </Link>
              <Link href="/collection" className="btn-outline text-lg">
                شوفي المجموعة
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1">🚚 توصيل مجاني</span>
              <span className="flex items-center gap-1">💳 الدفع عند الاستلام</span>
              <span className="flex items-center gap-1">⭐ +5000 عميلة</span>
            </div>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Replace with real lifestyle image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gold/20 to-primary/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-6xl">🪑</span>
                  </div>
                  <p className="text-primary/40 text-sm">صورة المنتوج</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-4 bg-white rounded-2xl shadow-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">+5000 عميلة راضية</p>
                  <p className="text-xs text-gray-500">ثقة ورضا 100%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
