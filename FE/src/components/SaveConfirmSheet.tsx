import { Sheet } from './Sheet';

type Props = {
  title: string;
  detail: string;
  onConfirm: () => void;
  onClose: () => void;
};

// Konfirmasi sebelum set disimpan: setelah tersimpan, set hanya bisa diubah lewat Riwayat
export function SaveConfirmSheet({ title, detail, onConfirm, onClose }: Props) {
  return (
    <Sheet title={title} onClose={onClose}>
      <div className="stack">
        <p className="confirm__value num">{detail}</p>
        <p className="confirm__note">Setelah disimpan, set tidak bisa diubah di sini. Edit lewat menu Riwayat.</p>
        <button type="button" className="btn btn--primary" onClick={onConfirm}>
          Ya, simpan
        </button>
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          Batal
        </button>
      </div>
    </Sheet>
  );
}
