import { formatNumber } from '../../lib/format';
import type { DaySummary } from './queries';

export type SummaryStat = { value: string; label: string };

// Angka ringkasan hari yang ditampilkan (kartu Riwayat dan PDF); yang nol tidak ikut
export function summaryStats(summary: DaySummary): SummaryStat[] {
  const stats: SummaryStat[] = [];
  const minutes = (sec: number) => formatNumber(Math.round(sec / 60));
  if (summary.reps > 0) stats.push({ value: formatNumber(summary.reps), label: 'total rep' });
  if (summary.volumeKg > 0) stats.push({ value: formatNumber(Math.round(summary.volumeKg)), label: 'volume kg' });
  if (summary.cardioSec > 0) stats.push({ value: minutes(summary.cardioSec), label: 'mnt kardio' });
  if (summary.durationSec >= 60) stats.push({ value: minutes(summary.durationSec), label: 'mnt durasi' });
  return stats;
}
