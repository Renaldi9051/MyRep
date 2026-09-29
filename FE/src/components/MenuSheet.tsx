import { RefreshCw } from 'lucide-react';
import { syncNow } from '../features/sync/engine';
import { useSyncState } from '../features/sync/hooks';
import { useSyncLabel } from '../features/sync/useSyncLabel';
import { Sheet } from './Sheet';

export type MenuItem = { label: string; onSelect: () => void };

// Isi tombol menu di header (tambahan DESIGN §5.1): aksi sesuai layar + status sinkron
export function MenuSheet({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  const { status } = useSyncState();
  const sync = useSyncLabel();

  return (
    <Sheet title="Menu" onClose={onClose}>
      <ul className="ex-list">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              className="ex-row"
              onClick={() => {
                onClose();
                item.onSelect();
              }}
            >
              <span className="ex-row__name">{item.label}</span>
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="ex-row"
            disabled={status === 'offline' || status === 'syncing'}
            onClick={() => void syncNow()}
          >
            <span className="ex-row__name">Sinkronkan sekarang</span>
            <span className="ex-row__meta">{sync.text}</span>
            <RefreshCw size={18} strokeWidth={1.75} />
          </button>
        </li>
      </ul>
    </Sheet>
  );
}
