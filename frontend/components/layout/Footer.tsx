'use client';

import Link from 'next/link';
import { SITE_NAME_AR } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom mx-auto section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-playfair font-bold text-xl">M</span>
              </div>
              <div>
                <span className="font-playfair font-bold text-lg block">Maison Eloria</span>
                <span className="text-xs text-white/60 block">{SITE_NAME_AR}</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              أغطية كراسي فاخرة بجودة عالية. نحولو الكراسي ديالك لقطع ديكور أنيقة.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">الرئيسية</Link></li>
              <li><Link href="/collection" className="text-white/70 hover:text-white transition-colors text-sm">المجموعة</Link></li>
              <li><Link href="/product" className="text-white/70 hover:text-white transition-colors text-sm">المنتوج</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">من نحن</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-gold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2">
              <li className="text-white/70 text-sm">📞 +212 6 00 00 00 00</li>
              <li className="text-white/70 text-sm">📧 contact@maisoneloria.ma</li>
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
