import { ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import type { ExerciseType, LocalExercise } from '../db/types';
import { useExerciseUsage, useExercises, type Usage } from '../features/workout/queries';
import { MUSCLE_GROUPS, muscleLabel } from '../lib/labels';
import { SearchField } from './SearchField';
import { Sheet } from './Sheet';

type Props = {
  title: string;
  onPick: (exercise: LocalExercise) => void;
  onClose: () => void;
  // Ganti latihan: hanya tipe yang sama supaya data set tetap cocok
  onlyType?: ExerciseType;
  excludeId?: string;
  // Tampilkan tautan "Buat latihan sendiri" (F1.4)
  allowCreate?: boolean;
};

const RECENT_COUNT = 5;

// Daftar lengkap latihan (F1.1–F1.3): cari, "Terakhir dipakai", lalu per kelompok otot.
// Di tiap kelompok, yang paling sering dipakai di atas.
export function ExercisePickerSheet({ title, onPick, onClose, onlyType, excludeId, allowCreate }: Props) {
  const exercises = useExercises();
  const usage = useExerciseUsage();
  const [query, setQuery] = useState('');

  const pool = (exercises ?? []).filter((e) => (!onlyType || e.type === onlyType) && e.id !== excludeId);
  const q = query.trim().toLocaleLowerCase('id-ID');
  const use = usage ?? new Map<string, Usage>();

  const row = (e: LocalExercise, meta?: string) => (
    <li key={e.id}>
      <button type="button" className="ex-row" onClick={() => onPick(e)}>
        <span className="ex-row__name">{e.name}</span>
        {meta && <span className="ex-row__meta">{meta}</span>}
        <ChevronRight size={18} strokeWidth={1.75} />
      </button>
    </li>
  );

  let content;
  if (q) {
    const results = pool.filter((e) => e.name.toLocaleLowerCase('id-ID').includes(q));
    content =
      results.length === 0 ? (
        <p className="empty">Tidak ada latihan "{query.trim()}".</p>
      ) : (
        <ul className="ex-list picker-results">
          {results.map((e) => row(e, muscleLabel(e.muscle_group)))}
        </ul>
      );
  } else {
    const recent = pool
      .filter((e) => use.has(e.id))
      .sort((a, b) => use.get(b.id)!.lastAt.localeCompare(use.get(a.id)!.lastAt))
      .slice(0, RECENT_COUNT);
    const byFrequency = (a: LocalExercise, b: LocalExercise) =>
      (use.get(b.id)?.count ?? 0) - (use.get(a.id)?.count ?? 0) || a.name.localeCompare(b.name, 'id-ID');
    content = (
      <>
        {recent.length > 0 && (
          <section>
            <h3 className="section-title">Terakhir dipakai</h3>
            <ul className="ex-list">{recent.map((e) => row(e, muscleLabel(e.muscle_group)))}</ul>
          </section>
        )}
        {MUSCLE_GROUPS.map(({ value, label }) => {
          const items = pool.filter((e) => e.muscle_group === value).sort(byFrequency);
          if (items.length === 0) return null;
          return (
            <section key={value}>
              <h3 className="section-title">{label}</h3>
              <ul className="ex-list">{items.map((e) => row(e, e.is_custom ? 'Custom' : undefined))}</ul>
            </section>
          );
        })}
      </>
    );
  }

  return (
    <Sheet title={title} onClose={onClose} tall>
      <SearchField value={query} onChange={setQuery} />
      {content}
      {allowCreate && (
        <Link to="/latihan/tambah" className="ex-row ex-row--add picker-create">
          <Plus size={18} strokeWidth={1.75} />
          <span className="ex-row__name">Buat latihan sendiri</span>
        </Link>
      )}
    </Sheet>
  );
}
