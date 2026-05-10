'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const values = [
  { emoji: '💎', title: 'الجودة أولاً', description: 'كنختارو أفضل الأقمشة لضمان منتج ممتاز يدوم طويلاً.' },
  { emoji: '🤝', title: 'ثقة الزبون', description: 'أكثر من 5000 زبون واثق فينا — رضاك هو أولويتنا.' },
  { emoji: '🇲🇦', title: 'فخر مغربي', description: 'منتج مصمم بحب للبيت المغربي ولكل عائلة مغربية.' },
  { emoji: '♻️', title: 'استدامة', description: 'بدل ما تشري كراسي جداد، جدّد اللي عندك بحل ذكي واقتصادي.' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 60));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            setCount(current);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-bold text-gold font-playfair">
        {count.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

const stats = [
  { target: 5000, suffix: '+', label: 'زبون راضي' },
  { target: 15000, suffix: '+', label: 'طلبية مسلمة' },
  { target: 40, suffix: '+', label: 'مدينة مغربية' },
  { target: 98, suffix: '%', label: 'نسبة الرضا' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <img
          src={IMAGES.moroccanSalon}
          alt="صالون مغربي حقيقي مع أغطية كراسي ميزون إلوريا"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container-custom mx-auto max-w-4xl text-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src="/images/brand/logo-mark.svg"
              alt="Maison Eloria"
              width={96}
              height={96}
              className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6 text-shadow-lg">
              من نحن؟ 🏠
            </h1>
            <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto text-shadow">
              ميزون إلوريا هي علامة مغربية متخصصة فأغطية الكراسي الفاخرة. بدينا من فكرة بسيطة:
              كل عائلة مغربية تستحق دار زوينة بثمن معقول. كنأمنو بلي التجديد ما خاصوش يكون غالي،
              ولهاد الشي قدّمنا حل ذكي — أغطية كراسي أنيقة بجودة عالية كتحوّل أي كرسي لقطعة ديكور فاخرة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-600 leading-relaxed text-lg"
          >
            <h2 className="font-playfair text-3xl font-bold text-primary">قصتنا 📖</h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={IMAGES.lifestyle}
                alt="صالون مغربي أنيق مع أغطية كراسي ميزون إلوريا"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <p>
              بدات القصة ملي لاحظنا بلي بزاف ديال العائلات المغربية بغاو يجددو ديكور دارهم،
              ولكن الميزانية ما كتسمحش. شراء كراسي جداد غالي بزاف، والكراسي القديمة كيبداو يبانو متعبين مع الوقت.
            </p>
            <p>
              هنا جات فكرة ميزون إلوريا — أغطية كراسي بقماش مطاطي ممتاز، سهلة التركيب وسهلة التنظيف،
              بألوان عصرية كتناسب كل ذوق وكل ديكور. والأهم من هادشي، بثمن معقول كيناسب الجميع.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img
                src={IMAGES.packaging}
                alt="تغليف فاخر ومحمي لأغطية ميزون إلوريا"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <p>
              اليوم، أكثر من 5000 زبون مغربي من أكثر من 40 مدينة اختار ميزون إلوريا باش يجدد ديكور داره.
              وحنا كنستمرو فتقديم أحسن جودة بأحسن ثمن، مع خدمة زبائن ممتازة وتوصيل مجاني لجميع المدن.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Customer Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-playfair text-3xl font-bold text-primary mb-4">
              زبائننا كيشهدو 💬
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-gold/30 flex-shrink-0 shadow-lg">
              <img
                src={IMAGES.happyCustomer}
                alt="زبون مغربي راضي مع أغطية كراسي ميزون إلوريا"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-right flex-1">
              <p className="text-lg sm:text-xl text-primary leading-relaxed font-medium mb-3">
                &ldquo;من أحسن الحاجات اللي شريت لداري! الكراسي ولاو كأنهم جداد والضيوف ديالي
                كيسولوني من فين شريتهم. شكراً ميزون إلوريا على الجودة الممتازة!&rdquo;
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-gold">⭐⭐⭐⭐⭐</span>
                <span className="font-bold text-primary">— نورة من مراكش</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <p className="text-center text-white/70 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl font-bold text-primary text-center mb-12"
          >
            القيم ديالنا 💡
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <span className="text-4xl block mb-4">{value.emoji}</span>
                <h3 className="font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
