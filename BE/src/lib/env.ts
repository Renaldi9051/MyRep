import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { z } from 'zod';

// Load .env di root repo (sama untuk src/ saat dev dan dist/ saat build).
// Di Docker file ini tidak ada; env diisi lewat env_file di docker-compose.
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, '../../../.env'), quiet: true });

const optional = z
  .string()
  .optional()
  .transform((v) => (v ? v : undefined));

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET minimal 32 karakter'),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: optional,
    GOOGLE_CLIENT_SECRET: optional,
  })
  // Di server (Docker) login Google dan cookie aman butuh HTTPS; localhost di sini berarti salah konfigurasi
  .refine((e) => e.NODE_ENV !== 'production' || e.BETTER_AUTH_URL.startsWith('https://'), {
    path: ['BETTER_AUTH_URL'],
    message: 'di production harus https://DOMAIN (cek DOMAIN di .env)',
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Env tidak valid, cek file .env di root:');
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
