import type { WeekPoint } from '../features/workout/queries';
import { formatNumber } from '../lib/format';

type Props = {
  points: WeekPoint[];
  // Untuk aria-label, mis. "Beban Bench Press" + satuan "kg"
  subject: string;
  unit: string;
};

const W = 300;
const H = 150;
const PAD = { top: 22, right: 18, bottom: 24, left: 18 };

// DESIGN §5.13: garis --ink 2px, titik putih berborder, titik terbaru lime, label nilai
// hanya di titik pertama dan terakhir, sumbu x M1..M6
export function LineChart({ points, subject, unit }: Props) {
  const data = points
    .map((p, i) => ({ ...p, i }))
    .filter((p): p is { label: string; value: number; i: number } => p.value !== null);

  if (data.length === 0) {
    return <div className="chart__empty">Belum ada catatan dalam 6 minggu terakhir.</div>;
  }

  const values = data.map((d) => d.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (plotW * i) / Math.max(points.length - 1, 1);
  const y = (v: number) => PAD.top + plotH - ((v - min) / (max - min)) * plotH;

  const first = data[0]!;
  const last = data.at(-1)!;
  const trend = last.value > first.value ? 'naik' : last.value < first.value ? 'turun' : 'tetap';
  const label =
    data.length === 1
      ? `${subject} ${formatNumber(last.value)} ${unit} di ${last.label}`
      : `${subject} ${trend} dari ${formatNumber(first.value)} ${unit} ke ${formatNumber(last.value)} ${unit} dalam 6 minggu`;

  const path = data.map((d, k) => `${k === 0 ? 'M' : 'L'}${x(d.i)},${y(d.value)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, k) => {
        const gy = PAD.top + (plotH * k) / 4;
        return <line key={k} x1={0} x2={W} y1={gy} y2={gy} strokeWidth="1" style={{ stroke: 'var(--grid)' }} />;
      })}
      <path d={path} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: 'var(--ink)' }} />
      {data.map((d) => {
        const latest = d === last;
        return (
          <circle
            key={d.i}
            cx={x(d.i)}
            cy={y(d.value)}
            r={latest ? 6 : 4}
            strokeWidth="2"
            style={{ fill: latest ? 'var(--accent)' : 'var(--bg)', stroke: 'var(--ink)' }}
          />
        );
      })}
      {data.length > 1 && (
        <text x={x(first.i)} y={y(first.value) - 12} textAnchor="middle" fontSize="12" style={{ fill: 'var(--ink-muted)' }}>
          {formatNumber(first.value)}
        </text>
      )}
      <text x={x(last.i)} y={y(last.value) - 12} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: 'var(--ink)' }}>
        {formatNumber(last.value)}
      </text>
      {points.map((p, i) => (
        <text key={p.label} x={x(i)} y={H - 4} textAnchor="middle" fontSize="11" style={{ fill: 'var(--ink-muted)' }}>
          {p.label}
        </text>
      ))}
    </svg>
  );
}
