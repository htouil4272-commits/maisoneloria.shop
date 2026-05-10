# AI CODER PROMPT — Maison Eloria

> Copy-paste this prompt to your AI coder to build/continue the project.

---

## The Prompt

```
You are building "Maison Eloria" — a premium DTC (Direct-to-Consumer) e-commerce store for the Moroccan market. The store sells custom-fit chair covers (أغطية كراسي) at premium prices with COD (Cash on Delivery) only.

## Project Structure

The project has comprehensive documentation in the `docs/` folder. Read ALL docs before coding:

1. `docs/STRATEGY.md` — Brand positioning, target audience, emotional selling, pricing psychology
2. `docs/TECH_STACK.md` — Full architecture: Next.js 14 + Tailwind (frontend), FastAPI (backend), PostgreSQL
3. `docs/DESIGN_SYSTEM.md` — Colors (#1B4332 emerald, #C9A84C gold, #FAF7F2 cream), fonts (Cairo, Playfair Display), components, RTL layout
4. `docs/PAGES_SPEC.md` — Detailed specification for every page and component
5. `docs/PRODUCT_SPEC.md` — Product details, 9 colors, 3 pack offers (4pc=250DH, 6pc=330DH, 9pc=380DH), reviews data
6. `docs/CHECKOUT_FLOW.md` — Cart drawer → Checkout popup (2 fields only: name + phone) → Thank you page
7. `docs/TRACKING_PIXELS.md` — Facebook, TikTok, Snapchat pixels with CAPI, deferred loading, deduplication
8. `docs/FRAUD_PROTECTION.md` — MaxMind GeoIP2 (Morocco only, block VPN)
9. `docs/API_SPEC.md` — All backend endpoints with request/response schemas
10. `docs/DEPLOYMENT.md` — Docker setup, Cloudflare DNS, production configs
11. `docs/CRO_PLAYBOOK.md` — Conversion optimization tactics, AOV boosters
12. `docs/GOOGLE_SHEETS.md` — Order webhook to Google Sheets + CSV template
13. `docs/COPYWRITING.md` — ALL Arabic copy (Darija + MSA) for every page element

## Key Technical Details

### Frontend (frontend/)
- Next.js 14 App Router + TypeScript + Tailwind CSS 3.4
- RTL Arabic layout (dir="rtl", lang="ar")
- Zustand for cart state with localStorage persistence
- Framer Motion for animations
- Google Fonts: Cairo (body), Playfair Display (headings)
- All tracking pixels deferred-loaded for performance

### Backend (backend/)
- Python FastAPI
- SQLAlchemy 2.0 async + asyncpg
- Auto-migration on startup (Alembic)
- Database: postgres://maisoneloria:maisoneloria@maisoneloria_database:5432/maisoneloria?sslmode=disable

### Domains
- Frontend: maisoneloria.shop
- API: api.maisoneloria.shop

## What to Build/Fix

1. Read all docs in `docs/` folder first
2. Check what already exists in `frontend/` and `backend/` folders
3. Fix any missing components, broken imports, or incomplete implementations
4. Ensure all pages match the specs in PAGES_SPEC.md
5. Ensure all copy matches COPYWRITING.md
6. Ensure checkout flow matches CHECKOUT_FLOW.md exactly
7. Ensure tracking pixels work per TRACKING_PIXELS.md
8. Ensure fraud protection works per FRAUD_PROTECTION.md
9. Test Docker builds for both frontend and backend
10. Make sure everything is production-ready

## Critical Rules

- ALL text must be in Arabic (Moroccan Darija) — see COPYWRITING.md
- RTL layout everywhere
- Mobile-first design (85%+ traffic is mobile in Morocco)
- Only 2 checkout fields: Name + Phone (Moroccan validation)
- COD only — no online payment
- Deferred pixel loading (don't block page load)
- Phone format for CAPI: TikTok requires "+" prefix before hashing
- MaxMind: graceful fallback if DB not available
- Google Sheets: non-blocking (don't slow checkout)
```

---

## Quick Reference for Common Tasks

### "Fix the frontend"
```
Read docs/PAGES_SPEC.md, docs/DESIGN_SYSTEM.md, and docs/COPYWRITING.md.
Then check frontend/ code and fix any component that doesn't match the spec.
Focus on: RTL layout, Arabic text, mobile responsiveness, CRO elements.
```

### "Fix the backend"
```
Read docs/API_SPEC.md and docs/TECH_STACK.md.
Then check backend/ code and ensure all endpoints work correctly.
Test: POST /api/orders, GET /api/health, admin endpoints.
```

### "Add tracking pixels"
```
Read docs/TRACKING_PIXELS.md for the complete implementation.
Key: deferred loading, event_id deduplication, CAPI with SHA-256 hashing.
TikTok phone must have "+" prefix before hashing.
```

### "Fix checkout"
```
Read docs/CHECKOUT_FLOW.md for the exact flow.
Cart drawer → Checkout popup (modal) → 2 fields only → POST /api/orders → /thank-you
```

### "Deploy"
```
Read docs/DEPLOYMENT.md for Docker setup and DNS configuration.
docker-compose.prod.yml is at the project root.
```
