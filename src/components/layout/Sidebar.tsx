// ─── Sidebar Component ───────────────────────────────────────────────────────
// UI-GUIDELINE: bg #287C76, teks white, active border-left yellow

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, ListChecks, Scale,
  ClipboardList, Calculator, Trophy, Printer,
  LogOut, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard',          label: 'Dashboard',           icon: <LayoutDashboard size={20} /> },
  { path: '/data-konten',        label: 'Data Konten',         icon: <FileText size={20} /> },
  { path: '/data-kriteria',      label: 'Data Kriteria',       icon: <ListChecks size={20} /> },
  { path: '/data-bobot',         label: 'Data Bobot',          icon: <Scale size={20} /> },
  { path: '/penilaian-konten',   label: 'Penilaian Konten',    icon: <ClipboardList size={20} /> },
  { path: '/perhitungan-saw',    label: 'Perhitungan SAW',     icon: <Calculator size={20} /> },
  { path: '/hasil-perangkingan', label: 'Hasil Perangkingan',  icon: <Trophy size={20} /> },
  { path: '/laporan',            label: 'Laporan',             icon: <Printer size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const { state, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* ── Mobile Overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────── */}
      <aside
        className={[
          'fixed top-0 left-0 h-full z-40 flex flex-col',
          'transition-all duration-300 ease-in-out',
          // Desktop width
          collapsed ? 'w-[72px]' : 'w-[240px]',
          // Mobile: slide in/out
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ backgroundColor: '#287C76' }}
      >
        {/* ── Logo & Brand ──────────────────────────────── */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Logo icon */}
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={16} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-white font-bold text-sm whitespace-nowrap">SPK Konten</p>
                <p className="text-white/60 text-[10px] whitespace-nowrap">Media Sosial SAW</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mx-auto">
              <Trophy size={16} className="text-white" />
            </div>
          )}

          {/* Mobile close btn */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'transition-all duration-150 group relative',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-white/15 text-white border-l-[3px] border-[#FFF5AE]'
                    : 'text-white/70 hover:bg-white/8 hover:text-white border-l-[3px] border-transparent',
                ].join(' ')
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
              {/* Tooltip saat collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded
                  whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50
                  transition-opacity duration-150">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User Info & Logout ────────────────────────── */}
        <div className="border-t border-white/10 px-2 py-3 flex-shrink-0 space-y-1">
          {/* User info */}
          {!collapsed && state.user && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">
                  {state.user.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">{state.user.displayName}</p>
                <p className="text-white/50 text-[10px]">Administrator</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-white/70 hover:bg-white/8 hover:text-white
              transition-all duration-150 text-sm font-medium"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="w-full hidden lg:flex items-center gap-3 px-3 py-2
              rounded-lg text-white/50 hover:text-white/80
              transition-all duration-150 text-xs"
            title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          >
            {collapsed
              ? <ChevronRight size={16} className="mx-auto" />
              : <><ChevronLeft size={16} /><span>Perkecil</span></>
            }
          </button>
        </div>
      </aside>
    </>
  );
}
