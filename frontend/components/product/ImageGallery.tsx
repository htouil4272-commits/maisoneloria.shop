'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductColor } from '@/lib/types';
import { IMAGES } from '@/lib/constants';

interface ImageGalleryProps {
  selectedColor: ProductColor;
}

export default function ImageGallery({ selectedColor }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    {
      src: selectedColor.image,
      alt: `غطاء كرسي لون ${selectedColor.nameAr}`,
      pos: selectedColor.imagePosition || 'center',
    },
    { src: IMAGES.moroccanSalon, alt: 'أغطية كراسي ميزون إلوريا في صالون مغربي', pos: 'center' },
    { src: IMAGES.transformationGrid, alt: 'صور التحوّل قبل وبعد أغطية ميزون إلوريا', pos: 'center' },
    { src: IMAGES.fabricCloseup, alt: 'تفاصيل القماش المطاطي عالي الجودة', pos: 'center' },
    { src: IMAGES.easyInstall, alt: 'طريقة تركيب الغطاء على الكرسي', pos: 'center' },
    { src: IMAGES.packaging, alt: 'تغليف فاخر لأغطية ميزون إلوريا', pos: 'center' },
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
          className="aspect-square photo-editorial bg-cream-dark/30"
        >
          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            className="w-full h-full object-cover"
            style={{ objectPosition: images[activeIndex].pos }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === i ? 'border-gold ring-2 ring-gold/30' : 'border-transparent hover:border-gold/40'
            }`}
            aria-label={img.alt}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: img.pos }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
