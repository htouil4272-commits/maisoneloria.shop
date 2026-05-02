'use client';

import { motion } from 'framer-motion';
import { TRUST_BADGES } from '@/lib/constants';

export default function TrustBadges() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-primary/5 rounded-2xl"
            >
              <span className="text-4xl block mb-3">{badge.icon}</span>
              <h3 className="font-bold text-primary mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
