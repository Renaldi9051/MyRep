// Tema tampilan: ikut sistem (auto) atau dipaksa terang/gelap.
// Pilihan disimpan per perangkat; index.html membaca kunci yang sama sebelum render supaya tidak berkedip.
export type ThemePref = 'auto' | 'light' | 'dark';

const KEY = 'myrep:theme';
const THEME_COLOR = { light: '#FFFFFF', dark: '#111111' } as const;
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function getThemePref(): ThemePref {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === 'light' || raw === 'dark' ? raw : 'auto';
  } catch {
    return 'auto';
  }
}

function resolved(pref: ThemePref): 'light' | 'dark' {
  if (pref !== 'auto') return pref;
  return darkQuery.matches ? 'dark' : 'light';
}

export function applyTheme(pref: ThemePref = getThemePref()) {
  const root = document.documentElement;
  if (pref === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[resolved(pref)]);
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // localStorage diblokir: tema tetap berlaku selama tab terbuka
  }
  applyTheme(pref);
}

// Warna status bar ikut berubah saat tema sistem berganti (hanya berpengaruh di mode auto)
export function watchSystemTheme() {
  darkQuery.addEventListener('change', () => applyTheme());
}
