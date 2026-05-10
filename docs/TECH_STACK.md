# TECH STACK — Maison Eloria

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Cloudflare (CDN + DNS)            │
│  maisoneloria.shop → Frontend (Next.js)     │
│  api.maisoneloria.shop → Backend (FastAPI)  │
└──────────┬──────────────────┬───────────────┘
           │                  │
    ┌──────▼──────┐    ┌─────▼──────┐
    │  Frontend   │    │  Backend   │
    │  Next.js 14 │    │  FastAPI   │
    │  Tailwind   │    │  Python    │
    │  Docker     │    │  Docker    │
    └─────────────┘    └─────┬──────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   maisoneloria  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──┐   ┌──────▼──┐   ┌──────▼──────┐
       │ MaxMind │   │ Google  │   │  Tracking   │
       │ GeoIP2  │   │ Sheets  │   │  Pixels     │
       └─────────┘   └─────────┘   └─────────────┘
```

---

## Frontend

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Language**: TypeScript
- **Animations**: Framer Motion
- **State**: React Context (cart) + Zustand (if needed)
- **Icons**: Lucide React
- **Fonts**: Google Fonts — `Cairo` (Arabic-optimized) + `Playfair Display` (brand accent)
- **Image handling**: Next.js Image component with placeholder blur

### Key Dependencies
```json
{
  "next": "^14.2",
  "react": "^18.3",
  "tailwindcss": "^3.4",
  "framer-motion": "^11",
  "lucide-react": "^0.400",
  "zustand": "^4.5",
  "react-hook-form": "^7.52",
  "zod": "^3.23",
  "js-cookie": "^3.0",
  "crypto-js": "^4.2"
}
```

### Project Structure
```
frontend/
├── app/
│   ├── layout.tsx              # Root layout (RTL, fonts, meta)
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # About us
│   ├── contact/page.tsx        # Contact us
│   ├── collection/page.tsx     # All products
│   ├── product/[slug]/page.tsx # Product detail
│   ├── thank-you/page.tsx      # Post-purchase
│   ├── globals.css             # Tailwind + custom CSS
│   └── api/
│       └── track/route.ts      # Server-side CAPI proxy
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── AnnouncementBar.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── PainSection.tsx
│   │   ├── ProductShowcase.tsx
│   │   ├── BenefitsGrid.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   ├── product/
│   │   ├── ProductGallery.tsx
│   │   ├── ColorSelector.tsx
│   │   ├── PackSelector.tsx
│   │   ├── AddToCartButton.tsx
│   │   ├── StickyMobileCTA.tsx
│   │   └── CrossSells.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutPopup.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── SocialProofBar.tsx
│   ├── shared/
│   │   ├── TrustBadges.tsx
│   │   ├── ReviewStars.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── LiveViewers.tsx
│   │   ├── RecentPurchaseToast.tsx
│   │   ├── StickyWhatsApp.tsx
│   │   └── ExitIntentPopup.tsx
│   └── tracking/
│       ├── FacebookPixel.tsx
│       ├── TikTokPixel.tsx
│       ├── SnapchatPixel.tsx
│       └── TrackingProvider.tsx
├── lib/
│   ├── api.ts                  # API client
│   ├── cart-store.ts           # Zustand cart store
│   ├── tracking.ts             # Unified tracking helpers
│   ├── capi.ts                 # CAPI hashing + sending
│   ├── constants.ts            # Colors, offers, config
│   ├── utils.ts                # Phone validation, formatting
│   └── types.ts                # TypeScript types
├── public/
│   ├── images/                 # Product + lifestyle images
│   ├── icons/                  # Favicons, apple-touch
│   └── fonts/                  # Self-hosted fonts (if needed)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Environment Variables (Frontend)
```env
# API
NEXT_PUBLIC_API_URL=https://api.maisoneloria.shop
NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

# Tracking Pixels
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

# CAPI (server-side only — no NEXT_PUBLIC_ prefix)
FB_CAPI_ACCESS_TOKEN=
TIKTOK_CAPI_ACCESS_TOKEN=
SNAP_CAPI_TOKEN=
```

---

## Backend

