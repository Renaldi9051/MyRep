import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { env } from '../lib/env.js';
import * as schema from './schema.js';

// Database lokal (docker-compose.dev.yml): driver Neon tersambung lewat proxy WebSocket
// di port 4444, tanpa TLS. Neon asli tidak memakai localhost, jadi produksi tidak terpengaruh.
if (['localhost', '127.0.0.1'].includes(new URL(env.DATABASE_URL).hostname)) {
  neonConfig.wsProxy = (host) => `${host}:4444/v2`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// Driver WebSocket Neon (Node 22+ sudah punya WebSocket bawaan) supaya bisa transaksi.
export const pool = new Pool({ connectionString: env.DATABASE_URL });

// Tanpa handler ini, koneksi idle yang putus (mis. compute Neon tidur) membuat proses crash.
// Query berikutnya otomatis memakai koneksi baru.
pool.on('error', (err: Error) => {
  console.error('Koneksi database idle terputus:', err.message);
});

export const db = drizzle({ client: pool, schema });

export type Db = typeof db;
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];
