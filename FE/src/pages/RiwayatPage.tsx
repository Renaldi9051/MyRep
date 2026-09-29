import { Check, ChevronUp } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AppHeader } from '../components/AppHeader';
import { DateStrip } from '../components/DateStrip';
import { SetEditSheet } from '../components/SetEditSheet';
import type { LocalExercise, LocalSet } from '../db/types';
import { useActiveDates, useDay } from '../features/workout/queries';
import { formatDayMonth, formatGroupSummary, formatSetCompact } from '../lib/format';
import { muscleLabel } from '../lib/labels';
import { localDate } from '../lib/time';

type Editing = { set: LocalSet; position: number; exercise: LocalExercise };

// Riwayat per tanggal (DESIGN §6.4, PRD F4 & F5)
export function RiwayatPage() {
  const [params, setParams] = useSearchParams();
  const today = localDate();
  const selected = params.get('tanggal') ?? today;
  const day = useDay(selected);
  const activeDates = useActiveDates();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);

  const select = (date: string) => {
    setOpenKey(null);
    setParams(date === today ? {} : { tanggal: date }, { replace: true });
  };

  const groups = day?.groups ?? [];
  const muscles = [...new Set(groups.map((g) => g.exercise.muscle_group))].map(muscleLabel);
  const exerciseCount = new Set(groups.map((g) => g.exercise.id)).size;

  return (
    <>
      <AppHeader label="Riwayat" />
      <main className="screen__body">
        <DateStrip selected={selected} onSelect={select} activeDates={activeDates ?? new Set()} />

        <div className="day-head">
          <h2>{muscles.length > 0 ? muscles.join(', ') : formatDayMonth(selected)}</h2>
          {groups.length > 0 && (
            <span className="num">
              {exerciseCount} latihan · {day?.setCount} set
            </span>
          )}
        </div>

        {day && groups.length === 0 && <p className="empty">Belum ada latihan.</p>}

        <ul className="ex-list">
          {groups.map((g) => {
            const key = `${g.sessionId}|${g.exercise.id}`;
            const open = openKey === key;
            return (
              <Fragment key={key}>
                <li>
                  <button
                    type="button"
                    className={open ? 'ex-row is-open' : 'ex-row'}
                    aria-expanded={open}
                    onClick={() => setOpenKey(open ? null : key)}
                  >
                    <span className="ex-row__name">{g.exercise.name}</span>
                    {open ? (
                      <ChevronUp size={18} strokeWidth={1.75} />
                    ) : (
                      <>
                        <span className="ex-row__meta">{formatGroupSummary(g.sets)}</span>
                        <Check size={20} strokeWidth={1.75} />
                      </>
                    )}
                  </button>
                </li>
                {open && (
                  <li className="ex-detail">
                    <div className="ex-detail__chips">
                      {g.sets.map((s, i) => (
                        <button
                          key={s.id}
                          type="button"
                          className="set-chip"
                          aria-label={`Edit set ${i + 1}`}
                          onClick={() => setEditing({ set: s, position: i + 1, exercise: g.exercise })}
                        >
                          {formatSetCompact(s)}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => setEditing({ set: g.sets[0]!, position: 1, exercise: g.exercise })}
                    >
                      Edit
                    </button>
                  </li>
                )}
              </Fragment>
            );
          })}
          {selected === today && (
            <li>
              <Link to="/latihan" className="ex-row ex-row--add">
                + Tambah latihan
              </Link>
            </li>
          )}
        </ul>
      </main>

      {editing && (
        <SetEditSheet
          set={editing.set}
          position={editing.position}
          exerciseName={editing.exercise.name}
          type={editing.exercise.type}
          onClose={() => setEditing(null)}
          onSwapped={() => setOpenKey(null)}
        />
      )}
    </>
  );
}
