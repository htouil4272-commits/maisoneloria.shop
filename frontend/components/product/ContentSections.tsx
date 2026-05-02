'use client';

import { motion } from 'framer-motion';

const sections = [
  {
    title: 'قماش مطاطي عالي الجودة',
    description: 'الأغطية ديالنا مصنوعين من قماش مطاطي ممتاز كيتمدد ويتناسب مع أي شكل ديال الكرسي. كيحافظ على شكلو حتى بعد الاستعمال الطويل.',
    emoji: '🧵',
    color: 'bg-blue-50',
  },
  {
    title: 'سهولة التركيب والتنظيف',
    description: 'دقيقة واحدة هي اللي كتحتاج باش تركبي الغطاء. وملي بغيتي تغسليه، غير حطيه فالماكينة على 30 درجة وخلاص!',
    emoji: '✨',
    color: 'bg-green-50',
  },
  {
    title: 'حماية دائمة للكراسي',
    description: 'الأغطية كيحميو الكراسي ديالك من البقع، الخدوش، والأوساخ. الكراسي ديالك غادي يبقاو كما هوما جداد.',
    emoji: '🛡️',
    color: 'bg-amber-50',
  },
];

export default function ContentSections() {
  return (
    <section className="section-padding">
      <div className="container-custom mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-3xl font-bold text-primary text-center mb-12"
        >
          علاش أغطية ميزون إلوريا؟ 💎
        </motion.h2>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${section.color} rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 ${
                i % 2 === 1 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Image placeholder */}
              <div className="w-full sm:w-1/3 aspect-square rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
                <span className="text-7xl">{section.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-primary mb-3">{section.title}</h3>
                <p className="text-gray-600 leading-relaxed">{section.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
