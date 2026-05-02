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
      <h3 className="font-bold text-primary text-sm mb-3">😍 كمّلي الطلبية ديالك</h3>
      <div className="grid grid-cols-3 gap-2">
        {suggestedColors.map((color) => (
          <button
            key={color.id}
            onClick={() => addItem(color.id, defaultPack.id)}
            className="text-center group"
          >
            <div
              className="aspect-square rounded-xl mb-1 group-hover:ring-2 ring-primary transition-all"
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-[10px] font-medium text-primary truncate">{color.nameAr}</p>
            <p className="text-[10px] text-gray-500">{formatPrice(defaultPack.price)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
