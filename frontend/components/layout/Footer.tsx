'use client';

import Link from 'next/link';
import { SITE_NAME_AR } from '@/lib/constants';
import {
  PHONE_DISPLAY_NATIONAL,
  CONTACT_EMAIL,
} from '@/lib/site-contact';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/brand/logo-mark.svg"
                alt="Maison Eloria"
                width={56}
                height={56}
                className="w-14 h-14"
              />
              <div>
                <span className="font-playfair font-bold text-lg block">Maison Eloria</span>
                <span className="text-xs text-gold/80 tracking-[0.2em] block">{SITE_NAME_AR}</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              أغطية كراسي فاخرة بجودة عالية — كنحوّلو الكراسي ديالك لقطع ديكور أنيقة بثمن معقول.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">الرئيسية</Link></li>
              <li><Link href="/collection" className="text-white/70 hover:text-white transition-colors text-sm">المجموعة</Link></li>
              <li><Link href="/product" className="text-white/70 hover:text-white transition-colors text-sm">المنتج</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">من نحن</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-gold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2">
              <li className="text-white/70 text-sm">
                📞 <span dir="ltr">{PHONE_DISPLAY_NATIONAL}</span>
              </li>
              <li className="text-white/70 text-sm">📧 {CONTACT_EMAIL}</li>
              <li className="text-white/70 text-sm">⏰ من الإثنين إلى السبت: 9h - 18h</li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="font-bold text-gold mb-4">ضماناتنا</h4>
            <ul className="space-y-2">
              <li className="text-white/70 text-sm flex items-center gap-2">
                <span>🚚</span> توصيل مجاني
              </li>
              <li className="text-white/70 text-sm flex items-center gap-2">
                <span>💳</span> الدفع عند الاستلام
              </li>
              <li className="text-white/70 text-sm flex items-center gap-2">
                <span>🔄</span> إرجاع في 7 أيام
              </li>
              <li className="text-white/70 text-sm flex items-center gap-2">
                <span>✅</span> جودة مضمونة
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Maison Eloria. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
