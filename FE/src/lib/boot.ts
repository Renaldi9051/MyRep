import { applyTheme } from './theme';

// Layar pembuka #boot (index.html) menutupi app saat dibuka dari ikon: menyambung splash bawaan HP,
// menunggu status login dan font siap, lalu memudar sekali. Tanpa ini layar berganti bertahap
// (kosong, splash kecil, konten, font berganti) dan terasa patah.
const FONT_WAIT_MS = 1200;
const FADE_FALLBACK_MS = 700;

let hidden = false;

export function hideBoot() {
  if (hidden) return;
  hidden = true;
  const el = document.getElementById('boot');
  if (!el) return;

  const fonts = document.fonts?.ready ?? Promise.resolve();
  const cap = new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS));
  void Promise.race([fonts, cap]).then(() => {
    // Dua frame: pastikan halaman pertama sudah tergambar di balik layar pembuka
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
