import { formatLongDate, formatNumber, formatSet } from '../../lib/format';
import { muscleLabel } from '../../lib/labels';
import type { DayGroup, DaySummary } from './queries';
import { summaryStats } from './summary';

// PDF hasil latihan satu hari, dibuat di perangkat (jalan juga saat offline).
// jsPDF dimuat hanya saat dipakai supaya tidak memperbesar bundle awal.

type Rgb = [number, number, number];
const INK: Rgb = [17, 17, 17];
const MUTED: Rgb = [94, 94, 91];
const LINE: Rgb = [218, 218, 214];
const ACCENT: Rgb = [200, 241, 105];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - 20;

export async function downloadDayPdf(date: string, groups: DayGroup[], summary: DaySummary): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN + 4;

  const text = (value: string, x: number, size: number, opts: { bold?: boolean; color?: Rgb; right?: boolean } = {}) => {
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? INK));
    doc.text(value, x, y, opts.right ? { align: 'right' } : undefined);
  };
  const line = (at: number) => {
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, at, PAGE_W - MARGIN, at);
  };
  // Pindah halaman kalau sisa ruang kurang dari tinggi yang dibutuhkan
  const ensure = (height: number) => {
    if (y + height <= BOTTOM) return;
    doc.addPage();
    y = MARGIN + 4;
  };

  // Kepala
  text('MyReps', MARGIN, 11, { bold: true, color: MUTED });
  y += 10;
  text('Ringkasan Latihan', MARGIN, 22, { bold: true });
  y += 8;
  text(formatLongDate(date), MARGIN, 12, { color: MUTED });
  const muscles = [...new Set(groups.map((g) => g.exercise.muscle_group))].map(muscleLabel);
  if (muscles.length > 0) {
    y += 6;
    text(muscles.join(', '), MARGIN, 12);
  }
  y += 8;

  // Kotak angka
  const exerciseCount = new Set(groups.map((g) => g.exercise.id)).size;
  const setCount = groups.reduce((sum, g) => sum + g.sets.length, 0);
  const stats = [
    { value: formatNumber(exerciseCount), label: 'latihan' },
    { value: formatNumber(setCount), label: 'set' },
    ...summaryStats(summary),
  ];
  const gap = 3;
  const boxW = (CONTENT_W - gap * (stats.length - 1)) / stats.length;
  const boxH = 20;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.4);
  stats.forEach((s, i) => {
    const x = MARGIN + i * (boxW + gap);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, 'S');
    const cx = x + boxW / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...INK);
    doc.text(s.value, cx, y + 10, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(s.label, cx, y + 16, { align: 'center' });
  });
  y += boxH + 10;

  // Rekor baru
  if (summary.records.length > 0) {
    ensure(14);
    text('Rekor baru', MARGIN, 13, { bold: true });
    y += 7;
    for (const r of summary.records) {
      ensure(8);
      const delta = `+${formatNumber(r.weightKg - r.previousKg)} kg`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const badgeW = doc.getTextWidth(delta) + 6;
      doc.setFillColor(...ACCENT);
      doc.roundedRect(PAGE_W - MARGIN - badgeW, y - 4, badgeW, 5.6, 2.8, 2.8, 'F');
      text(delta, PAGE_W - MARGIN - 3, 9, { bold: true, right: true });
      text(r.exercise.name, MARGIN, 11);
      text(`${formatNumber(r.weightKg)} kg`, PAGE_W - MARGIN - badgeW - 4, 11, { bold: true, right: true });
      y += 7;
    }
    y += 4;
  }

  // Detail per latihan
  ensure(14);
  text('Detail latihan', MARGIN, 13, { bold: true });
  y += 4;
  for (const g of groups) {
    ensure(18);
    y += 6;
    text(g.exercise.name, MARGIN, 12, { bold: true });
    text(muscleLabel(g.exercise.muscle_group), PAGE_W - MARGIN, 10, { color: MUTED, right: true });
    y += 2.5;
    line(y);
    g.sets.forEach((s, i) => {
      ensure(7);
      y += 5.5;
      text(`Set ${i + 1}`, MARGIN + 2, 10.5, { color: MUTED });
      text(formatSet(s), MARGIN + 22, 10.5);
    });
    y += 3;
  }

  // Kaki halaman
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    y = PAGE_H - 10;
    text('Dibuat dengan MyReps', MARGIN, 8.5, { color: MUTED });
    text(`Halaman ${p} dari ${pages}`, PAGE_W - MARGIN, 8.5, { color: MUTED, right: true });
  }

  doc.save(`myreps-${date}.pdf`);
}
