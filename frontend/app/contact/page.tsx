'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, send to API
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212600000000';

  return (
    <section className="section-padding">
      <div className="container-custom mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-4xl font-bold text-primary mb-4">
            اتصل بنا 📞
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            عندك سؤال أو استفسار؟ تواصل معانا وغادي نجاوبوك فأقرب وقت!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <div className="card p-8 text-center">
                <span className="text-6xl block mb-4">✅</span>
                <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
                  شكراً ليك!
                </h2>
                <p className="text-gray-600">
                  الرسالة ديالك وصلاتنا وغادي نتواصلو معاك قريباً إن شاء الله.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">الاسم</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="الاسم الكامل"
                    required
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="06XXXXXXXX"
                    dir="ltr"
                    required
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">الرسالة</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="اكتب رسالتك هنا..."
                    rows={4}
                    required
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  إرسال الرسالة 📩
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h3 className="font-bold text-primary mb-4">معلومات الاتصال</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span>📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p className="font-medium text-primary" dir="ltr">+212 6 00 00 00 00</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span>📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium text-primary">contact@maisoneloria.ma</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span>⏰</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ساعات العمل</p>
                    <p className="font-medium text-primary">الإثنين - السبت: 9h - 18h</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبا، بغيت نستفسر...')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block card p-6 bg-[#25D366]/5 border-2 border-[#25D366]/20 hover:border-[#25D366]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary">تواصل معانا على واتساب</h3>
                  <p className="text-sm text-gray-600">رد سريع ومباشر — 24/7</p>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
