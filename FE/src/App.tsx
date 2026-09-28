import { Navigate, Outlet, Route, Routes } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { LatihanPage } from './pages/LatihanPage';
import { LoginPage } from './pages/LoginPage';
import { RiwayatPage } from './pages/RiwayatPage';

function TabLayout() {
  return (
    <>
      <main className="page">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<TabLayout />}>
        <Route path="/latihan" element={<LatihanPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/latihan" replace />} />
    </Routes>
  );
}
