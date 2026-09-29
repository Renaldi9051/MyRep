import './lib/env.js';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { auth } from './auth/index.js';
import { health } from './routes/health.js';
import { sync } from './routes/sync.js';

// Aplikasi Hono tanpa server: dipakai server Node (index.ts, Docker/lokal)
// dan serverless function Vercel (api/[[...route]].ts)
export const app = new Hono().basePath('/api');

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
