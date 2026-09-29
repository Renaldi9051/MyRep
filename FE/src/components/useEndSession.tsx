import { useState, type ReactNode } from 'react';
import { endSession, type SessionSummary } from '../features/workout/actions';
import { useTodaySession } from '../features/workout/queries';
import type { MenuItem } from './MenuSheet';
import { SummarySheet } from './SummarySheet';

// F3.3 "Selesai latihan": item menu (hanya kalau ada sesi hari ini yang masih terbuka)
// dan sheet ringkasan setelahnya
export function useEndSession(): { item: MenuItem | null; sheet: ReactNode } {
  const today = useTodaySession();
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const active = today && today.sets.length > 0 && today.session.ended_at === null;
  const item: MenuItem | null = active
    ? {
        label: 'Selesai latihan',
        onSelect: () => void endSession(today.session.id).then(setSummary),
      }
    : null;

  const sheet = summary ? <SummarySheet summary={summary} onClose={() => setSummary(null)} /> : null;
  return { item, sheet };
}
