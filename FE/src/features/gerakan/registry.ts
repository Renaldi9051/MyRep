import type { Gerakan } from './types';

// Registry gerakan. Tiap file di-import lazy, jadi hanya latihan yang dibuka
// yang diunduh (sekitar 1 KB per latihan). Tidak ada gambar, tidak ada query DB.
// Kunci sama dengan exercise.movement_key di BE (seed-data.ts).
const loaders: Record<string, () => Promise<{ default: Gerakan }>> = {
  'bench-press': () => import('./data/bench-press'),
  squat: () => import('./data/squat'),
  'chest-fly': () => import('./data/chest-fly'),
  'lat-pulldown': () => import('./data/lat-pulldown'),
  'seated-cable-row': () => import('./data/seated-cable-row'),
};

const cache = new Map<string, Promise<Gerakan>>();

export function hasGerakan(key: string | null | undefined): key is string {
  return Boolean(key && Object.hasOwn(loaders, key));
}

export function loadGerakan(key: string): Promise<Gerakan> {
  let p = cache.get(key);
  if (!p) {
    const load = loaders[key];
    if (!load) return Promise.reject(new Error(`Gerakan "${key}" tidak ada`));
    p = load().then((m) => m.default);
    // Gagal unduh (offline sebelum chunk tersimpan) jangan disimpan, supaya bisa dicoba lagi
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return p;
}
