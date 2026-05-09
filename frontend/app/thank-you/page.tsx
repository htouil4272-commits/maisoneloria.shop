'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CartItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/site-contact';
import { trackEvent } from '@/lib/tracking';

export default function ThankYouPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const total = Number(sessionStorage.getItem('orderTotal')) || 0;
      const name = sessionStorage.getItem('orderName') || '';
      const orderNum = sessionStorage.getItem('orderNumber') || 'ME-XXXXX';
      let parsedItems: CartItem[] = [];
      try {
        parsedItems = JSON.parse(sessionStorage.getItem('orderItems') || '[]');
      } catch {}

      setOrderNumber(orderNum);
      setOrderTotal(total);
      setCustomerName(name);
      setOrderItems(parsedItems);

      if (total > 0 && !sessionStorage.getItem('purchaseTracked')) {
        sessionStorage.setItem('purchaseTracked', '1');
        trackEvent('Purchase', {
          value: total,
          currency: 'MAD',
          num_items: parsedItems.length,
          content_ids: parsedItems.map((i: CartItem) => i.colorId),
          content_type: 'product',
        });
      }
    }
  }, []);

  const discountCode = 'ELORIA10';

  return (
    <section className="section-padding min-h-[70vh]">
      <div className="container-custom mx-auto max-w-2xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-5xl"
            >
              ✅
            </motion.span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-playfair text-3xl sm:text-4xl font-bold text-primary mb-2"
          >
            شكراً {customerName}! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg"
          >
            الطلبية ديالك تسجلات بنجاح
          </motion.p>
        </motion.div>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6 mb-6"
        >
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">رقم الطلبية</p>
            <p className="font-bold text-primary text-2xl font-mono" dir="ltr">{orderNumber}</p>
          </div>

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-primary text-sm mb-3">تفاصيل الطلبية</h3>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.colorHex }}
                      />
                      <span>{item.colorNameAr} — باك {item.packQuantity}</span>
                    </div>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold text-primary">المجموع:</span>
                <span className="font-bold text-primary text-lg">{formatPrice(orderTotal)}</span>
              </div>
              <p className="text-xs text-green-600 text-center mt-2">🚚 توصيل مجاني</p>
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6 mb-6"
        >
          <h3 className="font-bold text-primary mb-4">📋 الخطوات التالية</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium text-primary text-sm">تأكيد الطلبية</p>
                <p className="text-xs text-gray-500">غادي نتصلو بيك فأقرب وقت لتأكيد الطلبية</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium text-primary text-sm">تحضير الطلبية</p>
                <p className="text-xs text-gray-500">غادي نحضرو ليك الطلبية بعناية</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium text-primary text-sm">التوصيل خلال 24-72 ساعة</p>
                <p className="text-xs text-gray-500">الطلبية غادي توصلك لباب الدار والدفع عند الاستلام</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Discount Code Cross-sell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gold/10 border-2 border-gold/30 rounded-2xl p-6 text-center mb-6"
        >
          <span className="text-3xl block mb-2">🎁</span>
          <h3 className="font-bold text-primary text-lg mb-2">هدية ليك!</h3>
          <p className="text-gray-600 text-sm mb-3">
            استعمل هاد الكود باش تستفيد من خصم 10% على الطلبية الجاية
          </p>
          <div className="bg-white rounded-xl py-3 px-6 inline-block">
            <span className="font-mono font-bold text-gold text-2xl tracking-wider">{discountCode}</span>
          </div>
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-600 text-sm">شارك التجربة ديالك مع صحابك 💕</p>
          <div className="flex justify-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('طلبت أغطية كراسي من ميزون إلوريا وعجبوني بزاف! 😍 شوفهم: https://maisoneloria.shop')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              واتساب 💬
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://maisoneloria.shop`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1877F2] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              فيسبوك 📘
            </a>
          </div>

          <Link href="/" className="btn-outline inline-block mt-4">
            ← الرجوع للرئيسية
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
