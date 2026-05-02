# TRACKING PIXELS — Maison Eloria

## Overview

Implement 3 tracking pixels (Facebook, TikTok, Snapchat) with both client-side and server-side (CAPI) tracking. All pixels use deferred loading for performance and deduplication to prevent double-counting.

---

## Architecture

```
User Browser                          Server (FastAPI)
─────────────                         ────────────────
│ Page Load (deferred) │              │                │
│  → FB Pixel JS       │              │                │
│  → TT Pixel JS       │              │                │
│  → Snap Pixel JS     │              │                │
│                       │              │                │
│ Event (e.g. Purchase) │              │                │
│  → fbq('track',...)  │──event_id──→│ FB CAPI POST   │
│  → ttq.track(...)    │──event_id──→│ TT CAPI POST   │
│  → snaptr('track',...│──event_id──→│ Snap CAPI POST │
│                       │              │                │
│ Deduplication:        │              │ Deduplication:  │
│  event_id matches     │              │  event_id match │
└───────────────────────┘              └─────────────────┘
```

---

## Deferred Loading Strategy

All pixel scripts load AFTER the main content is interactive (not in `<head>`). This ensures:
- LCP is not blocked
- Page loads fast on slow Moroccan 4G connections
- Lighthouse score stays high

### Implementation
```typescript
// lib/tracking.ts

const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
};

export const initTracking = () => {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be interactive
  if (document.readyState === 'complete') {
    loadAllPixels();
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadAllPixels, 1000); // 1s delay after load
    });
  }
};
```

---

## Facebook Pixel

### Client-Side Setup
```typescript
// components/tracking/FacebookPixel.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq: Function;
    _fbq: Function;
  }
}

export function FacebookPixel() {
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) return;
    
    // Deferred init
    const timer = setTimeout(() => {
      (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }, 1500);

    return () => clearTimeout(timer);
  }, [pixelId]);

  // Track page views on route change
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
```

### Facebook Events to Track

| Event | Trigger | Parameters |
|-------|---------|------------|
| `PageView` | Every page load | — |
| `ViewContent` | Product page view | `content_ids`, `content_type`, `value`, `currency` |
| `AddToCart` | Add to cart click | `content_ids`, `content_type`, `value`, `currency`, `contents` |
| `InitiateCheckout` | Checkout popup opens | `value`, `currency`, `num_items` |
| `Purchase` | Order confirmed | `value`, `currency`, `content_ids`, `contents`, `order_id` |

### Facebook Event Parameters
```typescript
// ViewContent
fbq('track', 'ViewContent', {
  content_ids: ['housse-chaise-beige'],
  content_type: 'product',
  value: 330,
  currency: 'MAD'
});

// AddToCart
fbq('track', 'AddToCart', {
  content_ids: ['housse-chaise-beige'],
  content_type: 'product',
  value: 330,
  currency: 'MAD',
  contents: [{ id: 'housse-chaise-beige-pack6', quantity: 1 }]
});

// Purchase (with event_id for deduplication)
const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
fbq('track', 'Purchase', {
  value: 330,
  currency: 'MAD',
  content_ids: ['housse-chaise-beige'],
  contents: [{ id: 'housse-chaise-beige-pack6', quantity: 1 }],
  order_id: 'ELO-1234'
}, { eventID: eventId });
```

### Facebook CAPI (Server-Side)
```python
# backend/app/services/tracking.py

import hashlib
import httpx
import time

FB_API_VERSION = "v20.0"
FB_PIXEL_ID = settings.FB_PIXEL_ID
FB_ACCESS_TOKEN = settings.FB_CAPI_ACCESS_TOKEN

async def send_fb_capi_event(
    event_name: str,
    event_id: str,
    user_data: dict,
    custom_data: dict,
    event_source_url: str,
    client_ip: str,
    user_agent: str
):
    url = f"https://graph.facebook.com/{FB_API_VERSION}/{FB_PIXEL_ID}/events"
    
    # Hash user data (required by CAPI)
    hashed_phone = hashlib.sha256(
        user_data['phone'].encode()
    ).hexdigest()
    
    payload = {
        "data": [{
            "event_name": event_name,
            "event_time": int(time.time()),
            "event_id": event_id,  # Must match client-side eventID
            "event_source_url": event_source_url,
            "action_source": "website",
            "user_data": {
                "ph": [hashed_phone],
                "client_ip_address": client_ip,
                "client_user_agent": user_agent,
                "fbc": user_data.get('fbc'),  # fb click ID cookie
                "fbp": user_data.get('fbp'),  # fb browser ID cookie
                "country": [hashlib.sha256(b"ma").hexdigest()],
            },
            "custom_data": custom_data
        }],
        "access_token": FB_ACCESS_TOKEN
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        return response.json()
```

