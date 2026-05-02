'use client';

import { generateEventId } from './utils';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    snaptr?: (...args: unknown[]) => void;
  }
}

type TrackingEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';

interface TrackingParams {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: unknown;
}

export function trackEvent(event: TrackingEvent, params: TrackingParams = {}): string {
  const eventId = generateEventId();
  const enrichedParams = { ...params, event_id: eventId };

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', event, enrichedParams, { eventID: eventId });
    } catch {}
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq) {
    try {
      const ttEvent = event === 'InitiateCheckout' ? 'InitiateCheckout' : event;
      window.ttq.track(ttEvent, enrichedParams);
    } catch {}
  }

  // Snapchat Pixel
  if (typeof window !== 'undefined' && window.snaptr) {
    try {
      const snapEventMap: Record<string, string> = {
        PageView: 'PAGE_VIEW',
        ViewContent: 'VIEW_CONTENT',
        AddToCart: 'ADD_CART',
        InitiateCheckout: 'START_CHECKOUT',
        Purchase: 'PURCHASE',
      };
      window.snaptr('track', snapEventMap[event] || event, enrichedParams);
    } catch {}
  }

  return eventId;
}
