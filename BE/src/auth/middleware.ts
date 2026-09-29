import { createMiddleware } from 'hono/factory';
import { auth, type AuthSession, type AuthUser } from './index.js';

export type AuthEnv = {
  Variables: {
    user: AuthUser;
    session: AuthSession;
  };
};

// Tolak request tanpa sesi login. Route setelahnya bisa memakai c.var.user.id
// untuk memfilter setiap query.
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const result = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!result) {
    return c.json({ error: 'Belum masuk' }, 401);
  }
  c.set('user', result.user);
  c.set('session', result.session);
  await next();
});
