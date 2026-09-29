import { Link, useParams } from 'react-router';
import { AppHeader } from '../components/AppHeader';
import { CardioLogger } from '../components/CardioLogger';
import { StrengthLogger } from '../components/StrengthLogger';
import { useExercise } from '../features/workout/queries';

// PRD F6.1: tipe latihan menentukan layar: penghitung rep atau varian kardio
export function CatatPage() {
  const { exerciseId } = useParams();
  const exercise = useExercise(exerciseId);

  if (exercise === undefined) return null;
  if (exercise === null || exercise.deleted_at !== null) {
    return (
      <>
        <AppHeader label="Latihan" back={{ to: '/latihan', label: 'Kembali ke daftar latihan' }} />
        <main className="screen__body">
          <p className="empty">Latihan tidak ditemukan.</p>
          <Link to="/latihan" className="btn btn--secondary">
            Kembali ke daftar latihan
          </Link>
        </main>
      </>
    );
  }

  // key: pindah latihan = state layar (rep, stopwatch) mulai dari awal
  return exercise.type === 'kardio' ? (
    <CardioLogger key={exercise.id} exercise={exercise} />
  ) : (
    <StrengthLogger key={exercise.id} exercise={exercise} />
  );
}
