'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const sections = [
  {
    title: 'قماش مطاطي عالي الجودة',
    description: 'الأغطية ديالنا مصنوعة من قماش مطاطي ممتاز كيتمدّ ويتناسب مع أي شكل ديال الكرسي، وكيحافظ على شكلو حتى بعد الاستعمال الطويل.',
    image: IMAGES.fabricCloseup,
    imageAlt: 'تفاصيل القماش المطاطي عالي الجودة',
    color: 'bg-blue-50',
  },
  {
    title: 'سهولة التركيب والتنظيف',
    description: 'دقيقة وحدة بركا باش تركّب الغطاء. وملّي بغيتي تغسلو، غير حطّو فالغسالة على 30 درجة وخلاص!',
    image: IMAGES.easyInstall,
    imageAlt: 'طريقة تركيب سهلة لغطاء الكرسي',
    color: 'bg-green-50',
  },
  {
    title: 'تغليف فاخر ومحمي',
    description: 'الأغطية كيوصلوك فتغليف أنيق ومحمي. كل طلبية كتوصل فحالة ممتازة مع عناية خاصة بالتفاصيل.',
    image: IMAGES.packaging,
    imageAlt: 'تغليف فاخر لأغطية ميزون إلوريا',
    color: 'bg-amber-50',
  },
  {
    title: 'ديكور عصري لصالونك',
    description: 'الأغطية كيحوّلو الكراسي ديالك لقطع ديكور فاخرة. الصالون ديالك غادي يولي أنيق وعصري بلمسة بسيطة.',
    image: IMAGES.lifestyle,
    imageAlt: 'صالون أنيق مع أغطية كراسي ميزون إلوريا',
    color: 'bg-rose-50',
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
              <div className="w-full sm:w-1/3 aspect-square rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="w-full h-full object-cover rounded-xl"
                />
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
