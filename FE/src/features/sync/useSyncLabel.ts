import { usePendingCount, useSyncState } from './hooks';

export type SyncLabel = { text: string; synced: boolean };

// Teks status sinkron untuk UI: pengguna tahu data aman di HP walau belum terkirim
export function useSyncLabel(): SyncLabel {
  const { status } = useSyncState();
  const pending = usePendingCount();

  if (status === 'offline') {
    return { text: pending > 0 ? `Offline · ${pending} tersimpan di HP` : 'Offline', synced: false };
  }
  if (status === 'error') return { text: 'Gagal sinkron', synced: false };
  if (status === 'syncing' || pending > 0) {
    return { text: pending > 0 ? `Menyinkron ${pending} perubahan` : 'Menyinkron', synced: false };
  }
  return { text: 'Tersinkron', synced: true };
}
