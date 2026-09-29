export const nowIso = (): string => new Date().toISOString();

const pad = (n: number) => String(n).padStart(2, '0');

// Tanggal lokal (bukan UTC), karena "satu sesi per hari" mengikuti hari di HP pengguna
export function localDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseLocalDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

export function addDays(date: string, days: number): string {
  const d = parseLocalDate(date);
  d.setDate(d.getDate() + days);
  return localDate(d);
}

// Minggu dimulai Senin
export function startOfWeek(date: string): string {
  const day = parseLocalDate(date).getDay(); // 0 = Minggu
  return addDays(date, day === 0 ? -6 : 1 - day);
}

// DESIGN.md §3: SEN, SEL, RAB, KAM, JUM, SAB, MIN
const DAY_SHORT = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
export const dayShort = (date: string): string => DAY_SHORT[parseLocalDate(date).getDay()]!;
