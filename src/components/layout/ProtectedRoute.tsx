// ─── ProtectedRoute — Auth Guard ─────────────────────────────────────────────

import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute() {
  const { state } = useApp();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
