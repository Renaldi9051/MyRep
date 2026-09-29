import type { MuscleGroup } from '../db/types';

// Urutan tampil di daftar latihan
export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: 'dada', label: 'Dada' },
  { value: 'punggung', label: 'Punggung' },
  { value: 'kaki', label: 'Kaki' },
  { value: 'bahu', label: 'Bahu' },
  { value: 'lengan', label: 'Lengan' },
  { value: 'perut', label: 'Perut' },
  { value: 'kardio', label: 'Kardio' },
];

export const muscleLabel = (group: MuscleGroup): string =>
  MUSCLE_GROUPS.find((g) => g.value === group)?.label ?? group;
