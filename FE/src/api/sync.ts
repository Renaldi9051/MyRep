import type { Exercise, WorkoutSession, WorkoutSet } from '../db/types';
import { apiFetch } from './client';

// Kontrak /api/sync di BE (lihat BE/src/routes/sync.ts)

export type PullResponse = {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
  cursor: number;
  has_more: boolean;
};

export type PushBody = {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];
};

export type PushResult = {
  skipped: string[];
  rejected: { id: string; reason: string }[];
};

export const pullChanges = (since: number) =>
  apiFetch<PullResponse>(`/sync/pull?since=${since}`);

export const pushChanges = (body: PushBody) =>
  apiFetch<PushResult>('/sync/push', { method: 'POST', body });
