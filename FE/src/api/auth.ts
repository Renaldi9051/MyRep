import { apiFetch } from './client';

// Endpoint Better Auth di BE (/api/auth/*). Sesi disimpan di cookie httpOnly.

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type UserResponse = { user: AuthUser };

export async function getSession(): Promise<AuthUser | null> {
  const res = await apiFetch<UserResponse | null>('/auth/get-session');
  return res?.user ?? null;
}

export async function signInEmail(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<UserResponse>('/auth/sign-in/email', {
    method: 'POST',
    body: { email, password, rememberMe: true },
  });
  return res.user;
}

export async function signUpEmail(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<UserResponse>('/auth/sign-up/email', {
    method: 'POST',
    body: { name, email, password },
  });
  return res.user;
}

export async function signOut(): Promise<void> {
  await apiFetch('/auth/sign-out', { method: 'POST', body: {} });
}

// Pindah ke halaman login Google; setelah selesai kembali ke /latihan
export async function signInGoogle(): Promise<void> {
  const res = await apiFetch<{ url?: string }>('/auth/sign-in/social', {
    method: 'POST',
    body: { provider: 'google', callbackURL: '/latihan', errorCallbackURL: '/login?error=google' },
  });
  if (res.url) window.location.assign(res.url);
}

// Pesan Better Auth dalam bahasa Inggris; terjemahkan yang sering muncul
const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Email atau password salah',
  USER_ALREADY_EXISTS: 'Email sudah terdaftar, silakan masuk',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Email sudah terdaftar, silakan masuk',
  PASSWORD_TOO_SHORT: 'Password minimal 8 karakter',
  INVALID_EMAIL: 'Format email tidak valid',
  PROVIDER_NOT_FOUND: 'Login Google belum diaktifkan di server',
};

export function authErrorMessage(code: string | undefined, fallback: string): string {
  return (code && MESSAGES[code]) || fallback;
}
