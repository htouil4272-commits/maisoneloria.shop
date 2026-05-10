'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './types';
import { COLORS, PACKS } from './constants';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (colorId: string, packId: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckoutOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      addItem: (colorId: string, packId: string) => {
        const color = COLORS.find((c) => c.id === colorId);
        const pack = PACKS.find((p) => p.id === packId);
        if (!color || !pack) return;

        const itemId = `${colorId}-${packId}`;
        const items = get().items;
        const existing = items.find((item) => item.id === itemId);

        if (existing) {
          set({
            items: items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: itemId,
                colorId: color.id,
                colorName: color.name,
                colorNameAr: color.nameAr,
                colorHex: color.hex,
                packId: pack.id,
                packQuantity: pack.quantity,
                price: pack.price,
                quantity: 1,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const raw = get().items.reduce((total, item) => total + item.price * item.quantity, 0);
        return Math.round(raw * 100) / 100;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'maison-eloria-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
