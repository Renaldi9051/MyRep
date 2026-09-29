import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { useAuth } from './features/auth/useAuth';
import { useSyncTriggers } from './features/sync/hooks';
import { AkunPage } from './pages/AkunPage';
import { CatatPage } from './pages/CatatPage';
import { LatihanPage } from './pages/LatihanPage';
import { LatihanRiwayatPage } from './pages/LatihanRiwayatPage';
import { LoginPage } from './pages/LoginPage';
import { ProgresPage } from './pages/ProgresPage';
import { RiwayatPage } from './pages/RiwayatPage';
import { TambahLatihanPage } from './pages/TambahLatihanPage';

function Splash() {
  return (
    <div className="splash" aria-label="Memuat">
      <span className="pill-label">MyRep</span>
    </div>
  );
}

// Halaman di balik login. Sinkron hanya berjalan selama user login.
function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <Splash />;
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <AppLayout />;
}

// DESIGN §5.2: nav bawah tampil di semua layar kecuali Masuk
function AppLayout() {
  useSyncTriggers();
  return (
    <div className="screen">
      <Outlet />
      <BottomNav />
    </div>
  );
}

function GuestOnly() {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;
  if (status === 'authed') return <Navigate to="/latihan" replace />;
  return <Outlet />;
}

// DESIGN §7
export function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/latihan" element={<LatihanPage />} />
        <Route path="/latihan/tambah" element={<TambahLatihanPage />} />
        <Route path="/latihan/:exerciseId" element={<CatatPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/progres" element={<ProgresPage />} />
        <Route path="/progres/latihan/:exerciseId" element={<LatihanRiwayatPage />} />
        <Route path="/akun" element={<AkunPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/latihan" replace />} />
    </Routes>
  );
}
