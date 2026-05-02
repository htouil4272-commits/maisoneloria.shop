'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    emoji: '🎨',
    title: 'اختاري اللون والباك',
    description: '9 ألوان أنيقة و3 باكات تناسب احتياجاتك',
  },
  {
    number: '2',
    emoji: '📦',
    title: 'أكدي الطلب',
    description: 'غير الاسم ورقم الهاتف، والدفع عند الاستلام',
  },
  {
    number: '3',
    emoji: '🏠',
    title: 'استمتعي بديكور جديد',
    description: 'التوصيل خلال 24-72 ساعة لباب دارك',
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-4">
            كيفاش تطلبي؟ 🛒
          </h2>
          <p className="text-gray-600">3 خطوات بسيطة وتوصلك السلعة لباب دارك</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 right-[16%] left-[16%] h-0.5 bg-gold/30" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-3xl">{step.emoji}</span>
              </div>
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center -mt-2 mr-8 z-20">
                <span className="text-white font-bold text-sm">{step.number}</span>
              </div>
              <h3 className="font-bold text-lg text-primary mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
