import { useState, type FormEvent } from 'react';
import type { LocalExercise, MuscleGroup } from '../db/types';
import { DuplicateExerciseError, deleteCustomExercise, updateCustomExercise } from '../features/workout/actions';
import { MUSCLE_GROUPS } from '../lib/labels';
import { Sheet } from './Sheet';
import { useToast } from './Toast';

type Props = {
  exercise: LocalExercise;
  // Jumlah set yang memakai latihan ini (untuk konfirmasi hapus)
  setCount: number;
  onClose: () => void;
  onDeleted?: () => void;
};

// Kelola latihan buatan sendiri: ganti nama (mis. salah ketik), ganti kelompok otot, atau hapus
export function ExerciseEditSheet({ exercise, setCount, onClose, onDeleted }: Props) {
  const toast = useToast();
  const [name, setName] = useState(exercise.name);
  const [group, setGroup] = useState<MuscleGroup>(exercise.muscle_group);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardio = exercise.type === 'kardio';
  // Tipe tidak berubah: latihan beban tidak bisa dipindah ke Kardio, dan sebaliknya
  const groups = MUSCLE_GROUPS.filter((g) => (g.value === 'kardio') === cardio);
  const changed = name.trim() !== exercise.name || group !== exercise.muscle_group;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateCustomExercise(exercise.id, name, group);
      onClose();
      toast({ message: 'Latihan diperbarui', durationMs: 1500 });
    } catch (err) {
      setError(err instanceof DuplicateExerciseError || err instanceof Error ? err.message : 'Gagal menyimpan');
    }
  };

  const remove = async () => {
    const undo = await deleteCustomExercise(exercise.id);
    onClose();
    onDeleted?.();
    toast({
      message: `${exercise.name} dihapus`,
      actionLabel: 'Urungkan',
      onAction: () =>
        void undo().catch((err: unknown) =>
          toast({ message: err instanceof Error ? err.message : 'Gagal mengurungkan' }),
        ),
    });
  };

  return (
    <Sheet title="Edit latihan" onClose={onClose}>
      {confirming ? (
        <div className="stack">
          <p>
            Hapus <b>{exercise.name}</b>?
          </p>
          <p className="muted">
            {setCount > 0
              ? `${setCount} set yang sudah tercatat tetap ada di Riwayat. Latihan ini tidak muncul lagi di daftar pilihan.`
              : 'Latihan ini tidak muncul lagi di daftar pilihan.'}
          </p>
          <button type="button" className="btn btn--primary" onClick={() => void remove()}>
            Ya, hapus
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => setConfirming(false)}>
            Batal
          </button>
        </div>
      ) : (
        <form className="stack" onSubmit={(e) => void save(e)}>
          <label className="field">
            <span className="field__label">Nama latihan</span>
            <input
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              maxLength={60}
              autoComplete="off"
              enterKeyHint="done"
            />
          </label>
          <fieldset className="field">
            <legend className="field__label">Kelompok otot</legend>
            <div className="choice-grid">
              {groups.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  className={group === g.value ? 'choice is-active' : 'choice'}
                  aria-pressed={group === g.value}
                  onClick={() => {
                    setGroup(g.value);
                    setError(null);
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn--primary" disabled={!name.trim() || !changed}>
            Simpan
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
            Hapus latihan
          </button>
        </form>
      )}
    </Sheet>
  );
}
