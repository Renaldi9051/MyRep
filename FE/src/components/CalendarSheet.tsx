import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatMonthYear } from '../lib/format';
import { localDate, parseLocalDate } from '../lib/time';
import { Sheet } from './Sheet';

const WEEK_LABELS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (year: number, month: number) => `${year}-${pad(month + 1)}`;

type Props = {
  selected: string;
  activeDates: Set<string>;
  onSelect: (date: string) => void;
  onClose: () => void;
};

// Kalender bulanan untuk lompat ke tanggal lama di Riwayat. Tap judul untuk pilih bulan dan tahun.
export function CalendarSheet({ selected, activeDates, onSelect, onClose }: Props) {
  const today = localDate();
  const now = parseLocalDate(today);
  const start = parseLocalDate(selected);
  const [year, setYear] = useState(start.getFullYear());
  const [month, setMonth] = useState(start.getMonth());
  const [picking, setPicking] = useState(false);

  // Hari latihan per bulan ("2026-09" -> 5), sekaligus tahun paling awal yang ada datanya
  const perMonth = new Map<string, number>();
  let minYear = Math.min(now.getFullYear(), start.getFullYear());
  for (const date of activeDates) {
    const key = date.slice(0, 7);
    perMonth.set(key, (perMonth.get(key) ?? 0) + 1);
    minYear = Math.min(minYear, Number(date.slice(0, 4)));
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const shiftMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const nav = picking ? (
    <div className="cal-nav">
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Tahun sebelumnya"
        disabled={year <= minYear}
        onClick={() => setYear(year - 1)}
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <span className="cal-nav__title num">{year}</span>
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Tahun berikutnya"
        disabled={year >= now.getFullYear()}
        onClick={() => setYear(year + 1)}
      >
        <ChevronRight size={20} strokeWidth={1.75} />
      </button>
    </div>
  ) : (
    <div className="cal-nav">
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Bulan sebelumnya"
        disabled={year <= minYear && month === 0}
        onClick={() => shiftMonth(-1)}
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <button type="button" className="cal-nav__title cal-nav__title--btn" onClick={() => setPicking(true)}>
        {formatMonthYear(year, month)}
        <ChevronDown size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Bulan berikutnya"
        disabled={isCurrentMonth}
        onClick={() => shiftMonth(1)}
      >
        <ChevronRight size={20} strokeWidth={1.75} />
      </button>
    </div>
  );

  if (picking) {
    return (
      <Sheet title="Pilih bulan" onClose={onClose}>
        {nav}
        <div className="cal-months">
          {MONTH_SHORT.map((label, m) => {
            const future = year > now.getFullYear() || (year === now.getFullYear() && m > now.getMonth());
            const count = perMonth.get(monthKey(year, m)) ?? 0;
            const current = year === start.getFullYear() && m === start.getMonth();
            const cls = ['cal-month', current && 'is-selected', future && 'is-future'].filter(Boolean).join(' ');
            return (
              <button
                key={label}
                type="button"
                className={cls}
                disabled={future}
                aria-label={`${formatMonthYear(year, m)}, ${count} hari latihan`}
                onClick={() => {
                  setMonth(m);
                  setPicking(false);
                }}
              >
                <span className="cal-month__name">{label}</span>
                <span className="cal-month__count num">{count > 0 ? `${count} hari` : '–'}</span>
              </button>
            );
          })}
        </div>
      </Sheet>
    );
  }

  // Grid mulai Senin; kotak kosong sebelum tanggal 1
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${monthKey(year, month)}-${pad(i + 1)}`),
  ];
  const count = perMonth.get(monthKey(year, month)) ?? 0;

  return (
    <Sheet title="Pilih tanggal" onClose={onClose}>
      {nav}
      <div className="cal-grid" role="group" aria-label={formatMonthYear(year, month)}>
        {WEEK_LABELS.map((d) => (
          <span key={d} className="cal-grid__label">
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const future = date > today;
          const cls = [
            'cal-day',
            date === selected && 'is-selected',
            date === today && 'is-today',
            future && 'is-future',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={date}
              type="button"
              className={cls}
              disabled={future}
              aria-pressed={date === selected}
              aria-label={parseLocalDate(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              onClick={() => onSelect(date)}
            >
              <span className="num">{Number(date.slice(8))}</span>
              <span className={activeDates.has(date) ? 'date-box__dot has-data' : 'date-box__dot'} />
            </button>
          );
        })}
      </div>
      <p className="cal-count">{count > 0 ? `${count} hari latihan di bulan ini` : 'Belum ada latihan di bulan ini.'}</p>
      <button type="button" className="btn btn--secondary" disabled={selected === today} onClick={() => onSelect(today)}>
        Hari ini
      </button>
    </Sheet>
  );
}
