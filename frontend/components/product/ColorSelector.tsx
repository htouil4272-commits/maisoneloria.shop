'use client';

import { COLORS } from '@/lib/constants';
import { ProductColor } from '@/lib/types';

interface ColorSelectorProps {
  selectedColor: ProductColor;
  onSelect: (color: ProductColor) => void;
}

export default function ColorSelector({ selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-primary">اللون: <span className="text-gold">{selectedColor.nameAr}</span></h3>
        <span className="text-sm text-gray-500">{COLORS.length} ألوان متاحة</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all relative ${
              selectedColor.id === color.id
                ? 'border-primary ring-4 ring-primary/20 scale-110'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.nameAr}
            aria-label={color.nameAr}
          >
            {selectedColor.id === color.id && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke={['#F5F5F0', '#FFFDD0', '#D4C5A9'].includes(color.hex) ? '#1B4332' : '#fff'}
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
