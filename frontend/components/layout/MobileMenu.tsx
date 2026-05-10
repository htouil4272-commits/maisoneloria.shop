'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';
import { WHATSAPP_NUMBER } from '@/lib/site-contact';

function normalizePathname(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export default function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    const prevPos = document.body.style.position;
    const prevTop = document.body.style.top;
    const scrollY = window.scrollY;

    // iOS Safari fix: position:fixed is required to prevent background scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = prev;
      document.body.style.position = prevPos;
      document.body.style.top = prevTop;
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-[120] min-h-[100dvh] w-screen overflow-y-auto bg-cream shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الرئيسية"
          >
            <div className="min-h-[100dvh] p-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))]">
              <div className="flex items-center justify-between border-b border-primary/10 pb-5 mb-6">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/brand/logo-mark.svg"
                    alt="Maison Eloria"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div className="leading-tight">
                    <span className="font-playfair text-primary font-bold text-lg block">
                      Maison Eloria
                    </span>
                    <span className="text-[10px] text-gold tracking-[0.2em] block">
                      ميزون إلوريا
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary/5 rounded-xl transition-colors"
                  aria-label="إغلاق"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-primary"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-3">
                {NAV_LINKS.map((link) => {
                  const active = normalizePathname(link.href) === currentPath;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`block py-4 px-4 rounded-2xl transition-colors text-lg ${
                        active
                          ? 'bg-gold/15 text-primary font-bold border-e-4 border-gold shadow-sm'
                          : 'bg-white text-primary font-medium hover:bg-primary/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 p-5 bg-primary/5 rounded-2xl">
                <p className="text-sm text-primary/70 mb-2">تواصل معانا</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary font-medium"
                >
                  <span className="text-xl">💬</span>
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
