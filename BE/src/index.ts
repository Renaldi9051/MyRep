import { env } from './lib/env.js';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { auth } from './auth/index.js';
import { pool } from './db/index.js';
import { health } from './routes/health.js';
import { sync } from './routes/sync.js';

const app = new Hono().basePath('/api');

// Better Auth: daftar, masuk (email/Google), keluar, cek sesi
app.on(['GET', 'POST'], '/auth/*', (c) => auth.handler(c.req.raw));

app.route('/health', health);
app.route('/sync', sync);

app.notFound((c) => c.json({ error: 'Tidak ditemukan' }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ error: 'Terjadi kesalahan di server' }, 500);
});

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
