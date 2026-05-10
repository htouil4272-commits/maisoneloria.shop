'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { NAV_LINKS } from '@/lib/constants';
import MobileMenu from './MobileMenu';

function normalizePathname(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Maison Eloria — الرئيسية">
      <img
        src="/images/brand/logo-mark.svg"
        alt="Maison Eloria"
        width={40}
        height={40}
        className="w-10 h-10 select-none"
        draggable={false}
      />
      <div className="hidden sm:block leading-tight">
        <span className="font-playfair text-primary font-bold text-lg block tracking-wide">
          Maison Eloria
        </span>
        <span className="text-[10px] text-gold/90 tracking-[0.25em] uppercase block">
          ميزون إلوريا
        </span>
      </div>
    </Link>
  );
}

function CartIcon() {
  const openCart = useCartStore((s) => s.openCart);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const count = getItemCount();

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-primary/5 rounded-xl transition-colors"
      aria-label="سلة التسوق"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-primary"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -left-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = normalizePathname(pathname);

  return (
    <header className="sticky top-0 z-[100] bg-cream/95 backdrop-blur-md border-b border-primary/10">
      <div className="container-custom mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - right side in RTL */}
        <Logo />

        {/* Nav - center (desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active = normalizePathname(link.href) === currentPath;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium text-sm transition-colors px-1 py-1 ${
                  active
                    ? 'text-primary font-bold'
                    : 'text-primary/65 hover:text-primary'
                }`}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-full bg-gradient-to-r from-gold to-gold-dark"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cart + Hamburger - left side in RTL */}
        <div className="flex items-center gap-2">
          <CartIcon />
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 hover:bg-primary/5 rounded-xl transition-colors"
            aria-label="القائمة"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentPath={currentPath}
      />
    </header>
  );
}
