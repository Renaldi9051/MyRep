// Langkah tombol +/− sesuai PRD. Dibulatkan ke 1 desimal supaya 0,1 + 0,2 tidak jadi 0,30000000000000004.

export const WEIGHT_STEP = 2.5; // F2.4
export const INCLINE_STEP = 0.5; // F6.3
export const SPEED_STEP = 0.1; // F6.4
export const MINUTE = 60; // F6.2, koreksi ±1 menit

export const DEFAULT_SPEED = 5;

const LIMITS = {
  weight: 999,
  incline: 30,
  speed: 30,
  duration: 24 * 60 * 60,
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

export const stepWeight = (kg: number, dir: 1 | -1) => clamp(round1(kg + dir * WEIGHT_STEP), LIMITS.weight);
export const stepSpeed = (kmh: number, dir: 1 | -1) => clamp(round1(kmh + dir * SPEED_STEP), LIMITS.speed);
export const stepDuration = (sec: number, dir: 1 | -1) => clamp(sec + dir * MINUTE, LIMITS.duration);

// Incline boleh kosong (alat tanpa incline): turun dari 0 menjadi kosong, naik dari kosong menjadi 0
export function stepIncline(pct: number | null, dir: 1 | -1): number | null {
  if (pct === null) return dir === 1 ? 0 : null;
  if (pct === 0 && dir === -1) return null;
  return clamp(round1(pct + dir * INCLINE_STEP), LIMITS.incline);
}

export const canInc = {
  weight: (kg: number) => kg < LIMITS.weight,
  speed: (kmh: number) => kmh < LIMITS.speed,
  incline: (pct: number | null) => pct === null || pct < LIMITS.incline,
};
