import { useCallback, useEffect, useState } from 'react';

// Stopwatch kardio (F6.2). Disimpan per latihan di localStorage supaya tetap jalan
// walau layar ditinggal, app ditutup, atau HP terkunci.

type State = { startedAt: number | null; accumulatedMs: number };

const PREFIX = 'myrep:stopwatch:';
const EMPTY: State = { startedAt: null, accumulatedMs: 0 };

function read(key: string): State {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as State) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(key: string, state: State) {
  try {
    if (state.startedAt === null && state.accumulatedMs === 0) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(state));
  } catch {
    // abaikan; stopwatch tetap jalan di memori
  }
}

export function clearStopwatches(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // abaikan
  }
}

export function useStopwatch(key: string) {
  const [state, setState] = useState<State>(() => read(key));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => write(key, state), [key, state]);

  useEffect(() => {
    if (state.startedAt === null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [state.startedAt]);

  const running = state.startedAt !== null;
  const elapsedMs = state.accumulatedMs + (state.startedAt !== null ? Math.max(0, now - state.startedAt) : 0);

  const toggle = useCallback(() => {
    setState((s) =>
      s.startedAt === null
        ? { ...s, startedAt: Date.now() }
        : { startedAt: null, accumulatedMs: s.accumulatedMs + (Date.now() - s.startedAt) },
    );
  }, []);

  // Koreksi ±1 menit; total tidak boleh di bawah 0
  const adjust = useCallback((deltaMs: number) => {
    setState((s) => {
      const running = s.startedAt !== null ? Date.now() - s.startedAt : 0;
      const accumulatedMs = Math.max(-running, s.accumulatedMs + deltaMs);
      return { ...s, accumulatedMs };
    });
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  return { elapsedMs, running, toggle, adjust, reset };
}
