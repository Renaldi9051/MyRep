import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { LocalExercise, LocalSet } from '../db/types';
import { addSet, changeExerciseInSession } from '../features/workout/actions';
import { useLastSet, useTodaySets } from '../features/workout/queries';
import { useStopwatch } from '../features/workout/stopwatch';
import { haptic, useWakeLock } from '../lib/device';
import { formatDuration, formatNumber, formatSet, formatSpeed } from '../lib/format';
import { DEFAULT_SPEED, MINUTE, canInc, stepIncline, stepSpeed } from '../lib/steps';
import { AppHeader } from './AppHeader';
import { ExercisePickerSheet } from './ExercisePickerSheet';
import { SetEditSheet } from './SetEditSheet';
import { SetRows } from './SetRows';
import { Stepper } from './Stepper';
import { useEndSession } from './useEndSession';

// Varian kardio penghitung (DESIGN §6.3, PRD F6): stopwatch Mulai/Stop, koreksi ±1 menit,
// incline dan speed lewat stepper.
export function CardioLogger({ exercise }: { exercise: LocalExercise }) {
  const navigate = useNavigate();
  const lastSet = useLastSet(exercise.id);
  const todaySets = useTodaySets(exercise.id) ?? [];
  const stopwatch = useStopwatch(exercise.id);
  const endSession = useEndSession();

  // F6.3/F6.4: nilai awal = sesi kardio sebelumnya. undefined = belum diubah user.
  const [inclineOverride, setInclineOverride] = useState<number | null | undefined>(undefined);
  const [speedOverride, setSpeedOverride] = useState<number | undefined>(undefined);
  const incline = inclineOverride !== undefined ? inclineOverride : (lastSet?.incline_pct ?? null);
  const speed = speedOverride ?? lastSet?.speed_kmh ?? DEFAULT_SPEED;

  const [editing, setEditing] = useState<{ set: LocalSet; position: number } | null>(null);
  const [picking, setPicking] = useState(false);

  useWakeLock(true);

  const elapsedSec = Math.floor(stopwatch.elapsedMs / 1000);
  const current = { reps: null, weight_kg: null, duration_sec: elapsedSec, incline_pct: incline, speed_kmh: speed };

  const save = async () => {
    if (elapsedSec < 1) return;
    await addSet(exercise.id, current);
    haptic(20);
    stopwatch.reset();
    setInclineOverride(incline);
    setSpeedOverride(speed);
  };

  const goTo = (target: LocalExercise) => navigate(`/latihan/${target.id}`, { replace: true });

  const swap = async (target: LocalExercise) => {
    const first = todaySets[0];
    if (first) await changeExerciseInSession(first.session_id, exercise.id, target.id);
    goTo(target);
  };

  return (
    <>
      <AppHeader
        label={exercise.name}
        back={{ to: '/latihan', label: 'Kembali ke daftar latihan' }}
        menu={[
          { label: 'Ganti latihan', onSelect: () => setPicking(true) },
          ...(endSession.item ? [endSession.item] : []),
        ]}
      />

      <main className="screen__body counter">
        <p className="counter__info num">
          Set {todaySets.length + 1} · {lastSet ? `sesi lalu ${formatSet(lastSet)}` : 'sesi pertama'}
        </p>

        <div className="counter__ring-area">
          <div className="ring" role="timer" aria-label={`Waktu ${formatDuration(elapsedSec)}`}>
            <span className="ring__value ring__value--time">{formatDuration(elapsedSec)}</span>
            <span className="ring__label">waktu</span>
          </div>
        </div>

        <div className="counter__controls">
          <div className="rep-row">
            <button
              type="button"
              className="round round--minus round--time"
              aria-label="Kurangi 1 menit"
              disabled={elapsedSec < 1}
              onClick={() => {
                stopwatch.adjust(-MINUTE * 1000);
                haptic(10);
              }}
            >
              −1<small>mnt</small>
            </button>
            <button
              type="button"
              className="round round--plus round--start"
              onClick={() => {
                stopwatch.toggle();
                haptic(10);
              }}
            >
              {stopwatch.running ? 'Stop' : 'Mulai'}
            </button>
            <button
              type="button"
              className="round round--minus round--time"
              aria-label="Tambah 1 menit"
              onClick={() => {
                stopwatch.adjust(MINUTE * 1000);
                haptic(10);
              }}
            >
              +1<small>mnt</small>
            </button>
          </div>
          <Stepper
            label="Incline"
            value={incline === null ? 'tanpa' : `${formatNumber(incline)}%`}
            onDec={() => setInclineOverride((p) => stepIncline(p === undefined ? incline : p, -1))}
            onInc={() => setInclineOverride((p) => stepIncline(p === undefined ? incline : p, 1))}
            canDec={incline !== null}
            canInc={canInc.incline(incline)}
          />
          <Stepper
            label="Speed"
            value={`${formatSpeed(speed)} km/j`}
            onDec={() => setSpeedOverride((s) => stepSpeed(s ?? speed, -1))}
            onInc={() => setSpeedOverride((s) => stepSpeed(s ?? speed, 1))}
            canDec={speed > 0}
            canInc={canInc.speed(speed)}
          />

          <SetRows sets={todaySets} running={formatSet(current)} onEdit={(set, position) => setEditing({ set, position })} />

          <button type="button" className="btn btn--primary" disabled={elapsedSec < 1} onClick={() => void save()}>
            Simpan
          </button>
        </div>
      </main>

      {editing && (
        <SetEditSheet
          set={editing.set}
          position={editing.position}
          exerciseName={exercise.name}
          type="kardio"
          onClose={() => setEditing(null)}
          onSwapped={goTo}
        />
      )}
      {picking && (
        <ExercisePickerSheet
          title={todaySets.length > 0 ? `Pindahkan ${todaySets.length} catatan ke…` : 'Ganti latihan'}
          onlyType="kardio"
          excludeId={exercise.id}
          onPick={(e) => void swap(e)}
          onClose={() => setPicking(false)}
        />
      )}
      {endSession.sheet}
    </>
  );
}
