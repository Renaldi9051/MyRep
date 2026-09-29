import { useEffect } from 'react';

// F2.3: getar singkat di setiap tap. Diam saja kalau HP/browser tidak mendukung (mis. Safari iOS).
export function haptic(ms = 12): void {
  if ('vibrate' in navigator) navigator.vibrate(ms);
}

// Jaga layar tetap menyala selama penghitung/stopwatch terbuka (PRD: Wake Lock API).
// Kunci dilepas browser saat tab disembunyikan, jadi diminta ulang saat kembali terlihat.
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const next = await navigator.wakeLock.request('screen');
        if (cancelled) void next.release();
        else lock = next;
      } catch {
        // Ditolak (mis. hemat baterai); aplikasi tetap jalan normal
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release();
    };
  }, [active]);
}
