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
    throw new ApiError(0, 'Tidak ada koneksi internet');
  }

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const body = (data ?? {}) as ErrorBody;
    throw new ApiError(res.status, body.error ?? body.message ?? 'Terjadi kesalahan', body.code);
  }
  return data as T;
}
