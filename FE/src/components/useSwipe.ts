import { useLayoutEffect, useRef, type MouseEvent, type PointerEvent } from 'react';

const SLOP = 8; // px sebelum gerakan dianggap geser, bukan tap
const DISTANCE = 0.22; // bagian lebar layar yang harus digeser untuk pindah halaman
const FLICK = 0.35; // px/ms: kibasan cepat tetap pindah walau jaraknya pendek
const DURATION = 280;
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

type Options = {
  pageKey: string; // berubah setiap halaman tengah berganti
  canPrev: boolean;
  canNext: boolean;
  onChange: (delta: 1 | -1) => void; // 1 = berikutnya (geser ke kiri), -1 = sebelumnya
};

type Drag = { id: number; x: number; y: number; w: number; locked: boolean; samples: { t: number; x: number }[] };

// Pager tiga halaman (sebelumnya, sekarang, berikutnya) yang digeser dengan jari.
// Posisi track diubah langsung lewat style (bukan state React) supaya tiap frame ringan di HP;
// halaman tetangga ikut terlihat selama digeser, lalu track meluncur ke halaman tujuan.
export function useSwipePager({ pageKey, canPrev, canNext, onChange }: Options) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const swiped = useRef(false);
  const busy = useRef(false);
  const frame = useRef(0);
  const latest = useRef({ canPrev, canNext, onChange });
  latest.current = { canPrev, canNext, onChange };

  const place = (pct: number, px: number, animate: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${DURATION}ms ${EASE}` : 'none';
    el.style.transform = `translate3d(calc(${pct}% + ${px}px), 0, 0)`;
  };

  // Halaman tengah sudah berisi konten baru: kembalikan track ke tengah sebelum layar digambar
  useLayoutEffect(() => {
    busy.current = false;
    place(-100, 0, false);
  }, [pageKey]);

  const can = (delta: 1 | -1) => (delta === 1 ? latest.current.canNext : latest.current.canPrev);

  const settle = (delta: 1 | -1) => {
    const el = trackRef.current;
    busy.current = true;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      latest.current.onChange(delta);
      return;
    }
    place(-100 - delta * 100, 0, true);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timer);
      latest.current.onChange(delta);
    };
    // transitionend dari tombol di dalam track ikut naik ke sini, jadi cek target
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el) finish();
    };
    const timer = window.setTimeout(finish, DURATION + 100);
    el.addEventListener('transitionend', onEnd);
  };

  // Untuk tombol panah: animasi sama seperti geser
  const go = (delta: 1 | -1) => {
    if (!busy.current && can(delta)) settle(delta);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    swiped.current = false;
    if (busy.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      w: e.currentTarget.clientWidth,
      locked: false,
      samples: [{ t: performance.now(), x: e.clientX }],
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    let dx = e.clientX - d.x;
    if (!d.locked) {
      const dy = e.clientY - d.y;
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null; // geser vertikal: biarkan browser scroll
        return;
      }
      d.locked = true;
      swiped.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    d.samples.push({ t: performance.now(), x: e.clientX });
    if (d.samples.length > 6) d.samples.shift();
    // Di ujung (bulan ini atau data paling awal) isi hanya bergeser sedikit sebagai tanda
    if ((dx > 0 && !latest.current.canPrev) || (dx < 0 && !latest.current.canNext)) dx /= 3;
    dx = Math.max(-d.w, Math.min(d.w, dx));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => place(-100, dx, false));
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !d.locked) return;
    cancelAnimationFrame(frame.current);
    const dx = e.clientX - d.x;
    const now = performance.now();
    const from = d.samples.find((s) => now - s.t < 100) ?? d.samples[0];
    const v = from && now > from.t ? (e.clientX - from.x) / (now - from.t) : 0;
    const delta: 1 | -1 = dx < 0 ? 1 : -1;
    const far = Math.abs(dx) > d.w * DISTANCE;
    const flick = Math.abs(v) > FLICK && Math.sign(v) === Math.sign(dx);
    if (can(delta) && (far || flick)) settle(delta);
    else place(-100, 0, true);
  };

  const onPointerCancel = () => {
    const d = drag.current;
    drag.current = null;
    cancelAnimationFrame(frame.current);
    if (d?.locked) place(-100, 0, true);
  };

  // Tap yang berakhir sebagai geser tidak boleh ikut memilih tanggal
  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (!swiped.current) return;
    swiped.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    trackRef,
    go,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClickCapture },
  };
}
