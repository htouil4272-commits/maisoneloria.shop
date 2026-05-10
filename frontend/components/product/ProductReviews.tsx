'use client';

import { motion } from 'framer-motion';
import { REVIEWS } from '@/lib/constants';

export default function ProductReviews() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-2">
            آراء زبائننا 💬
          </h2>
          <div className="flex justify-center items-center gap-1 text-gold text-xl">
            {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
          </div>
          <p className="text-sm text-gray-500 mt-1">4.9/5 — +5000 تقييم</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-cream rounded-xl p-5"
            >
              <div className="flex gap-1 text-gold text-sm mb-2">
                {[...Array(review.rating)].map((_, j) => <span key={j}>★</span>)}
              </div>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
