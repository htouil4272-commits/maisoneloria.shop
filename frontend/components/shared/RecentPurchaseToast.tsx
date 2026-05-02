'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOROCCAN_CITIES, COLORS } from '@/lib/constants';
import { getRandomCity, getRandomInt } from '@/lib/utils';

const names = [
  'فاطمة', 'أمينة', 'نورة', 'سعاد', 'خديجة', 'مريم', 'حنان', 'سناء',
  'ليلى', 'زينب', 'رشيدة', 'نادية', 'عائشة', 'سلمى', 'إيمان',
];

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function RecentPurchaseToast() {
  const [toast, setToast] = useState<{
    name: string;
    city: string;
    color: string;
    colorHex: string;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    const showToast = () => {
      const color = getRandomColor();
      setToast({
        name: getRandomName(),
        city: getRandomCity(MOROCCAN_CITIES),
        color: color.nameAr,
        colorHex: color.hex,
        minutes: getRandomInt(1, 15),
      });
      setTimeout(() => setToast(null), 4000);
    };

    // First toast after 8 seconds
    const initialTimer = setTimeout(showToast, 8000);

    // Recurring toasts every 15-30 seconds
    const interval = setInterval(showToast, getRandomInt(15000, 30000));

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 right-4 z-40 bg-white rounded-xl shadow-xl p-4 max-w-xs border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0"
              style={{ backgroundColor: toast.colorHex }}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary truncate">
                {toast.name} من {toast.city}
              </p>
              <p className="text-xs text-gray-500">
                طلبات أغطية كراسي — {toast.color}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                قبل {toast.minutes} دقائق
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
