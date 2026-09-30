import { useEffect, useRef } from 'react';
import { createMannequin, type Mannequin } from './mannequin3d';
import type { Gerakan } from './types';

export type Props = { data: Gerakan; playing: boolean; label: string; onGagal: () => void };

// Di-import lazy dari GerakanSheet, jadi Three.js (±150 KB gzip) hanya diunduh
// saat panduan gerakan pertama kali dibuka, lalu tersimpan di cache service worker.
export default function GerakanFigure3D({ data, playing, label, onGagal }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const inst = useRef<Mannequin | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    try {
      inst.current = createMannequin(canvas);
    } catch {
      onGagal(); // WebGL tidak tersedia, kembali ke figur garis
      return;
    }
    return () => {
      inst.current?.dispose();
      inst.current = null;
    };
  }, [onGagal]);

  useEffect(() => {
    inst.current?.setData(data);
  }, [data]);

  useEffect(() => {
    if (playing) inst.current?.play();
    else inst.current?.pause();
  }, [playing, data]);

  return <canvas ref={ref} className="gerakan__canvas" role="img" aria-label={label} />;
}
