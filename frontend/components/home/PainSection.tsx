'use client';

import { motion } from 'framer-motion';

const pains = [
  {
    emoji: '😰',
    title: 'الكراسي قدمو وولاو قباح',
    description: 'مع الوقت الكراسي كيتبدلو وكيولو ما كيزينوش الصالون.',
  },
  {
    emoji: '💸',
    title: 'شراء كراسي جداد غالي بزاف',
    description: 'الكراسي الجداد كيكلفو بزاف والميزانية ما كتسمحش.',
  },
  {
    emoji: '🧹',
    title: 'صعيب تنظفيهم من البقع',
    description: 'البقع والأوساخ كيخليو الكراسي يبانو قدام وما كيتنظفوش بسهولة.',
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
            أغلب السيدات كيعانيو من نفس المشكل... ولكن الحل بسيط!
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
      </div>
    </section>
  );
}
