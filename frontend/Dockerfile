FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

RUN npm install --legacy-peer-deps

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget -q --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
