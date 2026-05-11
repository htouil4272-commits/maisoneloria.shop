FROM node:18-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_TT_PIXEL_ID=D80AC3RC77U9TECLM010
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

# Copy only dependency files first — this layer is cached and reused
# on every rebuild as long as package files don't change
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

# Copy the rest of the source after deps are installed
COPY . .

# --max-old-space-size prevents silent OOM kills on low-RAM VPS (< 2 GB)
RUN NODE_OPTIONS="--max-old-space-size=1536" npm run build

# ── Runtime image ─────────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_TT_PIXEL_ID=D80AC3RC77U9TECLM010
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop
ENV BACKEND_URL=http://backend:8000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget -q --spider http://127.0.0.1:${PORT:-3000}/ || exit 1

CMD ["node", "server.js"]
