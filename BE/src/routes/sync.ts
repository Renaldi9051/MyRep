import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import type { ZodType } from 'zod';
import { requireAuth, type AuthEnv } from '../auth/middleware.js';
import { pullChanges, pushChanges } from '../db/sync.js';
import { pullQuery, pushBody } from '../lib/sync-schema.js';

const validate = <T extends ZodType>(target: 'json' | 'query', schema: T) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Data tidak valid', issues: result.error.issues }, 400);
    }
  });

export const sync = new Hono<AuthEnv>()
  .use(requireAuth)
  // Ambil perubahan setelah cursor `since`. Ulangi selama has_more = true.
  .get('/pull', validate('query', pullQuery), async (c) => {
    const { since, limit } = c.req.valid('query');
    return c.json(await pullChanges(c.var.user.id, since, limit));
  })
  // Kirim perubahan dari Dexie (latihan custom, sesi, set), termasuk yang dihapus lunak.
  .post('/push', validate('json', pushBody), async (c) => {
    return c.json(await pushChanges(c.var.user.id, c.req.valid('json')));
  });
