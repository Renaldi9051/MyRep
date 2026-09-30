import { EllipsisVertical, Share, SquarePlus } from 'lucide-react';
import { Sheet } from './Sheet';

// Langkah manual membuat ikon di layar utama, untuk browser yang tidak punya dialog pasang (Safari iOS, dll.)
export function InstallSheet({ ios, onClose }: { ios: boolean; onClose: () => void }) {
  return (
    <Sheet title="Buat ikon di layar utama" onClose={onClose}>
      {ios ? (
        <ol className="install-steps">
          <li>
            Buka MyReps di <b>Safari</b>.
          </li>
          <li>
            Tap tombol Bagikan <Share size={18} strokeWidth={1.75} aria-label="Bagikan" /> di bawah layar.
          </li>
          <li>
            Pilih <b>Tambah ke Layar Utama</b> <SquarePlus size={18} strokeWidth={1.75} aria-hidden />, lalu tap{' '}
            <b>Tambah</b>.
          </li>
        </ol>
      ) : (
        <ol className="install-steps">
          <li>
            Tap menu browser <EllipsisVertical size={18} strokeWidth={1.75} aria-label="Menu" /> di pojok kanan atas.
          </li>
          <li>
            Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.
          </li>
          <li>
            Tap <b>Instal</b> atau <b>Tambah</b>.
          </li>
        </ol>
      )}
      <p className="small">Setelah itu buka MyReps dari ikon di layar utama, tampilannya penuh seperti aplikasi.</p>
      <button type="button" className="btn btn--primary install-steps__done" onClick={onClose}>
        Mengerti
      </button>
    </Sheet>
  );
}
