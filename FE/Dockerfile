# Build context = root repo (lihat docker-compose.yml), karena butuh lockfile workspace.
# Hasil akhirnya image Caddy: sajikan FE/dist dan proxy /api/* ke be, jadi VPS cukup punya Docker.
FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY FE/package.json FE/
COPY BE/package.json BE/
RUN pnpm install --frozen-lockfile --filter @myrep/fe
COPY FE FE
# .env tidak ikut ke image (.dockerignore); FE dan API satu origin, jadi /api cukup
ENV VITE_API_URL=/api
RUN pnpm --filter @myrep/fe build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/FE/dist /srv
