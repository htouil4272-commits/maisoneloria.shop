'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const shots = [
  {
    src: '/images/photos/lifestyle-bleu-marine.png',
    alt: 'كرسي بغطاء أزرق بحري ميزون إلوريا فصالون عصري',
    titleAr: 'لمسة عصرية',
    captionAr: 'أزرق بحري — لون يعطي عمقاً وأناقة',
    aspect: 'aspect-[4/3]',
    span: 'sm:col-span-2 sm:row-span-2',
  },
  {
    src: '/images/photos/real-blanc-detail.png',
    alt: 'تفصيل قماش ميزون إلوريا الأبيض',
    titleAr: 'القماش',
    captionAr: 'مطاطي بنسج فرنسي 4 اتجاهات',
    aspect: 'aspect-square',
  },
  {
    src: '/images/photos/lifestyle-noir-blanc.png',
    alt: 'كرسيين أسود وأبيض بأغطية ميزون إلوريا — تباين أنيق',
    titleAr: 'تباين كلاسيكي',
    captionAr: 'الأسود والأبيض كيكمّلو بعضياتهم',
    aspect: 'aspect-square',
  },
  {
    src: '/images/photos/real-noir-blanc-pair.png',
    alt: 'كرسيين بغطائي أسود وأبيض جنباً إلى جنب',
    titleAr: 'كرسيان متناسقان',
    captionAr: 'بدّل قماش الكراسي القديمة بأناقة جديدة',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/images/photos/real-marron-blanc-pair.png',
    alt: 'تنسيق بني وأبيض على كرسيين',
    titleAr: 'تنسيق دافئ',
    captionAr: 'البني الترابي يجمع بين الراحة والفخامة',
    aspect: 'aspect-[4/3]',
  },
];

export default function EditorialGallery() {
  return (
    <section className="section-padding bg-cream-dark/30">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-gold/15 text-primary font-bold text-xs tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-3">
            Lookbook
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-3">
            أغطيتنا في بيوت حقيقية ✨
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            صور حقيقية بدون فلاتر — هكا غادي تظهر الكراسي ديالك
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-fr gap-3 sm:gap-4">
          {shots.map((shot, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`photo-card group relative ${shot.span ?? ''}`}
            >
              <div className={`${shot.aspect} relative overflow-hidden`}>
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-gold text-[10px] tracking-[0.3em] uppercase">
                    {shot.titleAr}
                  </p>
                  <p className="text-white font-playfair text-sm sm:text-base font-bold leading-tight mt-0.5">
                    {shot.captionAr}
                  </p>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-gold transition-colors group"
          >
            <span>شوف المجموعة الكاملة</span>
            <span className="transition-transform group-hover:-translate-x-1">←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
