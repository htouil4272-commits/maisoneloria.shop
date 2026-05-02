'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const values = [
  { emoji: '💎', title: 'الجودة أولاً', description: 'كنختارو أفضل الأقمشة لضمان منتوج ممتاز يدوم طويلاً.' },
  { emoji: '🤝', title: 'ثقة العميلة', description: 'أكثر من 5000 عميلة واثقة فينا — رضاك هو أولويتنا.' },
  { emoji: '🇲🇦', title: 'فخر مغربي', description: 'منتوج مصمم بحب للبيت المغربي ولكل سيدة مغربية.' },
  { emoji: '♻️', title: 'استدامة', description: 'بدل ما تشريي كراسي جداد، جددي اللي عندك بحل ذكي واقتصادي.' },
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
  { target: 5000, suffix: '+', label: 'عميلة راضية' },
  { target: 15000, suffix: '+', label: 'طلبية مسلمة' },
  { target: 40, suffix: '+', label: 'مدينة مغربية' },
  { target: 98, suffix: '%', label: 'نسبة الرضا' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-bl from-cream via-cream to-primary/5">
        <div className="container-custom mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-gold font-playfair font-bold text-3xl">M</span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-primary mb-6">
              من نحن؟ 🏠
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              ميزون إلوريا هي علامة مغربية متخصصة فأغطية الكراسي الفاخرة. بدينا من فكرة بسيطة: 
              كل سيدة مغربية تستحق دار زوينة بثمن معقول. حنا كنأمنو بلي التجديد ما خاصوش يكون غالي، 
              ولهادشي قدمنا حل ذكي — أغطية كراسي أنيقة بجودة عالية كتحول أي كرسي لقطعة ديكور فاخرة.
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
            <p>
              بدات القصة ملي لاحظنا بلي بزاف ديال السيدات كيبغيو يجددو الديكور ديال الدار ديالهم، 
              ولكن الميزانية ما كتسمحش. شراء كراسي جداد غالي بزاف، والكراسي القديمة كيبداو يبانو قدام مع الوقت.
            </p>
            <p>
              هنا جات فكرة ميزون إلوريا — أغطية كراسي بقماش مطاطي ممتاز، سهلة التركيب وسهلة التنظيف، 
              بألوان عصرية تناسب كل ذوق وكل ديكور. والأهم من هادشي، بثمن معقول يناسب الجميع.
            </p>
            <p>
              اليوم، أكثر من 5000 عميلة مغربية فاقت من 40 مدينة اختارو ميزون إلوريا باش يجددو ديكور ديارهم. 
              وحنا كنستمرو فتقديم أفضل جودة بأفضل ثمن، مع خدمة عملاء ممتازة وتوصيل مجاني لكل المدن.
            </p>
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
