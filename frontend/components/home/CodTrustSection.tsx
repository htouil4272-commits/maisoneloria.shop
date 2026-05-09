'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/constants';

const trustPoints = [
  'ما تخلص حتى تشوف المنتج فيدك',
  'توصيل مجاني لجميع المدن المغربية',
  'تغليف فاخر يليق بالهدية',
  'إرجاع مجاني خلال 7 أيام إلا ما عجبكش',
];

export default function CodTrustSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-green-50/60 to-white">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-3">
            ادفع عند الاستلام — بلا أي مخاطرة
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            شوف المنتج فيدك أول، ومن بعد خلص — هكا غادي تشري بكل ثقة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="photo-editorial"
          >
            <img
              src={IMAGES.codDelivery}
              alt="صندوق ميزون إلوريا كيوصل عند باب الدار — الدفع عند الاستلام"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {trustPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-md border border-green-100"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">✅</span>
                <span className="text-lg font-bold text-primary">{point}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-primary text-white border-2 border-gold rounded-2xl p-5 text-center mt-6 shadow-lg"
            >
              <p className="text-lg font-bold text-gold">
                💳 الدفع عند الاستلام — الطريقة الوحيدة والآمنة
              </p>
              <p className="text-sm text-white/85 mt-1">
                ما كنطلبو منك حتى معلومات بنكية — كنقبضو الفلوس فقط منين توصلك السلعة
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
