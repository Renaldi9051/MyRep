import { useSyncExternalStore } from 'react';

// Pasang MyReps sebagai ikon di layar utama HP (PWA).
// Chrome/Edge/Brave/Samsung Internet mengirim `beforeinstallprompt` sekali saat halaman dimuat,
// jadi event ditangkap sejak awal (main.tsx) dan disimpan sampai pengguna menekan "Buat ikon".
// Safari iOS tidak punya event ini; pengguna harus lewat tombol Bagikan.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type InstallState = {
  standalone: boolean; // sedang dibuka dari ikon layar utama
  canPrompt: boolean; // browser bisa menampilkan dialog pasang sendiri
  ios: boolean;
};

const standaloneQuery = window.matchMedia('(display-mode: standalone)');
const ios =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS mengaku Mac

let deferred: InstallPromptEvent | null = null;
let state = read();
const listeners = new Set<() => void>();

function read(): InstallState {
  const legacyStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return { standalone: standaloneQuery.matches || legacyStandalone, canPrompt: deferred !== null, ios };
}

function update() {
  state = read();
  listeners.forEach((fn) => fn());
}

export function listenForInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // tahan banner otomatis; dialog muncul saat tombol ditekan
    deferred = e as InstallPromptEvent;
    update();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    update();
  });
  standaloneQuery.addEventListener('change', update);
}

// true kalau dialog pasang tampil dan pengguna menyetujui
export async function promptInstall(): Promise<boolean> {
  const e = deferred;
  if (!e) return false;
  deferred = null; // event hanya bisa dipakai sekali
  await e.prompt();
  const { outcome } = await e.userChoice;
  update();
  return outcome === 'accepted';
}

export function useInstall(): InstallState {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
  );
}
