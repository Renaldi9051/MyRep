import { env } from './lib/env.js';
import { serve } from '@hono/node-server';
import { app } from './app.js';
import { pool } from './db/index.js';

// Server Node untuk lokal (pnpm dev) dan Docker. Di Vercel yang dipakai api/[[...route]].ts.
const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`BE jalan di http://localhost:${info.port}/api`);
});

// Docker mengirim SIGTERM saat container dihentikan
const shutdown = () => {
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
