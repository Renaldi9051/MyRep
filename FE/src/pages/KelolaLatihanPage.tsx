import { ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AppHeader } from '../components/AppHeader';
import { ExerciseEditSheet } from '../components/ExerciseEditSheet';
import { useCustomExercises } from '../features/workout/queries';
import { muscleLabel } from '../lib/labels';

// Kelola latihan buatan sendiri: tap untuk ganti nama, kelompok otot, atau hapus
export function KelolaLatihanPage() {
  const navigate = useNavigate();
  const items = useCustomExercises();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = items?.find((i) => i.exercise.id === editingId);

  return (
    <>
      <AppHeader
        label="Kelola latihan"
        back={{ to: '/latihan', label: 'Kembali ke daftar latihan' }}
        menu={[{ label: 'Buat latihan sendiri', onSelect: () => navigate('/latihan/tambah') }]}
      />
      <main className="screen__body">
        <p className="subline">Latihan buatanmu. Latihan bawaan tidak bisa diubah.</p>

        {items && items.length === 0 && <p className="empty">Belum ada latihan buatan sendiri.</p>}

        <ul className="ex-list kelola-list">
          {items?.map(({ exercise, setCount }) => (
            <li key={exercise.id}>
              <button type="button" className="ex-row" onClick={() => setEditingId(exercise.id)}>
                <span className="ex-row__name">{exercise.name}</span>
                <span className="ex-row__meta">
                  {muscleLabel(exercise.muscle_group)} · {setCount} set
                </span>
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </li>
          ))}
          <li>
            <Link to="/latihan/tambah" className="ex-row ex-row--add">
              <Plus size={18} strokeWidth={1.75} />
              <span className="ex-row__name">Buat latihan sendiri</span>
            </Link>
          </li>
        </ul>
      </main>

      {editing && (
        <ExerciseEditSheet exercise={editing.exercise} setCount={editing.setCount} onClose={() => setEditingId(null)} />
      )}
    </>
  );
}
