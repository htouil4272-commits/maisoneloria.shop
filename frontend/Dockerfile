FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_FB_PIXEL_ID=1544079200022148
ENV NEXT_PUBLIC_SITE_URL=https://maisoneloria.shop

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

RUN printf 'server {\n\
    listen 3000;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\
    resolver 127.0.0.11 ipv6=off valid=30s;\n\
    set $backend_upstream "http://backend:8000";\n\
    location /api/ {\n\
        proxy_pass $backend_upstream;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
        proxy_connect_timeout 30s;\n\
        proxy_send_timeout 60s;\n\
        proxy_read_timeout 60s;\n\
    }\n\
    location /_next/static/ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
    location /images/ {\n\
        expires 30d;\n\
    }\n\
    location / {\n\
        try_files $uri $uri/index.html $uri.html /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
