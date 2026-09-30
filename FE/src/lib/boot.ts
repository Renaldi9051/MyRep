import { useEffect } from 'react';
import { applyTheme } from './theme';

// Layar pembuka #boot (index.html) menutupi app saat dibuka dari ikon: menyambung splash bawaan HP,
// menunggu halaman pertama lengkap (status login, data Dexie, font), lalu memudar sekali saat
// CPU senggang. Tanpa ini layar berganti bertahap dan isi halaman "meletup" setelah terbuka.
const FONT_WAIT_MS = 1200;
const IDLE_WAIT_MS = 300;
const FADE_FALLBACK_MS = 800;
const SAFETY_MS = 3000; // jaring pengaman kalau tidak ada halaman yang memberi sinyal siap

let requested = false;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

// Tunggu main thread lega (kerja awal seperti render dan sinkron selesai) supaya pudarnya tidak tersendat
const idle = () =>
  new Promise<void>((resolve) => {
    // Safari iOS belum punya requestIdleCallback
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => resolve(), { timeout: IDLE_WAIT_MS });
    } else {
      setTimeout(resolve, 50);
    }
  });

export function hideBoot() {
  if (requested) return;
  requested = true;
  const el = document.getElementById('boot');
  if (!el) return;

  const fonts = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  void Promise.race([fonts, wait(FONT_WAIT_MS)])
    .then(idle)
    .then(() => {
      // Dua frame: pastikan halaman sudah tergambar di balik layar pembuka
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          el.classList.add('is-done');
          let removed = false;
          const remove = () => {
            if (removed) return;
            removed = true;
            el.remove();
            applyTheme(); // warna status bar kembali mengikuti tema
          };
          el.addEventListener('transitionend', (e) => {
            if (e.target === el) remove();
          });
          window.setTimeout(remove, FADE_FALLBACK_MS); // transisi dimatikan (reduced motion)
        }),
      );
    });
}

export function scheduleBootSafety() {
  window.setTimeout(hideBoot, SAFETY_MS);
}

// Dipanggil halaman pertama: layar pembuka baru memudar setelah isinya siap
export function useBootReady(ready: boolean) {
  useEffect(() => {
    if (ready) hideBoot();
  }, [ready]);
}