### Stack
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0 (async) + asyncpg
- **Validation**: Pydantic v2
- **Fraud Detection**: maxminddb / geoip2
- **Google Sheets**: gspread + google-auth
- **Password Hashing**: passlib + bcrypt (for admin)
- **CORS**: FastAPI CORSMiddleware

### Key Dependencies
```
fastapi>=0.111
uvicorn[standard]>=0.30
sqlalchemy[asyncio]>=2.0
asyncpg>=0.29
pydantic>=2.7
pydantic-settings>=2.3
alembic>=1.13
geoip2>=4.8
gspread>=6.1
google-auth>=2.30
python-jose[cryptography]>=3.3
passlib[bcrypt]>=1.7
httpx>=0.27
python-multipart>=0.0.9
```

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, startup, CORS
│   ├── config.py               # Settings from env
│   ├── database.py             # Async engine + session
│   ├── models/
│   │   ├── __init__.py
│   │   ├── order.py            # Order model
│   │   └── lead.py             # Contact/newsletter leads
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── order.py            # Order request/response
│   │   └── lead.py             # Lead schemas
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py           # Main router
│   │   ├── orders.py           # POST /orders
│   │   ├── health.py           # GET /health
│   │   └── admin.py            # Admin endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── fraud.py            # MaxMind check
│   │   ├── sheets.py           # Google Sheets webhook
│   │   ├── tracking.py         # Server-side pixel events
│   │   └── order_service.py    # Business logic
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── rate_limit.py       # Rate limiting
│   └── migrations/
│       ├── env.py              # Alembic env
│       ├── versions/
│       │   └── 001_initial.py  # Initial migration
│       └── alembic.ini
├── scripts/
│   └── seed.py                 # Seed data if needed
├── tests/
│   └── test_orders.py
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── requirements.txt
├── alembic.ini
└── README.md
```

### Environment Variables (Backend)
```env
# App
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000
SECRET_KEY=change-me-to-random-string

# Database
DATABASE_URL=postgres://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria?sslmode=disable

# CORS
ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop

# MaxMind
MAXMIND_LICENSE_KEY=your-maxmind-license-key
MAXMIND_DB_PATH=./data/GeoLite2-City.mmdb

# Google Sheets
GOOGLE_SHEETS_CREDENTIALS_JSON={}
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Tracking CAPI
FB_PIXEL_ID=
FB_CAPI_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
TIKTOK_CAPI_ACCESS_TOKEN=
SNAP_PIXEL_ID=
SNAP_CAPI_TOKEN=

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
```

---

## Database

### Connection
```
Host: maisoneloria_database
Port: 5432
Database: maisoneloria
Username: maisoneloria
Password: maisoneloria
Connection string: postgres://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria?sslmode=disable
```

### Tables

#### orders
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    pack_type VARCHAR(50) NOT NULL,        -- 'pack_4', 'pack_6', 'pack_9'
    colors JSONB NOT NULL,                  -- ["beige", "marron", ...]
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',   -- pending, confirmed, shipped, delivered, cancelled
    ip_address VARCHAR(45),
    country VARCHAR(2),
    city VARCHAR(100),
    is_vpn BOOLEAN DEFAULT FALSE,
    fraud_score DECIMAL(5,2),
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    fbclid VARCHAR(255),
    ttclid VARCHAR(255),
    sclid VARCHAR(255),
    fb_event_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### leads
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(20),
    name VARCHAR(255),
    source VARCHAR(50),           -- 'newsletter', 'contact', 'exit_popup'
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Auto-Migration
The backend runs Alembic migrations automatically on startup via `app/main.py` lifespan event.

---

## Docker Setup

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p data
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml (Development)
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: maisoneloria
      POSTGRES_USER: maisoneloria
      POSTGRES_PASSWORD: maisoneloria
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Domains & Routing

| Domain | Target | SSL |
|--------|--------|-----|
| `maisoneloria.shop` | Frontend (Next.js on port 3000) | Cloudflare |
| `www.maisoneloria.shop` | Redirect → `maisoneloria.shop` | Cloudflare |
| `api.maisoneloria.shop` | Backend (FastAPI on port 8000) | Cloudflare |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.0s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.0s |
| Lighthouse Score (Mobile) | > 90 |
| Bundle Size (JS, gzipped) | < 100KB |
