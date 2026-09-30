import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';

const SLOP = 10; // px sebelum gerakan dianggap geser, bukan tap
const THRESHOLD = 50; // px geser minimal untuk pindah halaman

type Options = {
  onSwipe: (delta: 1 | -1) => void; // 1 = berikutnya (geser ke kiri), -1 = sebelumnya
  canPrev: boolean;
  canNext: boolean;
};

// Geser horizontal dengan jari untuk pindah halaman (bulan/tahun di kalender).
// Isi ikut jari selama digeser; geser vertikal tetap dipakai browser untuk scroll.
export function useSwipe({ onSwipe, canPrev, canNext }: Options) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiping = useRef(false);
  const offset = useRef(0);
  const [dx, setDx] = useState(0);

  const move = (d: number) => {
    offset.current = d;
    setDx(d);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiping.current = false;
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    let d = e.clientX - s.x;
    if (!swiping.current) {
      if (Math.abs(d) < SLOP) return;
      if (Math.abs(e.clientY - s.y) > Math.abs(d)) {
        start.current = null;
        return;
      }
      swiping.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // Di ujung (bulan ini atau data paling awal) isi hanya bergeser sedikit sebagai tanda
    if ((d > 0 && !canPrev) || (d < 0 && !canNext)) d /= 4;
    move(d);
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    start.current = null;
    const d = offset.current;
    move(0);
    if (d <= -THRESHOLD && canNext) onSwipe(1);
    else if (d >= THRESHOLD && canPrev) onSwipe(-1);
  };

  const onPointerCancel = () => {
    start.current = null;
    swiping.current = false;
    move(0);
  };

  // Tap yang berakhir sebagai geser tidak boleh ikut memilih tanggal
  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (!swiping.current) return;
    swiping.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    dx,
    dragging: dx !== 0,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    },
  };
}