---

## TikTok Pixel

### Client-Side Setup
```typescript
// components/tracking/TikTokPixel.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: string;
  }
}

export function TikTokPixel() {
  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) return;
    
    const timer = setTimeout(() => {
      (function(w: any, d: any, t: string) {
        w.TiktokAnalyticsObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        ttq.setAndDefer = function(t: any, e: any) {
          t[e] = function() {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function(t: any) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
          return e;
        };
        ttq.load = function(e: any, n: any) {
          var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = r;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date;
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          var o = d.createElement("script");
          o.type = "text/javascript";
          o.async = true;
          o.src = r + "?sdkid=" + e + "&lib=" + t;
          var a = d.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a);
        };
        ttq.load(pixelId);
        ttq.page();
      })(window, document, 'ttq');
    }, 2000);

    return () => clearTimeout(timer);
  }, [pixelId]);

  return null;
}
```

### TikTok Events

| Event | Trigger | Parameters |
|-------|---------|------------|
| `ViewContent` | Product page | `content_id`, `content_type`, `value`, `currency` |
| `AddToCart` | Add to cart | `content_id`, `content_type`, `value`, `currency`, `quantity` |
| `InitiateCheckout` | Checkout open | `value`, `currency` |
| `PlaceAnOrder` | Order confirmed | `value`, `currency`, `content_id`, `quantity`, `order_id` |

### TikTok Event Parameters
```typescript
// Purchase event
ttq.track('PlaceAnOrder', {
  content_id: 'housse-chaise-beige-pack6',
  content_type: 'product',
  content_name: 'Housse Chaise Eloria Beige Pack 6',
  quantity: 1,
  value: 330,
  currency: 'MAD',
  order_id: 'ELO-1234'
}, {
  event_id: eventId // Same as FB for deduplication
});
```

### TikTok CAPI (Server-Side)

**IMPORTANT**: TikTok requires `+` before the phone number for hashing.

```python
async def send_tiktok_capi_event(
    event_name: str,
    event_id: str,
    user_data: dict,
    properties: dict,
    client_ip: str,
    user_agent: str
):
    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
    
    # TikTok requires "+" before phone number before hashing
    phone_with_plus = f"+212{user_data['phone'].lstrip('0')}"
    hashed_phone = hashlib.sha256(phone_with_plus.encode()).hexdigest()
    
    payload = {
        "pixel_code": settings.TIKTOK_PIXEL_ID,
        "event": event_name,
        "event_id": event_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "context": {
            "user_agent": user_agent,
            "ip": client_ip,
            "user": {
                "phone_number": hashed_phone,
            },
            "page": {
                "url": properties.get("page_url", "")
            }
        },
        "properties": properties
    }
    
    headers = {
        "Access-Token": settings.TIKTOK_CAPI_ACCESS_TOKEN,
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()
```

---

## Snapchat Pixel

### Client-Side Setup
```typescript
// components/tracking/SnapchatPixel.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    snaptr: Function;
  }
}

export function SnapchatPixel() {
  const pixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) return;
    
    const timer = setTimeout(() => {
      (function(e: any, t: any, n: any) {
        if (e.snaptr) return;
        var a = e.snaptr = function() {
          a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
        };
        a.queue = [];
        var s = 'script';
        var r = t.createElement(s);
        r.async = !0;
        r.src = n;
        var u = t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r, u);
      })(window, document, 'https://sc-static.net/scevent.min.js');

      window.snaptr('init', pixelId);
      window.snaptr('track', 'PAGE_VIEW');
    }, 2500);

    return () => clearTimeout(timer);
  }, [pixelId]);

  return null;
}
```

### Snapchat Events

| Event | Trigger |
|-------|---------|
| `PAGE_VIEW` | Every page load |
| `VIEW_CONTENT` | Product page view |
| `ADD_CART` | Add to cart |
| `START_CHECKOUT` | Checkout popup opens |
| `PURCHASE` | Order confirmed |

