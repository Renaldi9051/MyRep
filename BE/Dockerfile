# Build context = root repo (lihat docker-compose.yml), karena butuh lockfile workspace.
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY FE/package.json FE/
COPY BE/package.json BE/

FROM base AS build
RUN pnpm install --frozen-lockfile --filter @myrep/be
COPY BE BE
RUN pnpm --filter @myrep/be build

FROM base AS runtime
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod --filter @myrep/be
COPY --from=build /app/BE/dist BE/dist
WORKDIR /app/BE
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
