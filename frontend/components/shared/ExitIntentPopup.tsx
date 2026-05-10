'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !dismissed) {
      setShow(true);
    }
  }, [dismissed]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const shown = sessionStorage.getItem('exitIntentShown');
    if (shown) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('exitIntentShown', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[70] p-6 text-center"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-3 left-3 p-1 hover:bg-gray-100 rounded-full"
              aria-label="إغلاق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="text-5xl block mb-4">🎁</span>
            <h2 className="font-playfair text-2xl font-bold text-primary mb-2">
              ما تمشيش بلا هدية! 🎉
            </h2>
            <p className="text-gray-600 mb-4">
              استعمل هاد الكود وستفيد من خصم خاص على الطلبية ديالك
            </p>

            <div className="bg-gold/10 rounded-xl py-3 px-4 mb-4">
              <span className="font-mono font-bold text-gold text-2xl tracking-wider">ELORIA15</span>
              <p className="text-xs text-gray-500 mt-1">خصم 15% على الطلبية الأولى</p>
            </div>

            <Link
              href="/product"
              onClick={handleDismiss}
              className="btn-gold w-full block"
            >
              استفد من العرض 🛒
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
