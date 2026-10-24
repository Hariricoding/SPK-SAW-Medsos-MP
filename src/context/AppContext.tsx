// ─── App Context — Global State Management ───────────────────────────────────

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, AppAction, User } from '../types';
import { dummyKonten, dummyKriteria, dummyBobot, dummyPenilaian } from '../data/dummyData';
import { hitungSAW } from '../utils/sawCalculation';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  konten: dummyKonten,
  kriteria: dummyKriteria,
  bobot: dummyBobot,
  penilaian: dummyPenilaian,
  hasilSAW: [],
  lastCalculated: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    // Auth
    case 'LOGIN':
      localStorage.setItem('spk_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'LOGOUT':
      localStorage.removeItem('spk_user');
      return { ...state, user: null, isAuthenticated: false, hasilSAW: [] };

    // Konten
    case 'ADD_KONTEN':
      return { ...state, konten: [...state.konten, action.payload] };

    case 'UPDATE_KONTEN':
      return {
        ...state,
        konten: state.konten.map((k) =>
          k.id === action.payload.id ? action.payload : k
        ),
      };

    case 'DELETE_KONTEN': {
      const newKonten = state.konten.filter((k) => k.id !== action.payload);
      const newPenilaian = state.penilaian.filter((p) => p.kontenId !== action.payload);
      return { ...state, konten: newKonten, penilaian: newPenilaian, hasilSAW: [] };
    }

    // Kriteria
    case 'ADD_KRITERIA':
      return { ...state, kriteria: [...state.kriteria, action.payload] };

    case 'UPDATE_KRITERIA':
      return {
        ...state,
        kriteria: state.kriteria.map((k) =>
          k.id === action.payload.id ? action.payload : k
        ),
      };

    case 'DELETE_KRITERIA': {
      const newKriteria = state.kriteria.filter((k) => k.id !== action.payload);
      const newBobot = state.bobot.filter((b) => b.kriteriaId !== action.payload);
      const newPenilaian = state.penilaian.filter((p) => p.kriteriaId !== action.payload);
      return {
        ...state,
        kriteria: newKriteria,
        bobot: newBobot,
        penilaian: newPenilaian,
        hasilSAW: [],
      };
    }

    // Bobot
    case 'UPDATE_BOBOT':
      return { ...state, bobot: action.payload, hasilSAW: [] };

    // Penilaian
    case 'UPDATE_PENILAIAN': {
      const exists = state.penilaian.find(
        (p) => p.kontenId === action.payload.kontenId && p.kriteriaId === action.payload.kriteriaId
      );
      const newPenilaian = exists
        ? state.penilaian.map((p) =>
            p.kontenId === action.payload.kontenId && p.kriteriaId === action.payload.kriteriaId
              ? action.payload
              : p
          )
        : [...state.penilaian, action.payload];
      return { ...state, penilaian: newPenilaian, hasilSAW: [] };
    }

    case 'BATCH_PENILAIAN': {
      const updated = [...state.penilaian];
      action.payload.forEach((incoming) => {
        const idx = updated.findIndex(
          (p) => p.kontenId === incoming.kontenId && p.kriteriaId === incoming.kriteriaId
        );
        if (idx >= 0) updated[idx] = incoming;
        else updated.push(incoming);
      });
      return { ...state, penilaian: updated, hasilSAW: [] };
    }

    // SAW
    case 'SET_HASIL_SAW':
      return {
        ...state,
        hasilSAW: action.payload,
        lastCalculated: new Date().toISOString(),
      };

    case 'CLEAR_HASIL_SAW':
      return { ...state, hasilSAW: [], lastCalculated: null };

    default:
      return state;
  }
}

// ── Context Types ─────────────────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper actions
  login: (username: string) => boolean;
  logout: () => void;
  runHitungSAW: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // Rehydrate user from localStorage
  const getInitialState = (): AppState => {
    try {
      const stored = localStorage.getItem('spk_user');
      if (stored) {
        const user: User = JSON.parse(stored);
        return { ...initialState, user, isAuthenticated: true };
      }
    } catch (_) { /* ignore */ }
    return initialState;
  };

  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Helper: login dengan validasi kredensial
  const login = (username: string): boolean => {
    // Kredensial demo: admin / admin123
    const VALID_CREDENTIALS: Record<string, string> = {
      admin: 'admin123',
    };
    if (!VALID_CREDENTIALS[username]) return false;

    const user: User = {
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'admin',
    };
    dispatch({ type: 'LOGIN', payload: user });
    return true;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  // Helper: jalankan perhitungan SAW
  const runHitungSAW = () => {
    try {
      const { hasil } = hitungSAW(
        state.konten,
        state.kriteria,
        state.bobot,
        state.penilaian
      );
      dispatch({ type: 'SET_HASIL_SAW', payload: hasil });
    } catch (err) {
      console.error('SAW Calculation Error:', err);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, runHitungSAW }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
