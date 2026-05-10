'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const comparisons = [
  { feature: 'الثمن', us: 'ابتداءً من 250 درهم للباك', them: '+1000 درهم لكرسي واحد' },
  { feature: 'التركيب', us: 'سهل وسريع — دقيقة واحدة', them: 'كتحتاج تقنيين' },
  { feature: 'التنظيف', us: 'كتتغسل فالماكينة', them: 'تنظيف متخصص وغالي' },
  { feature: 'التنوع', us: '9 ألوان للاختيار', them: 'ألوان محدودة' },
  { feature: 'التوصيل', us: 'مجاني لجميع المدن', them: 'توصيل مدفوع' },
  { feature: 'الإرجاع', us: '7 أيام للإرجاع', them: 'بلا إرجاع' },
];

export default function ComparisonTable() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            علاش ميزون إلوريا؟ 🏆
          </h2>
          <p className="text-gray-600">قارن بين أغطية ميزون إلوريا وشراء كراسي جداد</p>
        </motion.div>

        {/* Quality Comparison Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="photo-editorial">
            <img
              src={IMAGES.qualityComparison}
              alt="القماش ديال ميزون إلوريا — تفصيل وأناقة"
              className="w-full h-auto block"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-4 text-lg sm:text-xl font-bold text-primary"
          >
            القماش ديالنا مختلف — ما كيتقارنش مع اللي كاين فالسوق
          </motion.p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-gray-200"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-4 px-4 text-right font-bold">المقارنة</th>
                <th className="py-4 px-4 text-center font-bold">
                  <span className="text-gold">ميزون إلوريا ✓</span>
                </th>
                <th className="py-4 px-4 text-center font-bold text-white/70">كراسي جداد ✗</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-cream/50' : 'bg-white'}>
                  <td className="py-3 px-4 font-medium text-primary text-sm">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-sm text-green-700 bg-green-50/30">
                    ✅ {row.us}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-red-600/70">
                    ❌ {row.them}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
