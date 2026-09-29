import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useSyncExternalStore } from 'react';
import { countPending } from '../../db';
import { syncNow, syncStore, type SyncState } from './engine';

export function useSyncState(): SyncState {
  return useSyncExternalStore(syncStore.subscribe, syncStore.getSnapshot);
}

// Jumlah perubahan lokal yang belum terkirim ke server
export function usePendingCount(): number {
  return useLiveQuery(countPending) ?? 0;
}

// Pemicu sinkron selama user login: saat mulai, saat online lagi, saat app dibuka
// kembali, dan berkala tiap menit (F7.2, F7.3).
export function useSyncTriggers(): void {
  useEffect(() => {
    void syncNow();
    const run = () => void syncNow();
    const onVisible = () => {
      if (document.visibilityState === 'visible') run();
    };
    window.addEventListener('online', run);
    window.addEventListener('offline', run);
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(() => {
      if (navigator.onLine) run();
    }, 60_000);
    return () => {
      window.removeEventListener('online', run);
      window.removeEventListener('offline', run);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, []);
}
