'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateMoroccanPhone } from '@/lib/utils';
import { formatApiErrorBody } from '@/lib/http-errors';
import {
  PHONE_DISPLAY_INTERNATIONAL,
  PHONE_DISPLAY_NATIONAL,
  CONTACT_EMAIL,
} from '@/lib/site-contact';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (form.name.trim().length < 3) {
      newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    }
    if (!validateMoroccanPhone(form.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح (مثال: 06XXXXXXXX أو 07XXXXXXXX — المغرب +212)';
    }
    const msg = form.message.trim();
    if (!msg) {
      newErrors.message = 'الرسالة مطلوبة';
    } else if (msg.length < 5) {
      newErrors.message = 'الرسالة يجب أن تكون 5 أحرف على الأقل';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(formatApiErrorBody(data, 'حدث خطأ أثناء إرسال الرسالة'));
      }

      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع. حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

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
                {apiError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl py-3 px-4 text-sm">
                    {apiError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">الاسم</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((prev) => ({ ...prev, name: undefined })); }}
                    placeholder="الاسم الكامل"
                    required
                    className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                    placeholder="06XXXXXXXX"
                    dir="ltr"
                    required
                    className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">الرسالة</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors((prev) => ({ ...prev, message: undefined })); }}
                    placeholder="اكتب رسالتك هنا..."
                    rows={4}
                    required
                    className={`w-full border rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة 📩'}
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
                    <p className="text-sm text-gray-500">الهاتف (المغرب +212)</p>
                    <p className="font-medium text-primary" dir="ltr">
                      {PHONE_DISPLAY_NATIONAL}
                    </p>
                    <p className="font-medium text-primary/80 text-sm" dir="ltr">
                      {PHONE_DISPLAY_INTERNATIONAL}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span>📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium text-primary hover:text-gold transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
