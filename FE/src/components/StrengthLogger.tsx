import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { LocalExercise, LocalSet } from '../db/types';
import { addSet, changeExerciseInSession } from '../features/workout/actions';
import { useExerciseSetCount, useLastSet, useTodaySets } from '../features/workout/queries';
import { haptic, useWakeLock } from '../lib/device';
import { formatNumber, formatSet } from '../lib/format';
import { canInc, stepWeight } from '../lib/steps';
import { AppHeader } from './AppHeader';
import { ExerciseEditSheet } from './ExerciseEditSheet';
import { ExercisePickerSheet } from './ExercisePickerSheet';
import { SetEditSheet } from './SetEditSheet';
import { SetRows } from './SetRows';
import { Stepper } from './Stepper';
import { useEndSession } from './useEndSession';

// Penghitung rep (DESIGN §6.3, PRD F2 & F3.1). Set berikutnya cukup: +1 beberapa kali, lalu Simpan set.
export function StrengthLogger({ exercise }: { exercise: LocalExercise }) {
  const navigate = useNavigate();
  const lastSet = useLastSet(exercise.id);
  const todaySets = useTodaySets(exercise.id) ?? [];
  const endSession = useEndSession();

  const [reps, setReps] = useState(0);
  // F2.4: beban awal = beban set sebelumnya di latihan ini, 0 kalau belum ada
  const [weightOverride, setWeightOverride] = useState<number | null>(null);
  const weight = weightOverride ?? lastSet?.weight_kg ?? 0;

  const [editing, setEditing] = useState<{ set: LocalSet; position: number } | null>(null);
  const [picking, setPicking] = useState(false);
  const [editingExercise, setEditingExercise] = useState(false);
  const setCount = useExerciseSetCount(exercise.id) ?? 0;

  useWakeLock(true);

  const setNumber = todaySets.length + 1;

  const save = async () => {
    if (reps === 0) return;
    await addSet(exercise.id, { reps, weight_kg: weight, duration_sec: null, incline_pct: null, speed_kmh: null });
    haptic(20);
    setReps(0);
    setWeightOverride(weight);
  };

  const goTo = (target: LocalExercise) => navigate(`/latihan/${target.id}`, { replace: true });

  // F5.2 langsung dari layar ini: salah pilih latihan, pindahkan set hari ini
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
          // Latihan buatan sendiri bisa langsung dibetulkan (mis. salah ketik nama)
          ...(exercise.is_custom ? [{ label: 'Edit latihan ini', onSelect: () => setEditingExercise(true) }] : []),
          ...(endSession.item ? [endSession.item] : []),
        ]}
      />

      <main className="screen__body counter">
        <p className="counter__info num">
          Set {setNumber} · {lastSet ? `set lalu ${formatSet(lastSet)}` : 'set pertama'}
        </p>

        <div className="counter__ring-area">
          <div className="ring" aria-live="polite" aria-label={`${reps} rep`}>
            <span className="ring__value">{reps}</span>
            <span className="ring__label">rep</span>
          </div>
        </div>

        <div className="counter__controls">
          <div className="rep-row">
            <button
              type="button"
              className="round round--minus"
              aria-label="Kurangi 1 rep"
              disabled={reps === 0}
              onClick={() => {
                setReps((r) => Math.max(0, r - 1));
                haptic(10);
              }}
            >
              −1
            </button>
            <button
              type="button"
              className="round round--plus"
              aria-label="Tambah 1 rep"
              onClick={() => {
                setReps((r) => r + 1);
                haptic(10);
              }}
            >
              +1
            </button>
            <span className="round-spacer" aria-hidden="true" />
          </div>

          <Stepper
            label="Beban"
            value={`${formatNumber(weight)} kg`}
            onDec={() => setWeightOverride((w) => stepWeight(w ?? weight, -1))}
            onInc={() => setWeightOverride((w) => stepWeight(w ?? weight, 1))}
            canDec={weight > 0}
            canInc={canInc.weight(weight)}
          />

          <SetRows
            sets={todaySets}
            running={`${reps} × ${formatNumber(weight)} kg`}
            onEdit={(set, position) => setEditing({ set, position })}
          />

          <button type="button" className="btn btn--primary" disabled={reps === 0} onClick={() => void save()}>
            Simpan set
          </button>
        </div>
      </main>

      {editing && (
        <SetEditSheet
          set={editing.set}
          position={editing.position}
          exerciseName={exercise.name}
          type="beban"
          onClose={() => setEditing(null)}
          onSwapped={goTo}
        />
      )}
      {picking && (
        <ExercisePickerSheet
          title={todaySets.length > 0 ? `Pindahkan ${todaySets.length} set ke…` : 'Ganti latihan'}
          onlyType="beban"
          excludeId={exercise.id}
          onPick={(e) => void swap(e)}
          onClose={() => setPicking(false)}
        />
      )}
      {editingExercise && (
        <ExerciseEditSheet
          exercise={exercise}
          setCount={setCount}
          onClose={() => setEditingExercise(false)}
          onDeleted={() => navigate('/latihan', { replace: true })}
        />
      )}
      {endSession.sheet}
    </>
  );
}
