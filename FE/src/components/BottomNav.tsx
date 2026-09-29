import { BarChart3, Calendar, Dumbbell, User, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';

const ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/latihan', label: 'Latihan', icon: Dumbbell },
  { to: '/riwayat', label: 'Riwayat', icon: Calendar },
  { to: '/progres', label: 'Progres', icon: BarChart3 },
  { to: '/akun', label: 'Akun', icon: User },
];

// DESIGN §5.2: 4 tab, tab aktif terisi hitam
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}>
          <Icon size={22} strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
