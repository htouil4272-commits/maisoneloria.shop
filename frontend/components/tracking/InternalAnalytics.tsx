'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';

export default function InternalAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    // Only track page view on route changes or initial load
    if (pathname && !pathname.startsWith('/admin')) {
      trackEvent('PageView', { path: pathname, search: searchParams?.toString() });
    }
  }, [pathname, searchParams]);

  return null;
}
