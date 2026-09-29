import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { localDate } from '../../lib/time';

// Nilai yang sedang dihitung tapi belum disimpan (rep, beban, incline, speed), per latihan.
// Disimpan di localStorage supaya tetap ada saat layar ditinggal lalu dibuka lagi di hari yang sama.

const PREFIX = 'myrep:draft:';

type Stored<T> = { date: string; value: T };

function read<T>(key: string, empty: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return empty;
    const stored = JSON.parse(raw) as Stored<T>;
    return stored.date === localDate() ? { ...empty, ...stored.value } : empty;
  } catch {
    return empty;
  }
}

function write<T>(key: string, value: T, empty: T) {
  try {
    if (JSON.stringify(value) === JSON.stringify(empty)) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify({ date: localDate(), value } satisfies Stored<T>));
  } catch {
    // abaikan; draf tetap ada di memori selama layar terbuka
  }
}

export function clearDrafts(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // abaikan
  }
}

// `empty` harus konstan (didefinisikan di luar komponen)
export function useDraft<T extends object>(key: string, empty: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => read(key, empty));
  useEffect(() => write(key, value, empty), [key, value, empty]);
  return [value, setValue];
}
