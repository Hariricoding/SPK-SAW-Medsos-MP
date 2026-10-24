// ─── Kalkulasi SAW (Simple Additive Weighting) ───────────────────────────────
// Sesuai PRD.md §3.7 dan IMPLEMENTATION_PLAN.md §4

import type { Konten, Kriteria, Bobot, Penilaian, HasilSAW, MatriksRow } from '../types';

// ── Step 1: Bangun Matriks Keputusan ─────────────────────────────────────────
export function buildMatriks(
  konten: Konten[],
  kriteria: Kriteria[],
  penilaian: Penilaian[]
): MatriksRow[] {
  return konten.map((k) => {
    const nilai: Record<string, number> = {};
    kriteria.forEach((kr) => {
      const p = penilaian.find((p) => p.kontenId === k.id && p.kriteriaId === kr.id);
      nilai[kr.id] = p ? p.nilai : 0;
    });
    return { kontenId: k.id, nilai };
  });
}

// ── Step 2: Normalisasi Matriks ───────────────────────────────────────────────
// Benefit: R[i][j] = X[i][j] / MAX(X[*][j])
// Cost:    R[i][j] = MIN(X[*][j]) / X[i][j]
export function normalisasiMatriks(
  matriks: MatriksRow[],
  kriteria: Kriteria[]
): MatriksRow[] {
  const normalized: MatriksRow[] = matriks.map((row) => ({
    kontenId: row.kontenId,
    nilai: { ...row.nilai },
  }));

  kriteria.forEach((kr) => {
    const values = matriks.map((row) => row.nilai[kr.id] ?? 0);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values.filter((v) => v > 0)); // hindari div by zero

    normalized.forEach((row) => {
      const x = row.nilai[kr.id] ?? 0;
      if (kr.jenis === 'benefit') {
        row.nilai[kr.id] = maxVal === 0 ? 0 : parseFloat((x / maxVal).toFixed(4));
      } else {
        // cost
        row.nilai[kr.id] = x === 0 ? 0 : parseFloat((minVal / x).toFixed(4));
      }
    });
  });

  return normalized;
}

// ── Step 3: Hitung Nilai Akhir (V) ───────────────────────────────────────────
// V[i] = Σ (W[j] × R[i][j])
export function hitungNilaiAkhir(
  normalized: MatriksRow[],
  kriteria: Kriteria[],
  bobot: Bobot[]
): Array<{ kontenId: string; nilaiTerbobot: Record<string, number>; nilaiAkhir: number }> {
  return normalized.map((row) => {
    const nilaiTerbobot: Record<string, number> = {};
    let nilaiAkhir = 0;

    kriteria.forEach((kr) => {
      const w = bobot.find((b) => b.kriteriaId === kr.id)?.nilai ?? 0;
      const r = row.nilai[kr.id] ?? 0;
      const wb = parseFloat((w * r).toFixed(4));
      nilaiTerbobot[kr.id] = wb;
      nilaiAkhir += wb;
    });

    return {
      kontenId: row.kontenId,
      nilaiTerbobot,
      nilaiAkhir: parseFloat(nilaiAkhir.toFixed(4)),
    };
  });
}

// ── Step 4: Hitung SAW Lengkap (entry point) ─────────────────────────────────
export function hitungSAW(
  konten: Konten[],
  kriteria: Kriteria[],
  bobot: Bobot[],
  penilaian: Penilaian[]
): {
  matriks: MatriksRow[];
  normalized: MatriksRow[];
  hasil: HasilSAW[];
} {
  // Validasi: pastikan ada data
  if (!konten.length || !kriteria.length || !bobot.length || !penilaian.length) {
    return { matriks: [], normalized: [], hasil: [] };
  }

  // Validasi bobot = 1.00
  const totalBobot = bobot.reduce((sum, b) => sum + b.nilai, 0);
  if (Math.abs(totalBobot - 1.0) > 0.001) {
    throw new Error(`Total bobot harus 1.00, saat ini: ${totalBobot.toFixed(2)}`);
  }

  const matriks = buildMatriks(konten, kriteria, penilaian);
  const normalized = normalisasiMatriks(matriks, kriteria);
  const withValues = hitungNilaiAkhir(normalized, kriteria, bobot);

  // Sort descending by nilaiAkhir
  const sorted = [...withValues].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);

  const hasil: HasilSAW[] = sorted.map((item, index) => {
    const normRow = normalized.find((r) => r.kontenId === item.kontenId)!;
    return {
      kontenId: item.kontenId,
      nilaiAkhir: item.nilaiAkhir,
      peringkat: index + 1,
      matriksNormalisasi: normRow.nilai,
      nilaiTerbobot: item.nilaiTerbobot,
    };
  });

  return { matriks, normalized, hasil };
}

// ── Utility: Format angka untuk tampilan ─────────────────────────────────────
export function formatNilai(nilai: number, decimals = 4): string {
  return nilai.toFixed(decimals);
}

export function formatPersen(nilai: number): string {
  return `${(nilai * 100).toFixed(1)}%`;
}

export function formatRibuan(nilai: number): string {
  if (nilai >= 1000000) return `${(nilai / 1000000).toFixed(1)}M`;
  if (nilai >= 1000) return `${(nilai / 1000).toFixed(1)}K`;
  return nilai.toString();
}

// ── Utility: Validasi total bobot ─────────────────────────────────────────────
export function isBobotValid(bobot: Bobot[]): boolean {
  const total = bobot.reduce((sum, b) => sum + b.nilai, 0);
  return Math.abs(total - 1.0) < 0.001;
}

export function getTotalBobot(bobot: Bobot[]): number {
  return parseFloat(bobot.reduce((sum, b) => sum + b.nilai, 0).toFixed(4));
}

// ── Utility: Generate ID unik ─────────────────────────────────────────────────
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}
