// ─── Types & Interfaces — SPK SAW Media Sosial ───────────────────────────────

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
export type KriteriaJenis = 'benefit' | 'cost';
export type RekomendasiLevel = 'sangat' | 'direkomendasikan' | 'cukup';

// ── Konten ───────────────────────────────────────────────────────────────────
export interface Konten {
  id: string;
  nama: string;
  platform: Platform;
  url: string;
  tanggalPublikasi: string; // ISO date string
  createdAt: string;
}

// ── Kriteria ─────────────────────────────────────────────────────────────────
export interface Kriteria {
  id: string;
  kode: string;       // C1, C2, C3, ...
  nama: string;
  jenis: KriteriaJenis;
  keterangan: string;
}

// ── Bobot ────────────────────────────────────────────────────────────────────
export interface Bobot {
  kriteriaId: string;
  nilai: number;      // 0.00 – 1.00
}

// ── Penilaian ────────────────────────────────────────────────────────────────
export interface Penilaian {
  kontenId: string;
  kriteriaId: string;
  nilai: number;
}

// ── Hasil SAW ────────────────────────────────────────────────────────────────
export interface HasilSAW {
  kontenId: string;
  nilaiAkhir: number;
  peringkat: number;
  matriksNormalisasi: Record<string, number>; // kriteriaId → R[i][j]
  nilaiTerbobot: Record<string, number>;      // kriteriaId → W[j]*R[i][j]
}

// ── Matriks Keputusan (intermediate) ─────────────────────────────────────────
export interface MatriksRow {
  kontenId: string;
  nilai: Record<string, number>; // kriteriaId → nilai mentah
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  username: string;
  displayName: string;
  role: 'admin';
}

// ── App State ────────────────────────────────────────────────────────────────
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  konten: Konten[];
  kriteria: Kriteria[];
  bobot: Bobot[];
  penilaian: Penilaian[];
  hasilSAW: HasilSAW[];
  lastCalculated: string | null; // ISO date
}

// ── App Actions ───────────────────────────────────────────────────────────────
export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  // Konten
  | { type: 'ADD_KONTEN'; payload: Konten }
  | { type: 'UPDATE_KONTEN'; payload: Konten }
  | { type: 'DELETE_KONTEN'; payload: string }
  // Kriteria
  | { type: 'ADD_KRITERIA'; payload: Kriteria }
  | { type: 'UPDATE_KRITERIA'; payload: Kriteria }
  | { type: 'DELETE_KRITERIA'; payload: string }
  // Bobot
  | { type: 'UPDATE_BOBOT'; payload: Bobot[] }
  // Penilaian
  | { type: 'UPDATE_PENILAIAN'; payload: Penilaian }
  | { type: 'BATCH_PENILAIAN'; payload: Penilaian[] }
  // SAW
  | { type: 'SET_HASIL_SAW'; payload: HasilSAW[] }
  | { type: 'CLEAR_HASIL_SAW' };

// ── Platform Config ───────────────────────────────────────────────────────────
export interface PlatformConfig {
  label: string;
  color: string;
  textColor: string;
  emoji: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  instagram: { label: 'Instagram', color: '#F3E8FF', textColor: '#7C3AED', emoji: '📷' },
  tiktok:    { label: 'TikTok',    color: '#E8E8E8', textColor: '#1a1a1a', emoji: '🎵' },
  youtube:   { label: 'YouTube',   color: '#FEE2E2', textColor: '#DC2626', emoji: '▶️' },
  twitter:   { label: 'Twitter/X', color: '#E0F2FE', textColor: '#0284C7', emoji: '🐦' },
  facebook:  { label: 'Facebook',  color: '#EFF6FF', textColor: '#2563EB', emoji: '👥' },
};

// ── Rekomendasi Config ────────────────────────────────────────────────────────
export function getRekomendasiConfig(nilai: number): { label: string; color: string; textColor: string } {
  if (nilai >= 0.8) return { label: 'Sangat Direkomendasikan', color: '#DCFCE7', textColor: '#16A34A' };
  if (nilai >= 0.6) return { label: 'Direkomendasikan',        color: '#FEF3C7', textColor: '#D97706' };
  return                    { label: 'Cukup',                   color: '#F3F4F6', textColor: '#6B7280' };
}
