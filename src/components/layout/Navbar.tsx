// ─── Navbar Component ────────────────────────────────────────────────────────
// UI-GUIDELINE: bg white, shadow, tinggi 64px, judul halaman + user info

import { useLocation } from 'react-router-dom';
import { Menu, Bell, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onToggleMobile: () => void;
  sidebarCollapsed: boolean;
}

// Map path → label halaman
const PAGE_LABELS: Record<string, { title: string; breadcrumb: string[] }> = {
  '/dashboard':          { title: 'Dashboard',           breadcrumb: ['Home', 'Dashboard'] },
  '/data-konten':        { title: 'Data Konten',         breadcrumb: ['Home', 'Data Konten'] },
  '/data-kriteria':      { title: 'Data Kriteria',       breadcrumb: ['Home', 'Data Kriteria'] },
  '/data-bobot':         { title: 'Data Bobot',          breadcrumb: ['Home', 'Data Bobot'] },
  '/penilaian-konten':   { title: 'Penilaian Konten',    breadcrumb: ['Home', 'Penilaian Konten'] },
  '/perhitungan-saw':    { title: 'Perhitungan SAW',     breadcrumb: ['Home', 'Perhitungan SAW'] },
  '/hasil-perangkingan': { title: 'Hasil Perangkingan',  breadcrumb: ['Home', 'Hasil Perangkingan'] },
  '/laporan':            { title: 'Laporan',             breadcrumb: ['Home', 'Laporan'] },
};

export default function Navbar({ onToggleMobile, sidebarCollapsed }: NavbarProps) {
  const { state } = useApp();
  const location = useLocation();

  const pageInfo = PAGE_LABELS[location.pathname] ?? {
    title: 'SPK Konten',
    breadcrumb: ['Home'],
  };

  return (
    <header
      className={[
        'fixed top-0 right-0 z-20 h-16 bg-white',
        'flex items-center justify-between px-4 lg:px-6',
        'transition-all duration-300 ease-in-out no-print',
        // Offset dari sidebar width
        sidebarCollapsed
          ? 'left-0 lg:left-[72px]'
          : 'left-0 lg:left-[240px]',
      ].join(' ')}
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #E0E7E6' }}
    >
      {/* ── Left: Hamburger + Page Title ──────────── */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile) */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-primary-50 text-brand-muted
            transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base font-semibold text-brand-text leading-tight">
            {pageInfo.title}
          </h1>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-brand-muted">
            {pageInfo.breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} />}
                <span className={i === pageInfo.breadcrumb.length - 1
                  ? 'text-primary font-medium' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Right: Notif + User ────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg hover:bg-primary-50 text-brand-muted
            transition-colors"
          aria-label="Notifikasi"
        >
          <Bell size={18} />
          {/* Dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-brand-border mx-1" />

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white
              font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: '#287C76' }}
          >
            {state.user?.displayName?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-brand-text">
              {state.user?.displayName ?? 'Admin'}
            </p>
            <p className="text-xs text-brand-muted">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
