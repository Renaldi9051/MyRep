import { useEffect, useRef } from 'react';
import { sendi, type Alat, type Gerakan, type Pose, type Titik } from './types';

// Figur garis (cadangan kalau WebGL tidak ada). Animasi pakai SMIL <animate> bawaan SVG:
// tanpa library, tanpa requestAnimationFrame, tanpa re-render React. Browser yang
// menginterpolasi koordinat antar pose.
// data.bagi = porsi durasi dari pose 0 ke pose 1 (default 0,6: turun pelan, naik cepat).
const SPLINES = '0.45 0 0.55 1;0.45 0 0.55 1';

function Anim({ attr, a, b, data }: { attr: string; a: number; b: number; data: Gerakan }) {
  if (a === b) return null;
  return (
    <animate
      attributeName={attr}
      values={`${a};${b};${a}`}
      keyTimes={`0;${data.bagi ?? 0.6};1`}
      calcMode="spline"
      keySplines={SPLINES}
      dur={`${data.tempo}s`}
      repeatCount="indefinite"
    />
  );
}

// Titik bisa nama sendi (bergerak) atau [x, y] tetap, plus geser y
const titik = (p: Pose, t: string | Titik, dy = 0): [number, number] =>
  typeof t === 'string' ? [sendi(p, t)[0], sendi(p, t)[1] + dy] : [t[0], t[1]];

type GarisProps = { from: string | Titik; to: string | Titik; data: Gerakan; className: string; dyTo?: number };

// Garis antara dua titik
function Garis({ from, to, data, className, dyTo = 0 }: GarisProps) {
  const [p0, p1] = data.pose;
  const [a0, b0, a1, b1] = [titik(p0, from), titik(p0, to, dyTo), titik(p1, from), titik(p1, to, dyTo)];
  return (
    <line className={className} x1={a0[0]} y1={a0[1]} x2={b0[0]} y2={b0[1]}>
      <Anim attr="x1" a={a0[0]} b={a1[0]} data={data} />
      <Anim attr="y1" a={a0[1]} b={a1[1]} data={data} />
      <Anim attr="x2" a={b0[0]} b={b1[0]} data={data} />
      <Anim attr="y2" a={b0[1]} b={b1[1]} data={data} />
    </line>
  );
}

function Lingkaran({ nama, r, data, className }: { nama: string; r: number; data: Gerakan; className: string }) {
  const [x0, y0] = sendi(data.pose[0], nama);
  const [x1, y1] = sendi(data.pose[1], nama);
  return (
    <circle className={className} cx={x0} cy={y0} r={r}>
      <Anim attr="cx" a={x0} b={x1} data={data} />
      <Anim attr="cy" a={y0} b={y1} data={data} />
    </circle>
  );
}

function Beban({ data }: { data: Gerakan }) {
  const { sendi: nama, r, jenis = 'barbel' } = data.beban;
  if (jenis === 'pegangan') {
    // Pegangan tegak di tangan: garis pendek yang ikut bergerak
    const [x0, y0] = sendi(data.pose[0], nama);
    const [x1, y1] = sendi(data.pose[1], nama);
    return (
      <line className="gerakan-fig__beban gerakan-fig__pegangan" x1={x0} y1={y0 - r} x2={x0} y2={y0 + r}>
        <Anim attr="x1" a={x0} b={x1} data={data} />
        <Anim attr="x2" a={x0} b={x1} data={data} />
        <Anim attr="y1" a={y0 - r} b={y1 - r} data={data} />
        <Anim attr="y2" a={y0 + r} b={y1 + r} data={data} />
      </line>
    );
  }
  return <Lingkaran nama={nama} r={r} data={data} className="gerakan-fig__beban" />;
}

function AlatSvg({ s }: { s: Alat }) {
  if (s.type === 'rect') {
    return <rect className="gerakan-fig__alat" x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} />;
  }
  return <line className="gerakan-fig__alat" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />;
}

export function GerakanFigure({ data, playing, label }: { data: Gerakan; playing: boolean; label: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg?.pauseAnimations) return;
    if (playing) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [playing, data]);

  return (
    <svg ref={ref} viewBox={data.viewBox} className="gerakan-fig" role="img" aria-label={label}>
      {data.alat.map((s, i) => (
        <AlatSvg key={i} s={s} />
      ))}
      {(data.kabel ?? []).map((k, i) => (
        <Garis key={`k${i}`} from={k.dari} to={k.ke} dyTo={k.keDy} data={data} className="gerakan-fig__kabel" />
      ))}
      {data.tulang.map(([a, b]) => (
        <Garis key={a + b} from={a} to={b} data={data} className="gerakan-fig__tulang" />
      ))}
      {data.sorot.map(([a, b]) => (
        <Garis key={a + b} from={a} to={b} data={data} className="gerakan-fig__sorot" />
      ))}
      <Lingkaran nama={data.kepala.sendi} r={data.kepala.r} data={data} className="gerakan-fig__kepala" />
      <Beban data={data} />
    </svg>
  );
}
