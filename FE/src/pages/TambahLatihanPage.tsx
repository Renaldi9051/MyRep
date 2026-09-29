import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { AppHeader } from '../components/AppHeader';
import type { MuscleGroup } from '../db/types';
import { DuplicateExerciseError, addCustomExercise } from '../features/workout/actions';
import { MUSCLE_GROUPS } from '../lib/labels';

// PRD F1.4: nama + kelompok otot, sekali ketik lalu langsung dipakai
export function TambahLatihanPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [group, setGroup] = useState<MuscleGroup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || group === null) return;
    try {
      const exercise = await addCustomExercise(name, group);
      navigate(`/latihan/${exercise.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof DuplicateExerciseError ? err.message : 'Gagal menyimpan latihan');
    }
  };

  return (
    <>
      <AppHeader label="Latihan baru" back={{ to: '/latihan', label: 'Kembali ke daftar latihan' }} />
      <form className="screen__body stack tambah" onSubmit={(e) => void submit(e)}>
        <label className="field">
          <span className="field__label">Nama latihan</span>
          <input
            className="input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="mis. Cable Lateral Raise"
            maxLength={60}
            autoFocus
            autoComplete="off"
            enterKeyHint="done"
          />
        </label>
        <fieldset className="field">
          <legend className="field__label">Kelompok otot</legend>
          <div className="choice-grid">
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={group === g.value ? 'choice is-active' : 'choice'}
                aria-pressed={group === g.value}
                onClick={() => setGroup(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
          {group === 'kardio' && <p className="small">Dicatat dengan stopwatch, incline, dan speed.</p>}
        </fieldset>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--primary tambah__submit" disabled={!name.trim() || group === null}>
          Simpan dan mulai
        </button>
      </form>
    </>
  );
}
