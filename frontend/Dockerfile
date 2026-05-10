FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

RUN npm install --legacy-peer-deps --prefer-offline || npm install --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
