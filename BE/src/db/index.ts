import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { env } from '../lib/env.js';
import * as schema from './schema.js';

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
