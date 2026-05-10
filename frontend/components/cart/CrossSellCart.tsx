'use client';

import { COLORS, PACKS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';

export default function CrossSellCart() {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  const existingColorIds = items.map((item) => item.colorId);
  const suggestedColors = COLORS.filter((c) => !existingColorIds.includes(c.id)).slice(0, 3);
  const defaultPack = PACKS[1];

  if (suggestedColors.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h3 className="font-bold text-primary text-sm mb-3">😍 كمّل الطلبية ديالك</h3>
      <div className="grid grid-cols-3 gap-3">
        {suggestedColors.map((color) => (
          <button
            key={color.id}
            onClick={() => addItem(color.id, defaultPack.id)}
            className="text-center group active:scale-95 transition-transform"
          >
            <div
              className="w-full aspect-square rounded-xl mb-1.5 group-hover:ring-2 group-active:ring-2 ring-primary ring-offset-1 transition-all shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-xs font-bold text-primary truncate">{color.nameAr}</p>
            <p className="text-[11px] text-gray-500 font-medium">{formatPrice(defaultPack.price)}</p>
            <p className="text-[10px] text-gold font-bold mt-0.5">+ أضف ←</p>
          </button>
        ))}
      </div>
    </div>
  );
}
