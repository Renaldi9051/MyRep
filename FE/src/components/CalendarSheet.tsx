import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { formatMonthYear } from '../lib/format';
import { localDate, parseLocalDate } from '../lib/time';
import { Sheet } from './Sheet';
import { useSwipePager } from './useSwipe';

const WEEK_LABELS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const PAGES = [-1, 0, 1] as const; // halaman sebelumnya, sekarang, berikutnya di track geser
const CELLS = 42; // selalu 6 baris supaya tinggi kalender tidak melonjak antar bulan

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (year: number, month: number) => `${year}-${pad(month + 1)}`;

type Props = {
  selected: string;
  activeDates: Set<string>;
  onSelect: (date: string) => void;
  onClose: () => void;
};

// Kalender bulanan untuk lompat ke tanggal lama di Riwayat. Tap judul untuk pilih bulan dan tahun.
// Geser kiri/kanan untuk pindah bulan (atau tahun saat memilih bulan).
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
  const canPrev = picking ? year > minYear : !(year <= minYear && month === 0);
  const canNext = picking ? year < now.getFullYear() : !isCurrentMonth;

  const shift = (delta: 1 | -1) => {
    if (picking) {
      setYear(year + delta);
      return;
    }
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const swipe = useSwipePager({
    pageKey: picking ? `y${year}` : monthKey(year, month),
    canPrev,
    canNext,
    onChange: shift,
  });

  // Track berisi tiga halaman; hanya halaman tengah yang bisa difokus dan dibaca pembaca layar
  const pager = (render: (offset: -1 | 0 | 1) => ReactNode) => (
    <div className="cal-swipe" {...swipe.handlers}>
      <div ref={swipe.trackRef} className="cal-swipe__track">
        {PAGES.map((offset) => (
          <div key={offset} className="cal-swipe__page" aria-hidden={offset !== 0} inert={offset !== 0}>
            {(offset === 0 || (offset === -1 ? canPrev : canNext)) && render(offset)}
          </div>
        ))}
      </div>
    </div>
  );

  const nav = picking ? (
    <div className="cal-nav">
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Tahun sebelumnya"
        disabled={!canPrev}
        onClick={() => swipe.go(-1)}
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <span className="cal-nav__title num">{year}</span>
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Tahun berikutnya"
        disabled={!canNext}
        onClick={() => swipe.go(1)}
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
        disabled={!canPrev}
        onClick={() => swipe.go(-1)}
      >
        <ChevronLeft size={20} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className="cal-nav__title cal-nav__title--btn"
        onClick={() => setPicking(true)}
      >
        {formatMonthYear(year, month)}
        <ChevronDown size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className="cal-nav__arrow"
        aria-label="Bulan berikutnya"
        disabled={!canNext}
        onClick={() => swipe.go(1)}
      >
        <ChevronRight size={20} strokeWidth={1.75} />
      </button>
    </div>
  );

  if (picking) {
    return (
      <Sheet title="Pilih bulan" onClose={onClose}>
        {nav}
        {pager((offset) => {
          const y = year + offset;
          return (
            <div className="cal-months">
              {MONTH_SHORT.map((label, m) => {
                const future = y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
                const count = perMonth.get(monthKey(y, m)) ?? 0;
                const current = y === start.getFullYear() && m === start.getMonth();
                const cls = ['cal-month', current && 'is-selected', future && 'is-future'].filter(Boolean).join(' ');
                return (
                  <button
                    key={label}
                    type="button"
                    className={cls}
                    disabled={future}
                    aria-label={`${formatMonthYear(y, m)}, ${count} hari latihan`}
                    onClick={() => {
                      setYear(y);
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
          );
        })}
      </Sheet>
    );
  }

  // Grid mulai Senin; kotak kosong sebelum tanggal 1 dan sesudah tanggal terakhir
  const monthGrid = (offset: -1 | 0 | 1) => {
    const first = new Date(year, month + offset, 1);
    const y = first.getFullYear();
    const m = first.getMonth();
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = Array.from({ length: CELLS }, (_, i) => {
      const day = i - lead + 1;
      return day >= 1 && day <= daysInMonth ? `${monthKey(y, m)}-${pad(day)}` : null;
    });
    return (
      <div className="cal-grid" role="group" aria-label={formatMonthYear(y, m)}>
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} className="cal-blank" />;
          const future = date > today;
          const cls = ['cal-day', date === selected && 'is-selected', date === today && 'is-today', future && 'is-future']
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
    );
  };
  const count = perMonth.get(monthKey(year, month)) ?? 0;

  return (
    <Sheet title="Pilih tanggal" onClose={onClose}>
      {nav}
      <div className="cal-grid cal-grid--labels" aria-hidden>
        {WEEK_LABELS.map((d) => (
          <span key={d} className="cal-grid__label">
            {d}
          </span>
        ))}
      </div>
      {pager(monthGrid)}
      <p className="cal-count">{count > 0 ? `${count} hari latihan di bulan ini` : 'Belum ada latihan di bulan ini.'}</p>
      <button type="button" className="btn btn--secondary" disabled={selected === today} onClick={() => onSelect(today)}>
        Hari ini
      </button>
    </Sheet>
  );
}
