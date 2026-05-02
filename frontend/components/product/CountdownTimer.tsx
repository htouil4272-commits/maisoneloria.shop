'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
      <p className="text-red-600 font-bold text-sm mb-2">🔥 العرض ينتهي في:</p>
      <div className="flex justify-center items-center gap-2" dir="ltr">
        <div className="countdown-digit">{pad(time.hours)}</div>
        <span className="text-red-500 font-bold text-xl">:</span>
        <div className="countdown-digit">{pad(time.minutes)}</div>
        <span className="text-red-500 font-bold text-xl">:</span>
        <div className="countdown-digit">{pad(time.seconds)}</div>
      </div>
      <div className="flex justify-center gap-8 mt-1 text-xs text-gray-500" dir="ltr">
        <span>ساعة</span>
        <span>دقيقة</span>
        <span>ثانية</span>
      </div>
    </div>
  );
}
