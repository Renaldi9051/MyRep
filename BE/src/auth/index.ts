import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import { account, session, user, verification } from '../db/schema.js';
import { env } from '../lib/env.js';

const DAY = 60 * 60 * 24;

const google =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
    : undefined;

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  // Login Google hanya aktif kalau GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET diisi
  socialProviders: google ? { google } : {},
  // F7.1: sekali login tetap masuk. Sesi diperpanjang otomatis selama app dipakai.
  session: {
    expiresIn: 90 * DAY,
    updateAge: DAY,
  },
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;
