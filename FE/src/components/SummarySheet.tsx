import type { SessionSummary } from '../features/workout/actions';
import { Sheet } from './Sheet';

// F3.3: ringkasan setelah "Selesai latihan"
export function SummarySheet({ summary, onClose }: { summary: SessionSummary; onClose: () => void }) {
  return (
    <Sheet title="Latihan selesai" onClose={onClose}>
      <div className="summary">
        <div className="summary__item">
          <span className="summary__value">{summary.exercises}</span>
          <span className="summary__label">latihan</span>
        </div>
        <div className="summary__item">
          <span className="summary__value">{summary.sets}</span>
          <span className="summary__label">set</span>
        </div>
        <div className="summary__item">
          <span className="summary__value">{summary.reps}</span>
          <span className="summary__label">total rep</span>
        </div>
      </div>
      <button type="button" className="btn btn--primary" onClick={onClose}>
        Tutup
      </button>
    </Sheet>
  );
}
