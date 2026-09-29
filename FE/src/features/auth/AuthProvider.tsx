import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getSession, signInEmail, signOut, signUpEmail, type AuthUser } from '../../api/auth';
import { clearLocalData, countPending, getMeta, setMeta } from '../../db';
import { cancelScheduledSync, setUnauthorizedHandler, syncNow } from '../sync/engine';
import { clearStopwatches } from '../workout/stopwatch';

// Status login disimpan juga di localStorage supaya app tetap bisa dibuka offline
// (F7.1: sekali login tetap masuk). Keabsahan sesi dicek ke server saat online.

export type AuthStatus = 'loading' | 'authed' | 'guest';

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const CACHE_KEY = 'myrep:user';
const USER_META_KEY = 'userId';

function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // localStorage bisa diblokir (mode privat); login tetap jalan selama tab terbuka
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readCachedUser);
  const [status, setStatus] = useState<AuthStatus>(() => (readCachedUser() ? 'authed' : 'loading'));

  const becomeGuest = useCallback(() => {
    writeCachedUser(null);
    setUser(null);
    setStatus('guest');
  }, []);

  const adoptUser = useCallback(async (next: AuthUser) => {
    // Data lokal milik akun lain tidak boleh tercampur
    const previousId = await getMeta<string>(USER_META_KEY);
    if (previousId && previousId !== next.id) await clearLocalData();
    await setMeta(USER_META_KEY, next.id);
    writeCachedUser(next);
    setUser(next);
    setStatus('authed');
    void syncNow();
  }, []);

  useEffect(() => {
    // Sesi habis saat sinkron: kembali ke login, data lokal (termasuk yang belum terkirim) disimpan
    setUnauthorizedHandler(becomeGuest);
    let cancelled = false;
    getSession()
      .then((serverUser) => {
        if (cancelled) return;
        if (serverUser) void adoptUser(serverUser);
        else becomeGuest();
      })
      .catch(() => {
        // Offline: pakai status login terakhir
        if (!cancelled && !readCachedUser()) setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, [adoptUser, becomeGuest]);

  const login = useCallback(
    async (email: string, password: string) => adoptUser(await signInEmail(email, password)),
    [adoptUser],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) =>
      adoptUser(await signUpEmail(name, email, password)),
    [adoptUser],
  );

  // F7.5: keluar akun menghapus data lokal; data di cloud tetap aman.
  // Kirim dulu perubahan yang belum tersinkron supaya tidak hilang.
  const logout = useCallback(async () => {
    cancelScheduledSync();
    await syncNow();
    if ((await countPending()) > 0) {
      throw new Error('Masih ada data yang belum tersinkron. Coba lagi saat koneksi stabil.');
    }
    await signOut();
    await clearLocalData();
    clearStopwatches();
    becomeGuest();
  }, [becomeGuest]);

  const value = useMemo(
    () => ({ status, user, login, register, logout }),
    [status, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
