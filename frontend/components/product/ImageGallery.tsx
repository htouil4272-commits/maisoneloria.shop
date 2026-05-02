'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductColor } from '@/lib/types';

interface ImageGalleryProps {
  selectedColor: ProductColor;
}

export default function ImageGallery({ selectedColor }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 4 image slots per color
  const images = [
    { label: 'صورة المنتوج الرئيسية', aspect: 'aspect-square' },
    { label: 'صورة جانبية', aspect: 'aspect-square' },
    { label: 'صورة على الكرسي', aspect: 'aspect-square' },
    { label: 'تفاصيل القماش', aspect: 'aspect-square' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedColor.id}-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="aspect-square rounded-2xl overflow-hidden relative"
          style={{ backgroundColor: selectedColor.hex }}
        >
          {/* Replace with real product image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl block mb-2">🪑</span>
              <p className="text-sm font-medium" style={{
                color: ['#F5F5F0', '#FFFDD0', '#D4C5A9'].includes(selectedColor.hex) ? '#333' : '#fff'
              }}>
                {images[activeIndex].label}
              </p>
              <p className="text-xs mt-1" style={{
                color: ['#F5F5F0', '#FFFDD0', '#D4C5A9'].includes(selectedColor.hex) ? '#666' : '#ffffff99'
              }}>
                {selectedColor.nameAr} — 800×800
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
            }`}
            style={{ backgroundColor: selectedColor.hex }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg">🪑</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