### Snapchat CAPI
```python
async def send_snap_capi_event(
    event_name: str,
    event_id: str,
    user_data: dict,
    event_data: dict,
    client_ip: str,
    user_agent: str
):
    url = "https://tr.snapchat.com/v2/conversion"
    
    phone_e164 = f"+212{user_data['phone'].lstrip('0')}"
    hashed_phone = hashlib.sha256(
        phone_e164.lower().encode()
    ).hexdigest()
    
    payload = {
        "pixel_id": settings.SNAP_PIXEL_ID,
        "event_type": event_name,
        "event_conversion_type": "WEB",
        "event_tag": event_id,
        "timestamp": int(time.time() * 1000),
        "hashed_phone_number": hashed_phone,
        "hashed_ip_address": hashlib.sha256(client_ip.encode()).hexdigest(),
        "user_agent": user_agent,
        "price": event_data.get("value"),
        "currency": "MAD",
        "transaction_id": event_data.get("order_id"),
        "item_ids": event_data.get("content_ids", []),
        "number_items": event_data.get("quantity", 1)
    }
    
    headers = {
        "Authorization": f"Bearer {settings.SNAP_CAPI_TOKEN}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()
```

---

## Deduplication Strategy

### Event ID Generation (Client-Side)
```typescript
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
```

### How Deduplication Works
1. Client generates a unique `event_id` for each event
2. Client fires the pixel event WITH that `event_id`
3. Client sends the same `event_id` to the backend API
4. Backend fires CAPI event with the same `event_id`
5. Facebook/TikTok/Snapchat sees matching `event_id` → counts as ONE event

### Critical Rule
- The `event_id` MUST be identical between client-side and server-side
- Generate it client-side and pass it in the order API request
- Backend uses the received `event_id` for all CAPI calls

---

## Unified Tracking Helper

```typescript
// lib/tracking.ts

import { generateEventId } from './utils';

export interface TrackingEvent {
  name: string;
  data: Record<string, any>;
  eventId?: string;
}

export function trackEvent(event: TrackingEvent) {
  const eventId = event.eventId || generateEventId();
  
  // Facebook
  if (typeof window !== 'undefined' && window.fbq) {
    const fbEventName = mapToFbEvent(event.name);
    window.fbq('track', fbEventName, event.data, { eventID: eventId });
  }
  
  // TikTok
  if (typeof window !== 'undefined' && window.ttq) {
    const ttEventName = mapToTtEvent(event.name);
    window.ttq.track(ttEventName, event.data, { event_id: eventId });
  }
  
  // Snapchat
  if (typeof window !== 'undefined' && window.snaptr) {
    const snapEventName = mapToSnapEvent(event.name);
    window.snaptr('track', snapEventName, event.data);
  }
  
  return eventId; // Return for CAPI usage
}

function mapToFbEvent(name: string): string {
  const map: Record<string, string> = {
    'view_content': 'ViewContent',
    'add_to_cart': 'AddToCart',
    'initiate_checkout': 'InitiateCheckout',
    'purchase': 'Purchase',
  };
  return map[name] || name;
}

function mapToTtEvent(name: string): string {
  const map: Record<string, string> = {
    'view_content': 'ViewContent',
    'add_to_cart': 'AddToCart',
    'initiate_checkout': 'InitiateCheckout',
    'purchase': 'PlaceAnOrder',
  };
  return map[name] || name;
}

function mapToSnapEvent(name: string): string {
  const map: Record<string, string> = {
    'view_content': 'VIEW_CONTENT',
    'add_to_cart': 'ADD_CART',
    'initiate_checkout': 'START_CHECKOUT',
    'purchase': 'PURCHASE',
  };
  return map[name] || name;
}
```

---

## Hashing Requirements Summary

| Platform | Phone Format Before Hash | Hash Algorithm |
|----------|--------------------------|----------------|
| Facebook | `+212661234567` (E.164, no spaces) | SHA-256, lowercase hex |
| TikTok | `+212661234567` (must have `+`) | SHA-256, lowercase hex |
| Snapchat | `+212661234567` (E.164) | SHA-256, lowercase hex |

### Hash Function
```python
import hashlib

def hash_for_capi(value: str) -> str:
    """SHA-256 hash for CAPI user data."""
    return hashlib.sha256(
        value.strip().lower().encode('utf-8')
    ).hexdigest()

def format_phone_for_capi(phone: str) -> str:
    """Convert Moroccan phone to E.164 format."""
    phone = phone.strip().replace(' ', '').replace('-', '')
    if phone.startswith('0'):
        phone = phone[1:]
    if not phone.startswith('+212'):
        phone = f'+212{phone}'
    return phone
```
