'use client';

import { PACKS } from '@/lib/constants';
import { Pack } from '@/lib/types';
import { formatPrice, calculateDiscount, formatUnitPrice } from '@/lib/utils';

interface PackSelectorProps {
  selectedPack: Pack;
  onSelect: (pack: Pack) => void;
}

export default function PackSelector({ selectedPack, onSelect }: PackSelectorProps) {
  return (
    <div>
      <h3 className="font-bold text-primary mb-3">اختار الباك:</h3>
      <div className="space-y-3">
        {PACKS.map((pack) => {
          const isSelected = selectedPack.id === pack.id;
          const discount = calculateDiscount(pack.originalPrice, pack.price);
          const isPopular = pack.id === 'pack-6';
          const isBestValue = pack.id === 'pack-8';

          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack)}
              className={`w-full text-right p-4 rounded-xl border-2 transition-all relative ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/10'
                  : 'border-gray-200 hover:border-primary/30'
              }`}
            >
              {pack.badgeAr && (
                <span
                  className={`absolute -top-4 left-4 whitespace-nowrap z-10 ${
                    isPopular ? 'badge-popular' : 'badge-value'
                  }`}
                >
                  {pack.badgeAr}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{pack.labelAr}</p>
                    <p className="text-xs text-gray-500">
                      {formatUnitPrice(pack.price, pack.quantity)} درهم / القطعة
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="line-through text-gray-400 text-sm">
                    {formatPrice(pack.originalPrice)}
                  </p>
                  <p className="font-bold text-primary text-lg">{formatPrice(pack.price)}</p>
                  <p className="text-xs text-green-600 font-bold">وفّر {discount}%</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
