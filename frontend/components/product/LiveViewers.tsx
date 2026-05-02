'use client';

import { useState, useEffect } from 'react';
import { getRandomInt } from '@/lib/utils';

export default function LiveViewers() {
  const [viewers, setViewers] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(getRandomInt(25, 65));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      <span className="text-gray-600">
        <span className="font-bold text-primary">{viewers}</span> شخص كيشوفو هاد المنتوج دابا
      </span>
    </div>
  );
}
