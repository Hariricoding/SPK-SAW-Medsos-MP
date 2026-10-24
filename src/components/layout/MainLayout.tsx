// ─── MainLayout Component ─────────────────────────────────────────────────────
// Wrapper utama: Sidebar + Navbar + Page Content

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  const [collapsed, setCollapsed]     = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAF9' }}>
      {/* ── Sidebar ──────────────────────────────────── */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* ── Main Area ────────────────────────────────── */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: 0,
        }}
      >
        {/* Override margin via inline untuk desktop */}
        <style>{`
          @media (min-width: 1024px) {
            .main-content-area {
              margin-left: ${collapsed ? '72px' : '240px'};
            }
          }
        `}</style>

        <div className="main-content-area flex flex-col min-h-screen transition-all duration-300">
          {/* Navbar */}
          <Navbar
            onToggleMobile={() => setMobileOpen((o) => !o)}
            sidebarCollapsed={collapsed}
          />

          {/* Page Content */}
          <main className="flex-1 mt-16 p-4 lg:p-6 page-enter">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="mt-auto py-3 px-6 text-center text-xs text-brand-muted
            border-t border-brand-border bg-white no-print">
            © 2026 SPK Konten Media Sosial — Metode SAW &nbsp;|&nbsp; v1.0.0
          </footer>
        </div>
      </div>
    </div>
  );
}
