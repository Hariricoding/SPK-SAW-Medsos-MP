// ─── App.tsx — Router Setup ───────────────────────────────────────────────────
// Sesuai PRD.md §5 Struktur Navigasi

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Auth
import MainLayout       from './components/layout/MainLayout';
import ProtectedRoute   from './components/layout/ProtectedRoute';

// Pages
import Login              from './pages/Login';
import Dashboard          from './pages/Dashboard';
import DataKonten         from './pages/DataKonten';
import DataKriteria       from './pages/DataKriteria';
import DataBobot          from './pages/DataBobot';
import PenilaianKonten    from './pages/PenilaianKonten';
import PerhitunganSAW     from './pages/PerhitunganSAW';
import HasilPerangkingan  from './pages/HasilPerangkingan';
import Laporan            from './pages/Laporan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected — semua halaman dalam MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard"           element={<Dashboard />} />
            <Route path="/data-konten"         element={<DataKonten />} />
            <Route path="/data-kriteria"       element={<DataKriteria />} />
            <Route path="/data-bobot"          element={<DataBobot />} />
            <Route path="/penilaian-konten"    element={<PenilaianKonten />} />
            <Route path="/perhitungan-saw"     element={<PerhitunganSAW />} />
            <Route path="/hasil-perangkingan"  element={<HasilPerangkingan />} />
            <Route path="/laporan"             element={<Laporan />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
