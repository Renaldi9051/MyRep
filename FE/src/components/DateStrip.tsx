import { useLayoutEffect, useRef } from 'react';
import { addDays, dayShort, localDate, parseLocalDate } from '../lib/time';

const DAYS_BACK = 62;
// Hari sebelum tanggal terpilih yang ikut tampil kalau tanggal itu lebih lama dari DAYS_BACK
const DAYS_BEFORE_SELECTED = 14;

type Props = {
  selected: string;
  onSelect: (date: string) => void;
  activeDates: Set<string>;
};

// DESIGN §5.11: 5 kotak terlihat, hari ini di posisi ke-4, besok putus-putus.
// Tambahan: geser ke kanan untuk hari yang lebih lama, titik kecil = ada latihan.
export function DateStrip({ selected, onSelect, activeDates }: Props) {
  const today = localDate();
  const tomorrow = addDays(today, 1);
  const recent = addDays(today, -DAYS_BACK);
  const aroundSelected = addDays(selected, -DAYS_BEFORE_SELECTED);
  const days: string[] = [];
  for (let d = aroundSelected < recent ? aroundSelected : recent; d <= tomorrow; d = addDays(d, 1)) days.push(d);
  const ref = useRef<HTMLDivElement>(null);

  // Kalau tanggal terpilih di luar layar (awal buka atau dipilih dari kalender),
  // geser supaya ia di posisi ke-4 seperti hari ini
  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.querySelector<HTMLElement>('.is-selected');
    if (!el || !box) return;
    const c = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (b.left >= c.left && b.right <= c.right) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollLeft += b.right - (c.right - b.width - gap);
  }, [selected]);

  return (
    <div className="dates" ref={ref} role="group" aria-label="Pilih tanggal">
      {days.map((date) => {
        const future = date > today;
        const isSelected = date === selected;
        const cls = ['date-box', isSelected && 'is-selected', future && 'is-future'].filter(Boolean).join(' ');
        return (
          <button
            key={date}
            type="button"
            className={cls}
            disabled={future}
            aria-pressed={isSelected}
            aria-label={parseLocalDate(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            onClick={() => onSelect(date)}
          >
            <span className="date-box__day">{dayShort(date)}</span>
            <span className="date-box__num">{parseLocalDate(date).getDate()}</span>
            <span className={activeDates.has(date) ? 'date-box__dot has-data' : 'date-box__dot'} />
          </button>
        );
      })}
    </div>
  );
}
