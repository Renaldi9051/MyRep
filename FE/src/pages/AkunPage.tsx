import { useState } from 'react';
import { ApiError } from '../api/client';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../features/auth/useAuth';
import { useSyncState } from '../features/sync/hooks';
import { useSyncLabel } from '../features/sync/useSyncLabel';

// Akun (DESIGN §6.6): info akun lalu Keluar (PRD F7.5)
export function AkunPage() {
  const { user, logout } = useAuth();
  const { status, lastSyncedAt } = useSyncState();
  const sync = useSyncLabel();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disconnected = status === 'offline' || status === 'unreachable';

  const doLogout = async () => {
    setBusy(true);
    setError(null);
    try {
      await logout();
    } catch (err) {
      if (err instanceof ApiError && err.isNetwork) {
        setError(
          navigator.onLine
            ? 'Server tidak bisa dihubungi, jadi belum bisa keluar. Coba lagi sebentar lagi.'
            : 'Tidak ada internet. Keluar butuh koneksi supaya sesi di server ikut ditutup.',
        );
      } else {
        setError(err instanceof Error ? err.message : 'Gagal keluar');
      }
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <>
      <AppHeader label="Akun" />
      <main className="screen__body">
        <div className="info-rows">
          <div className="info-row">
            <span className="info-row__label">Nama</span>
            <span className="info-row__value">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Email</span>
            <span className="info-row__value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-row__label">Sinkron</span>
            <span className="info-row__value">
              {sync.text}
              {sync.synced && lastSyncedAt && (
                <span className="muted">
                  {' · '}
                  {new Date(lastSyncedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="stack akun-actions">
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {confirming ? (
            <>
              <p className="muted">
                Data latihan di HP ini akan dihapus. Data di cloud tetap aman dan muncul lagi saat kamu masuk.
              </p>
              <button type="button" className="btn btn--primary" disabled={busy} onClick={() => void doLogout()}>
                {busy ? 'Keluar…' : 'Ya, keluar'}
              </button>
              <button type="button" className="btn btn--secondary" disabled={busy} onClick={() => setConfirming(false)}>
                Batal
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn--secondary" onClick={() => setConfirming(true)}>
                Keluar
              </button>
              {disconnected && <p className="small">Keluar butuh koneksi ke server supaya data tersinkron dulu.</p>}
            </>
          )}
        </div>
      </main>
    </>
  );
}
