FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package.json package-lock.json* ./
    RUN npm ci --legacy-peer-deps
    COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_FB_PIXEL_ID
ARG NEXT_PUBLIC_TT_PIXEL_ID
ARG NEXT_PUBLIC_SC_PIXEL_ID
ARG NEXT_PUBLIC_WHATSAPP_NUMBER

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_FB_PIXEL_ID=${NEXT_PUBLIC_FB_PIXEL_ID}
ENV NEXT_PUBLIC_TT_PIXEL_ID=${NEXT_PUBLIC_TT_PIXEL_ID}
ENV NEXT_PUBLIC_SC_PIXEL_ID=${NEXT_PUBLIC_SC_PIXEL_ID}
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=${NEXT_PUBLIC_WHATSAPP_NUMBER}

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
