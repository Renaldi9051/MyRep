import { Pause, Play } from 'lucide-react';
import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType } from 'react';
import { Sheet } from '../../components/Sheet';
import { GerakanFigure } from './GerakanFigure';
import type { Props as Figure3DProps } from './GerakanFigure3D';
import { loadGerakan } from './registry';
import type { Gerakan } from './types';

// Chunk 3D gagal diunduh (misal offline sebelum tersimpan): kembali ke figur garis
function Gagal3D({ onGagal }: Figure3DProps) {
  useEffect(() => onGagal(), [onGagal]);
  return null;
}

const GerakanFigure3D = lazy<ComponentType<Figure3DProps>>(() =>
  import('./GerakanFigure3D').catch(() => ({ default: Gagal3D })),
);

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

type Props = { exerciseName: string; movementKey: string; onClose: () => void };

// Panduan gerakan (DESIGN §5.16): animasi, otot yang dilatih, dan cue.
// Dibuka dari tombol teks "Lihat gerakan" di layar penghitung. Animasi berhenti saat
// sheet ditutup karena komponennya dilepas.
export function GerakanSheet({ exerciseName, movementKey, onClose }: Props) {
  const [data, setData] = useState<Gerakan | null>(null);
  const [gagal, setGagal] = useState(false);
  // prefers-reduced-motion: tidak diputar otomatis, tapi tetap bisa diputar lewat tombol
  const [playing, setPlaying] = useState(() => !reduceMotion());
  const [pakai3D, setPakai3D] = useState(true);
  const fallback = useCallback(() => setPakai3D(false), []);

  useEffect(() => {
    let aktif = true;
    loadGerakan(movementKey).then(
      (d) => aktif && setData(d),
      () => aktif && setGagal(true),
    );
    return () => {
      aktif = false;
    };
  }, [movementKey]);

  const memuat = (teks: string) => <p className="gerakan__status">{teks}</p>;

  return (
    <Sheet title={exerciseName} onClose={onClose} closeLabel="Tutup panduan gerakan">
      <div className="gerakan">
        <div className="gerakan__stage">
          {gagal ? (
            memuat('Panduan belum tersedia offline. Coba lagi saat online.')
          ) : !data ? (
            memuat('Memuat…')
          ) : pakai3D ? (
            <Suspense fallback={memuat('Memuat 3D…')}>
              <GerakanFigure3D
                data={data}
                playing={playing}
                label={`Animasi 3D gerakan ${exerciseName}, geser untuk memutar`}
                onGagal={fallback}
              />
            </Suspense>
          ) : (
            <GerakanFigure data={data} playing={playing} label={`Animasi gerakan ${exerciseName}`} />
          )}
          {data && (
            <button
              type="button"
              className="icon-circle gerakan__toggle"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Jeda animasi' : 'Putar animasi'}
            >
              {playing ? <Pause size={18} strokeWidth={1.75} /> : <Play size={18} strokeWidth={1.75} />}
            </button>
          )}
        </div>

        {data && (
          <>
            <ul className="gerakan__muscles" aria-label="Otot yang dilatih">
              {data.otot.utama.map((o) => (
                <li key={o} className="gerakan__chip gerakan__chip--main">
                  {o}
                </li>
              ))}
              {data.otot.bantu.map((o) => (
                <li key={o} className="gerakan__chip">
                  {o}
                </li>
              ))}
            </ul>
            <ol className="gerakan__cues">
              {data.cue.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </Sheet>
  );
}
