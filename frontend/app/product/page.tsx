'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COLORS, PACKS, TRUST_BADGES } from '@/lib/constants';
import { formatPrice, formatUnitPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import { trackEvent } from '@/lib/tracking';
import { ProductColor, Pack } from '@/lib/types';
import ImageGallery from '@/components/product/ImageGallery';
import ColorSelector from '@/components/product/ColorSelector';
import PackSelector from '@/components/product/PackSelector';
import CountdownTimer from '@/components/product/CountdownTimer';
import LiveViewers from '@/components/product/LiveViewers';
import StickyMobileCTA from '@/components/product/StickyMobileCTA';
import ContentSections from '@/components/product/ContentSections';
import ProductReviews from '@/components/product/ProductReviews';
import CrossSells from '@/components/product/CrossSells';

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(COLORS[0]);
  const [selectedPack, setSelectedPack] = useState<Pack>(PACKS[1]); // Default: Pack 6
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: 'أغطية كراسي فاخرة - ميزون إلوريا',
      content_ids: [COLORS[0].id],
      content_type: 'product',
      value: PACKS[1].price,
      currency: 'MAD',
    });
  }, []);

  const handleAddToCart = () => {
    addItem(selectedColor.id, selectedPack.id);
    trackEvent('AddToCart', {
      content_name: `أغطية كراسي - ${selectedColor.nameAr}`,
      content_ids: [selectedColor.id],
      value: selectedPack.price,
      currency: 'MAD',
      num_items: selectedPack.quantity,
    });
  };

  return (
    <>
      <section className="section-padding pb-8">
        <div className="container-custom mx-auto product-zone py-6 sm:py-8 px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ImageGallery selectedColor={selectedColor} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5 text-gold">
                    {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                  </div>
                  <span className="text-sm text-gray-500">(+5000 تقييم)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="product-dots" aria-hidden>
                    ···
                  </span>
                  <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-primary">
                    أغطية كراسي فاخرة
                  </h1>
                  <span className="product-dots" aria-hidden>
                    ···
                  </span>
                </div>
                <p className="text-gray-600 mt-2">
                  قماش مطاطي عالي الجودة — كيتناسب مع جميع الكراسي
                </p>
              </div>

              {/* Price */}
              <div className="bg-cream-dark rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(selectedPack.price)}
                  </span>
                  <span className="line-through text-gray-400 text-lg">
                    {formatPrice(selectedPack.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    وفّر {formatPrice(selectedPack.originalPrice - selectedPack.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatUnitPrice(selectedPack.price, selectedPack.quantity)} درهم / القطعة
                </p>
              </div>

              {/* Color Selector */}
              <ColorSelector selectedColor={selectedColor} onSelect={setSelectedColor} />

              {/* Pack Selector */}
              <PackSelector selectedPack={selectedPack} onSelect={setSelectedPack} />

              {/* Countdown */}
              <CountdownTimer />

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gold text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl active:scale-[0.98] relative pulse-ring"
              >
                أضف للسلة — {formatPrice(selectedPack.price)} 🛒
              </button>

              {/* COD Badge */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-800 font-bold text-sm">
                  ✅ الدفع عند الاستلام — ما تخلص حتى توصلك السلعة فيدك
                </p>
              </div>

              {/* Live Viewers */}
              <LiveViewers />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                {TRUST_BADGES.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-primary/5 rounded-lg p-3">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-primary">{badge.title}</p>
                      <p className="text-[10px] text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ContentSections />
      <ProductReviews />
      <CrossSells />

      {/* مساحة آمنة في أسفل الصفحة لئلا يُحجب آخر محتوى تحت الزر العائم على الموبايل */}
      <div className="h-24 lg:hidden" aria-hidden="true" />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA selectedColorId={selectedColor.id} selectedPack={selectedPack} />
    </>
  );
}
