import { useLayoutEffect, useRef } from 'react';
import { addDays, dayShort, localDate, parseLocalDate } from '../lib/time';

const DAYS_BACK = 62;

type Props = {
  selected: string;
  onSelect: (date: string) => void;
  activeDates: Set<string>;
};

// DESIGN §5.11: 5 kotak terlihat, hari ini di posisi ke-4, besok putus-putus.
// Tambahan: geser ke kanan untuk hari yang lebih lama, titik kecil = ada latihan.
export function DateStrip({ selected, onSelect, activeDates }: Props) {
  const today = localDate();
  const days = Array.from({ length: DAYS_BACK + 2 }, (_, i) => addDays(today, i - DAYS_BACK));
  const ref = useRef<HTMLDivElement>(null);

  // Mulai dari ujung kanan: 3 hari lalu, hari ini, besok
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

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
