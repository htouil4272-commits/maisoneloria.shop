'use client';

import { generateEventId } from './utils';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    snaptr?: (...args: unknown[]) => void;
  }
}

type TrackingEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Lead' | 'Purchase';

interface TrackingParams {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: unknown;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sessionId = localStorage.getItem('eloria_session_id');
  if (!sessionId) {
    sessionId = generateEventId();
    localStorage.setItem('eloria_session_id', sessionId);
  }
  return sessionId;
}

async function trackInternalAnalytics(eventType: string, params: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
    await fetch(`${API_URL}/api/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        path: window.location.pathname,
        metadata_json: params,
      }),
      keepalive: true, // Pour s'assurer que la requête part même si la page se ferme
    });
  } catch (error) {
    console.error('Failed to send internal analytics', error);
  }
}

export function trackClick(buttonName: string, extraParams: Record<string, any> = {}) {
  trackInternalAnalytics('click', { button: buttonName, ...extraParams });
}

export function trackEvent(event: TrackingEvent, params: TrackingParams = {}): string {
  const eventId = (params.event_id as string) || generateEventId();
  const enrichedParams = { ...params, event_id: eventId };

  // Internal Analytics
  trackInternalAnalytics(event.toLowerCase(), enrichedParams);

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
        Lead: 'SIGN_UP',
        Purchase: 'PURCHASE',
      };
      window.snaptr('track', snapEventMap[event] || event, enrichedParams);
    } catch {}
  }

  return eventId;
}
