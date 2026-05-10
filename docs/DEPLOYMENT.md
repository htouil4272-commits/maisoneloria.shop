# DEPLOYMENT — Maison Eloria

## Architecture

```
                    Cloudflare DNS
                    ┌──────────────┐
                    │              │
          ┌────────┤  DNS Records  ├────────┐
          │        │              │        │
          ▼        └──────────────┘        ▼
   maisoneloria.shop              api.maisoneloria.shop
          │                                │
          ▼                                ▼
   ┌─────────────┐                 ┌──────────────┐
   │  Frontend   │                 │   Backend    │
   │  Container  │                 │   Container  │
   │  (Next.js)  │                 │   (FastAPI)  │
   │  Port 3000  │                 │   Port 8000  │
   └─────────────┘                 └──────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │  PostgreSQL  │
                                   │  Container   │
                                   │  Port 5432   │
                                   └──────────────┘
```

---

## Docker Compose (Production)

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.maisoneloria.shop
      - NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop
      - NEXT_PUBLIC_FB_PIXEL_ID=${FB_PIXEL_ID}
      - NEXT_PUBLIC_TIKTOK_PIXEL_ID=${TIKTOK_PIXEL_ID}
      - NEXT_PUBLIC_SNAP_PIXEL_ID=${SNAP_PIXEL_ID}
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DATABASE_URL=postgres://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria?sslmode=disable
      - ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop
      - SECRET_KEY=${SECRET_KEY}
      - MAXMIND_LICENSE_KEY=${MAXMIND_LICENSE_KEY}
      - MAXMIND_DB_PATH=./data/GeoLite2-City.mmdb
      - GOOGLE_SHEETS_CREDENTIALS_JSON=${GOOGLE_SHEETS_CREDENTIALS_JSON}
      - GOOGLE_SHEETS_SPREADSHEET_ID=${GOOGLE_SHEETS_SPREADSHEET_ID}
      - FB_PIXEL_ID=${FB_PIXEL_ID}
      - FB_CAPI_ACCESS_TOKEN=${FB_CAPI_ACCESS_TOKEN}
      - TIKTOK_PIXEL_ID=${TIKTOK_PIXEL_ID}
      - TIKTOK_CAPI_ACCESS_TOKEN=${TIKTOK_CAPI_ACCESS_TOKEN}
      - SNAP_PIXEL_ID=${SNAP_PIXEL_ID}
      - SNAP_CAPI_TOKEN=${SNAP_CAPI_TOKEN}
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    volumes:
      - maxmind_data:/app/data
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy

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
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U maisoneloria"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  maxmind_data:
```

---

## Frontend Dockerfile

```dockerfile
# frontend/Dockerfile

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for Next.js public env vars
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_FB_PIXEL_ID
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAP_PIXEL_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_FB_PIXEL_ID=$NEXT_PUBLIC_FB_PIXEL_ID
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID
ENV NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

## Backend Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY . .

# Create data directory for MaxMind DB
RUN mkdir -p data

# Non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

---

## Environment Files

### frontend/.env.example
```env
# API
NEXT_PUBLIC_API_URL=https://api.maisoneloria.shop
NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

# Tracking Pixels (get IDs from each platform)
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

# Server-side CAPI (used in Next.js API routes)
FB_CAPI_ACCESS_TOKEN=
TIKTOK_CAPI_ACCESS_TOKEN=
SNAP_CAPI_TOKEN=
```

### backend/.env.example
```env
# App
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000
SECRET_KEY=generate-a-random-64-char-string-here

# Database (already configured)
DATABASE_URL=postgres://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria?sslmode=disable

# CORS
ALLOWED_ORIGINS=https://maisoneloria.shop,https://www.maisoneloria.shop

# MaxMind Fraud Protection
# Get free license key at: https://www.maxmind.com/en/geolite2/signup
MAXMIND_LICENSE_KEY=
MAXMIND_DB_PATH=./data/GeoLite2-City.mmdb

# Google Sheets (for order webhook)
# Create a service account at: https://console.cloud.google.com
# Share the spreadsheet with the service account email
GOOGLE_SHEETS_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}
GOOGLE_SHEETS_SPREADSHEET_ID=

# Facebook CAPI
FB_PIXEL_ID=
FB_CAPI_ACCESS_TOKEN=

# TikTok CAPI
TIKTOK_PIXEL_ID=
TIKTOK_CAPI_ACCESS_TOKEN=

# Snapchat CAPI
SNAP_PIXEL_ID=
SNAP_CAPI_TOKEN=

# Admin Panel
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-to-a-strong-password
```

---

## Cloudflare DNS Setup

### Required DNS Records

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| A | `@` | `YOUR_SERVER_IP` | Yes (orange cloud) |
| CNAME | `www` | `maisoneloria.shop` | Yes |
| A | `api` | `YOUR_SERVER_IP` | Yes (orange cloud) |

### SSL/TLS Settings
1. Go to SSL/TLS → Overview
2. Set mode to **Full (strict)**
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

### Page Rules (Optional)
- `www.maisoneloria.shop/*` → Forwarding URL → 301 → `https://maisoneloria.shop/$1`

---

## Deployment Steps (Step by Step)

### 1. Server Setup
```bash
# On your VPS/EasyPanel/Docker host

# Clone or upload your project
git clone your-repo.git maisoneloria
cd maisoneloria

# Copy env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Edit env files with real values
nano frontend/.env
nano backend/.env
```

### 2. Start Services
```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d --build

# Check logs
docker compose logs -f

# Verify health
curl http://localhost:8000/api/health
curl http://localhost:3000
```

### 3. Verify Everything
```bash
# Backend health
curl https://api.maisoneloria.shop/api/health

# Frontend
curl -I https://maisoneloria.shop

# Test order (from Morocco IP)
curl -X POST https://api.maisoneloria.shop/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","customer_phone":"0661234567","items":[{"pack_id":"pack_6","color_id":"beige","color_name":"بيج","pieces":6,"price":330,"quantity":1}],"total":330}'
```

### 4. Download MaxMind Database
```bash
# Enter backend container
docker compose exec backend bash

# Run download script
python scripts/download_maxmind.py

# Verify
ls -la data/GeoLite2-City.mmdb
```

---

## Monitoring

### Health Check Endpoints
- Frontend: `https://maisoneloria.shop` (should return 200)
- Backend: `https://api.maisoneloria.shop/api/health` (should return JSON)

### Log Monitoring
```bash
# All logs
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### Recommended: Set up UptimeRobot (Free)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://maisoneloria.shop` (HTTP, 5 min interval)
3. Add monitor: `https://api.maisoneloria.shop/api/health` (HTTP, 5 min interval)
4. Set alert contacts (email/WhatsApp)

---

## Backup Strategy

### Database Backup
```bash
# Manual backup
docker compose exec db pg_dump -U maisoneloria maisoneloria > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T db psql -U maisoneloria maisoneloria < backup_20260502.sql
```

### Automated Daily Backup (cron)
```bash
# Add to crontab
0 3 * * * cd /path/to/maisoneloria && docker compose exec -T db pg_dump -U maisoneloria maisoneloria | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```
