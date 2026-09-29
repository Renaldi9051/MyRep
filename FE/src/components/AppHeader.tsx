import { ChevronLeft, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { MenuSheet, type MenuItem } from './MenuSheet';

type Props = {
  // Isi pil tengah: nama tab atau nama latihan
  label: string;
  // Tanpa `back`, tombol kiri adalah avatar ke halaman Akun
  back?: { to: string; label: string };
  menu?: MenuItem[];
};

// DESIGN §5.1: [avatar/kembali]  [ PIL LABEL ]  [menu]
export function AppHeader({ label, back, menu = [] }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="app-header">
      {back ? (
        <Link to={back.to} className="header-circle" aria-label={back.label}>
          <ChevronLeft size={20} strokeWidth={1.75} />
        </Link>
      ) : (
        <Link to="/akun" className="header-circle" aria-label="Akun">
          <User size={20} strokeWidth={1.75} />
        </Link>
      )}
      <h1 className="pill-label">{label}</h1>
      <button type="button" className="header-menu" aria-label="Buka menu" onClick={() => setOpen(true)}>
        <Menu size={26} strokeWidth={1.75} />
      </button>
      {open && <MenuSheet items={menu} onClose={() => setOpen(false)} />}
    </header>
  );
}
