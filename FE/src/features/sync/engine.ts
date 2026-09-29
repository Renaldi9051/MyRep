import type { InsertType, Table } from 'dexie';
import { ApiError } from '../../api/client';
import { pullChanges, pushChanges } from '../../api/sync';
import { db, getMeta, setMeta } from '../../db';
import type { Local } from '../../db/types';
import { nowIso } from '../../lib/time';

// Alur sinkron (PRD F7.2–F7.4):
// 1. Push: kirim baris pending=1 ke BE, lalu tandai terkirim kalau belum diubah lagi selama push.
// 2. Pull: ambil perubahan setelah cursor terakhir; versi lokal yang belum terkirim dan
//    lebih baru tidak ditimpa (updated_at terbaru menang).

// offline = HP tidak ada internet; unreachable = ada internet tapi server tidak menjawab
export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'unreachable' | 'error';
export type SyncState = { status: SyncStatus; lastSyncedAt: string | null; error: string | null };

const BATCH = 500;
const CURSOR_KEY = 'cursor';

type Row = Local<{ id: string; updated_at: string }>;
// Tabel Dexie dengan primary key string "id" (exercises, sessions, sets)
type SyncTable<T extends Row> = Table<T, string, InsertType<T, 'id'>>;

// --- status untuk UI (useSyncExternalStore) ---

let state: SyncState = { status: 'idle', lastSyncedAt: null, error: null };
const listeners = new Set<() => void>();

function setState(patch: Partial<SyncState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export const syncStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
};

// --- handler sesi habis (diisi AuthProvider) ---

let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

// --- penjadwalan ---

let timer: ReturnType<typeof setTimeout> | undefined;
let running: Promise<void> | null = null;
let again = false;

// Dipanggil setelah setiap perubahan lokal; ditunda sebentar supaya tap beruntun jadi satu push
export function requestSync(delayMs = 1500): void {
  clearTimeout(timer);
  timer = setTimeout(() => void syncNow(), delayMs);
}

export function syncNow(): Promise<void> {
  if (running) {
    again = true;
    return running;
  }
  running = (async () => {
    try {
      do {
        again = false;
        await runOnce();
      } while (again);
    } finally {
      running = null;
    }
  })();
  return running;
}

export function cancelScheduledSync(): void {
  clearTimeout(timer);
}

async function runOnce(): Promise<void> {
  if (!navigator.onLine) {
    setState({ status: 'offline' });
    return;
  }
  setState({ status: 'syncing', error: null });
  try {
    await pushAll();
    await pullAll();
    setState({ status: 'idle', lastSyncedAt: nowIso() });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      setState({ status: 'idle' });
      onUnauthorized();
    } else if (err instanceof ApiError && err.isNetwork) {
      setState({ status: navigator.onLine ? 'unreachable' : 'offline' });
    } else {
      setState({ status: 'error', error: err instanceof Error ? err.message : String(err) });
    }
  }
}

// --- push ---

function pending<T extends Row>(table: SyncTable<T>): Promise<T[]> {
  return table.where('pending').equals(1).limit(BATCH).toArray();
}

function withoutPending<T extends Row>(rows: T[]): Omit<T, 'pending'>[] {
  return rows.map(({ pending: _, ...rest }) => rest);
}

async function markPushed<T extends Row>(table: SyncTable<T>, sent: T[]): Promise<void> {
  await db.transaction('rw', table, async () => {
    for (const row of sent) {
      const current = await table.get(row.id);
      // Kalau diubah lagi selama push, biarkan pending supaya terkirim di putaran berikutnya
      if (current && current.updated_at === row.updated_at) {
        await table.put({ ...current, pending: 0 });
      }
    }
  });
}

async function pushAll(): Promise<void> {
  for (let round = 0; round < 50; round++) {
    const [exercises, sessions, sets] = await Promise.all([
      pending(db.exercises),
      pending(db.sessions),
      pending(db.sets),
    ]);
    if (exercises.length + sessions.length + sets.length === 0) return;

    const result = await pushChanges({
      exercises: withoutPending(exercises),
      sessions: withoutPending(sessions),
      sets: withoutPending(sets),
    });
    if (result.rejected.length > 0) {
      console.warn('Sebagian data ditolak server:', result.rejected);
    }
    // Baris yang di-skip server (versi server lebih baru) juga dianggap terkirim;
    // versi server akan datang lewat pull.
    await markPushed(db.exercises, exercises);
    await markPushed(db.sessions, sessions);
    await markPushed(db.sets, sets);
  }
}

// --- pull ---

async function applyRemote<T extends Row>(table: SyncTable<T>, remote: Omit<T, 'pending'>[]) {
  if (remote.length === 0) return;
  const local = await table.bulkGet(remote.map((r) => r.id));
  const toPut: T[] = [];
  remote.forEach((row, i) => {
    const mine = local[i];
    if (mine && mine.pending === 1 && mine.updated_at > row.updated_at) return;
    toPut.push({ ...row, pending: 0 } as T);
  });
  await table.bulkPut(toPut);
}

async function pullAll(): Promise<void> {
  let since = (await getMeta<number>(CURSOR_KEY)) ?? 0;
  for (let page = 0; page < 200; page++) {
    const res = await pullChanges(since);
    await db.transaction('rw', [db.exercises, db.sessions, db.sets, db.meta], async () => {
      await applyRemote(db.exercises, res.exercises);
      await applyRemote(db.sessions, res.sessions);
      await applyRemote(db.sets, res.sets);
      await setMeta(CURSOR_KEY, res.cursor);
    });
    since = res.cursor;
    if (!res.has_more) return;
  }
}
