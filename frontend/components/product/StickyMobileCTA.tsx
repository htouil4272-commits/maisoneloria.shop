'use client';

import { Pack } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';

interface StickyMobileCTAProps {
  selectedColorId: string;
  selectedPack: Pack;
}

export default function StickyMobileCTA({ selectedColorId, selectedPack }: StickyMobileCTAProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(selectedColorId, selectedPack.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 p-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-primary text-lg">{formatPrice(selectedPack.price)}</p>
          <p className="text-xs text-gray-500 line-through">{formatPrice(selectedPack.originalPrice)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-gold text-white font-bold py-3 px-6 rounded-xl hover:bg-gold-dark transition-all active:scale-[0.98] shadow-lg"
        >
          أضيفي للسلة 🛒
        </button>
      </div>
    </div>
  );
}
