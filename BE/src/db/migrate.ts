import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db, pool } from './index.js';

// Jalankan migrasi di BE/drizzle. Dipakai lokal (pnpm db:migrate) dan di container saat start.
const here = dirname(fileURLToPath(import.meta.url));

await migrate(db, { migrationsFolder: resolve(here, '../../drizzle') });
console.log('Migrasi selesai');
await pool.end();
