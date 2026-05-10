'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { COLORS } from '@/lib/constants';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const colorImage = COLORS.find((c) => c.id === item.colorId)?.image;

  return (
    <div className="flex gap-3 bg-cream rounded-xl p-3">
      <div className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-gray-100">
        {colorImage ? (
          <img
            src={colorImage}
            alt={`غطاء كرسي لون ${item.colorNameAr}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: item.colorHex }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-primary text-sm truncate">
              أغطية كراسي — {item.colorNameAr}
            </p>
            <p className="text-xs text-gray-500">
              باك {item.packQuantity} قطع
            </p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="حذف"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg transition-colors"
              aria-label="تنقيص"
            >
              −
            </button>
            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg transition-colors"
              aria-label="زيادة"
            >
              +
            </button>
          </div>

          <span className="font-bold text-primary text-sm">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
