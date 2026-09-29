const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  // status 0 = tidak sampai ke server (offline, server mati)
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

type ErrorBody = { error?: string; message?: string; code?: string };

export async function apiFetch<T>(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown } = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method: init.method ?? 'GET',
      headers: init.body === undefined ? undefined : { 'content-type': 'application/json' },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      credentials: 'include',
    });
  } catch {
    throw new ApiError(0, navigator.onLine ? 'Server tidak bisa dihubungi' : 'Tidak ada koneksi internet');
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Bukan JSON (mis. halaman error dari proxy)
  }
  // BE mati di balik proxy (Vite saat dev, Caddy di VPS): 502/503/504, atau 5xx tanpa body JSON
  if ([502, 503, 504].includes(res.status) || (res.status >= 500 && data === null)) {
    throw new ApiError(0, 'Server tidak bisa dihubungi');
  }
  if (!res.ok) {
    const body = (data ?? {}) as ErrorBody;
    throw new ApiError(res.status, body.error ?? body.message ?? 'Terjadi kesalahan', body.code);
  }
  return data as T;
}
