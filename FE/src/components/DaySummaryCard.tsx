import { Trophy } from 'lucide-react';
import type { DaySummary } from '../features/workout/queries';
import { summaryStats } from '../features/workout/summary';
import { formatNumber } from '../lib/format';

// Ringkasan latihan satu hari di Riwayat: angka total + rekor beban baru
export function DaySummaryCard({ summary }: { summary: DaySummary }) {
  const stats = summaryStats(summary);

  if (stats.length === 0 && summary.records.length === 0) return null;

  return (
    <section className="day-summary" aria-label="Ringkasan latihan">
      {stats.length > 0 && (
        <div className="day-summary__stats">
          {stats.map((s) => (
            <div key={s.label} className="day-summary__stat">
              <span className="day-summary__value">{s.value}</span>
              <span className="day-summary__label">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {summary.records.length > 0 && (
        <ul className="day-summary__records" aria-label="Rekor baru">
          {summary.records.map((r) => (
            <li key={r.exercise.id}>
              <Trophy size={16} strokeWidth={1.75} />
              <span className="day-summary__record-name">Rekor {r.exercise.name}</span>
              <span className="num">
                {formatNumber(r.weightKg)} kg
              </span>
              <span className="day-summary__delta num">+{formatNumber(r.weightKg - r.previousKg)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
