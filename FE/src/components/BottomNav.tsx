import { NavLink } from 'react-router';

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/latihan">Latihan</NavLink>
      <NavLink to="/riwayat">Riwayat</NavLink>
    </nav>
  );
}
