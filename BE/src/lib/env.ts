import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

// Load .env di root repo (sama untuk src/ saat dev dan dist/ saat build).
// Di Docker file ini tidak ada; env diisi lewat env_file di docker-compose.
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, '../../../.env'), quiet: true });
