import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit dijalankan dari folder BE, jadi .env ada di ../.env
config({ path: '../.env', quiet: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
