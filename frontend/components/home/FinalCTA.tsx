'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="section-padding bg-primary text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container-custom mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-5xl block mb-4">🎁</span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            ما تضيعيش هاد <span className="text-gold">العرض</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            أغطية كراسي بجودة عالية، بثمن معقول، مع توصيل مجاني والدفع عند الاستلام.
            أكثر من 5000 عميلة راضية!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/product"
              className="bg-gold text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              اطلبي دابا — الدفع عند الاستلام ✅
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-white/60 text-sm">
            <span>🚚 توصيل مجاني</span>
            <span>💳 الدفع عند الاستلام</span>
            <span>🔄 إرجاع في 7 أيام</span>
            <span>⭐ +5000 عميلة</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
