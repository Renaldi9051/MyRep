import './lib/env.js';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { health } from './routes/health.js';

const app = new Hono().basePath('/api');

app.route('/health', health);

const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`BE jalan di http://localhost:${info.port}/api`);
});
