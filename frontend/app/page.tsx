'use client';

import Hero from '@/components/home/Hero';
import PainSection from '@/components/home/PainSection';
import ProductShowcase from '@/components/home/ProductShowcase';
import EditorialGallery from '@/components/home/EditorialGallery';
import OffersSection from '@/components/home/OffersSection';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import TrustBadges from '@/components/home/TrustBadges';
import HowItWorks from '@/components/home/HowItWorks';
import ComparisonTable from '@/components/home/ComparisonTable';
import CodTrustSection from '@/components/home/CodTrustSection';
import FAQ from '@/components/home/FAQ';
import FinalCTA from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PainSection />
      <ProductShowcase />
      <EditorialGallery />
      <OffersSection />
      <CodTrustSection />
      <ReviewsCarousel />
      <TrustBadges />
      <HowItWorks />
      <ComparisonTable />
      <FAQ />
      <FinalCTA />
    </>
  );
}
