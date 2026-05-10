'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CURRENCY_AR, IMAGES } from '@/lib/constants';
import { trackClick } from '@/lib/tracking';

export default function Hero() {
  return (
    <section className="relative min-h-[640px] sm:min-h-[100svh] flex items-center overflow-hidden">
      <img
        src={IMAGES.moroccanSalon}
        alt="صالون أنيق مع أغطية كراسي ميزون إلوريا — أزرق، بوردو، بيج"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      {/* تدرّج للقراءة — يتركّز يميناً (RTL) ويترك يسار الصورة بارزاً */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/55 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.5),transparent_60%)]" />

      <div className="relative z-10 container-custom mx-auto px-4 py-20 sm:py-24 lg:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-block bg-gold/90 text-white font-bold text-base sm:text-lg px-5 py-2.5 rounded-full mb-6 shadow-lg"
            >
              ابتداءً من 47.5 {CURRENCY_AR} للقطعة
            </motion.span>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 text-shadow-lg">
              حوّل كراسي بيتك
              <br />
              <span className="text-gold">لقطع ديكور فاخرة</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-lg text-shadow">
              أغطية كراسي أنيقة وعملية، بقماش مطاطي ممتاز كيتناسب مع جميع الكراسي.
              جودة عالية بثمن معقول، توصيل مجاني والدفع عند الاستلام.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/product"
                onClick={() => trackClick('hero_cta_order')}
                className="btn-gold text-lg sm:text-xl py-4 px-10 text-center relative pulse-ring"
              >
                اطلب دابا 🛒
              </Link>
              <Link
                href="/collection"
                onClick={() => trackClick('hero_cta_collection')}
                className="border-2 border-white text-white font-bold py-4 px-10 rounded-xl text-lg text-center hover:bg-white hover:text-primary transition-all duration-300"
              >
                شوف المجموعة
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <span className="inline-flex items-center gap-3 bg-white/95 text-primary font-bold text-lg sm:text-xl px-6 py-3 rounded-2xl shadow-xl floating">
                💳 الدفع عند الاستلام
              </span>
            </motion.div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-sm sm:text-base text-white/80">
              <span className="flex items-center gap-1.5">🚚 توصيل مجاني</span>
              <span className="flex items-center gap-1.5">🔄 إرجاع مجاني</span>
              <span className="flex items-center gap-1.5">⭐ +5000 زبون</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="hidden lg:block absolute bottom-8 left-8 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4"
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div>
            <p className="font-bold text-primary text-sm">+5000 زبون راضي</p>
            <p className="text-xs text-gray-500">ثقة ورضا 100%</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
