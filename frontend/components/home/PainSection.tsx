'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const pains = [
  {
    emoji: '😰',
    title: 'الكراسي قدامو ومظهرهم مابقاش زوين',
    description: 'مع الوقت الكراسي كيتبدلو وما بقاوش كيزينو الصالون.',
  },
  {
    emoji: '💸',
    title: 'شراء كراسي جداد غالي بزاف',
    description: 'الكراسي الجداد كيكلفو الآلاف، والميزانية ما كتسمحش دائماً.',
  },
  {
    emoji: '🧹',
    title: 'صعيب تنظيفهم من البقع',
    description: 'البقع والأوساخ كيبقاو على الكراسي وما كيتنظفوش بسهولة.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PainSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            واش عندك هاد المشاكل؟ 🤔
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            أغلب العائلات كتعاني من نفس المشاكل... ولكن الحل بسيط 👇
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {pains.map((pain, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-5xl block mb-4">{pain.emoji}</span>
              <h3 className="font-bold text-lg text-primary mb-2">{pain.title}</h3>
              <p className="text-gray-600 text-sm">{pain.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="photo-editorial">
            <img
              src={IMAGES.beforeAfter}
              alt="مقارنة قبل وبعد استعمال أغطية ميزون إلوريا"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 px-6 py-3 rounded-full">
            <span className="text-2xl">👇</span>
            <span className="font-bold text-primary">الحل هو أغطية ميزون إلوريا</span>
            <span className="text-2xl">👇</span>
          </div>
        </motion.div>

        {/* Social Proof Block */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="inline-block bg-green-50 text-green-700 font-bold text-base px-5 py-2.5 rounded-full border border-green-200">
              📸 صور حقيقية من زبائننا
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="photo-editorial"
          >
            <img
              src={IMAGES.transformationGrid}
              alt="صور التحوّل: كرسي قديم مقابل كرسي بغطاء ميزون إلوريا"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-cream rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gold/30 flex-shrink-0 shadow-lg">
              <img
                src={IMAGES.happyCustomer}
                alt="زبون مغربي راضي مع أغطية كراسي ميزون إلوريا"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-center sm:text-right flex-1">
              <p className="text-lg sm:text-xl text-primary leading-relaxed font-medium mb-3">
                &ldquo;والله كنت خايفة نطلب أونلاين، ولكن منين وصلني المنتج فرحت بزاف!
                الجودة ممتازة والألوان حية. الكراسي ديالي ولاو كأنهم جداد. شكراً ميزون إلوريا!&rdquo;
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-gold">⭐⭐⭐⭐⭐</span>
                <span className="font-bold text-primary">— فاطمة من الدار البيضاء</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
