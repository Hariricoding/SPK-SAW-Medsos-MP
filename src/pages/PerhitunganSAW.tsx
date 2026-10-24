// ─── Perhitungan SAW ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Calculator, AlertTriangle, RefreshCw, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import { JenisBadge } from '../components/ui/Badge';
import { hitungSAW, isBobotValid, getTotalBobot } from '../utils/sawCalculation';
import type { MatriksRow } from '../types';

export default function PerhitunganSAW() {
  const { state, dispatch } = useApp();
  const { konten, kriteria, bobot, penilaian, hasilSAW } = state;

  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matriks, setMatriks] = useState<MatriksRow[]>([]);
  const [normalized, setNormalized] = useState<MatriksRow[]>([]);

  const bobotValid = isBobotValid(bobot);
  const totalBobot = getTotalBobot(bobot);

  const handleHitung = () => {
    setError(null);
    setCalculating(true);
    setTimeout(() => {
      try {
        const result = hitungSAW(konten, kriteria, bobot, penilaian);
        setMatriks(result.matriks);
        setNormalized(result.normalized);
        dispatch({ type: 'SET_HASIL_SAW', payload: result.hasil });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghitung');
      }
      setCalculating(false);
    }, 400);
  };

  // Helper: get raw penilaian value
  const getRaw = (kontenId: string, kriteriaId: string): number => {
    const p = penilaian.find((p) => p.kontenId === kontenId && p.kriteriaId === kriteriaId);
    return p ? p.nilai : 0;
  };

  const formatVal = (n: number) => n.toFixed(4);

  const hasData = konten.length > 0 && kriteria.length > 0 && penilaian.length > 0;
  const hasResults = hasilSAW.length > 0;

  // Use matriks from local state if available, else build from penilaian
  const displayMatriks: MatriksRow[] = matriks.length > 0
    ? matriks
    : konten.map((k) => {
        const nilai: Record<string, number> = {};
        kriteria.forEach((kr) => { nilai[kr.id] = getRaw(k.id, kr.id); });
        return { kontenId: k.id, nilai };
      });

  // Use normalized from local state if available
  const displayNormalized: MatriksRow[] = normalized.length > 0 ? normalized : [];

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
          >
            <Calculator size={20} style={{ color: '#287C76' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#263238]">Perhitungan SAW</h2>
            <p className="text-sm text-[#607D8B]">
              Simple Additive Weighting — Normalisasi matriks dan hitung nilai akhir
            </p>
          </div>
        </div>
        {hasResults && (
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
            loading={calculating}
            onClick={handleHitung}
          >
            Hitung Ulang
          </Button>
        )}
      </div>

      {/* Bobot tidak valid warning */}
      {!bobotValid && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 border"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}
        >
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
          <p className="text-sm text-[#78350F]">
            Total bobot saat ini: <strong>{totalBobot.toFixed(4)}</strong>. Total harus 1.00 sebelum dapat
            menghitung SAW. Pergi ke halaman <strong>Data Bobot</strong> untuk memperbaiki.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 border"
          style={{ backgroundColor: '#FFF5F5', borderColor: '#FEB2B2' }}
        >
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Instruksi / Mulai hitung */}
      {!hasResults && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] p-10 text-center shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <div className="text-5xl mb-3">🔢</div>
          <h3 className="text-base font-semibold text-[#263238] mb-1">Klik Hitung SAW untuk Memulai</h3>
          <p className="text-sm text-[#607D8B] mb-6 max-w-sm mx-auto">
            Proses akan menghitung matriks keputusan, normalisasi, dan perangkingan konten.
          </p>
          <Button
            variant="primary"
            icon={<Play size={15} />}
            loading={calculating}
            disabled={!hasData || !bobotValid}
            onClick={handleHitung}
          >
            Hitung SAW
          </Button>
          {!hasData && (
            <p className="text-xs text-[#90A4AE] mt-3">
              Pastikan konten, kriteria, bobot, dan penilaian sudah diisi.
            </p>
          )}
        </div>
      )}

      {/* ── Section 1: Matriks Keputusan ── */}
      {(hasResults || displayMatriks.length > 0) && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <div className="px-5 py-4 border-b border-[#E0E7E6]">
            <h3 className="font-semibold text-[#263238]">1. Matriks Keputusan</h3>
            <p className="text-xs text-[#607D8B] mt-0.5">Nilai mentah X[i][j] dari data penilaian</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#F8FAF9' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#607D8B] border-b border-[#E0E7E6]">
                    Konten
                  </th>
                  {kriteria.map((kr) => (
                    <th
                      key={kr.id}
                      className="px-4 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]"
                    >
                      {kr.kode}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayMatriks.map((row, ri) => {
                  const k = konten.find((c) => c.id === row.kontenId);
                  return (
                    <tr key={row.kontenId} className={`border-b border-[#E0E7E6] last:border-b-0 ${ri % 2 === 0 ? '' : 'bg-[#FAFCFB]'}`}>
                      <td className="px-4 py-2.5 font-medium text-[#263238] text-xs">
                        {k?.nama ?? row.kontenId}
                      </td>
                      {kriteria.map((kr) => (
                        <td key={kr.id} className="px-4 py-2.5 text-center font-mono text-xs text-[#263238]">
                          {(row.nilai[kr.id] ?? 0).toLocaleString('id-ID')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Section 2: Matriks Normalisasi ── */}
      {hasResults && displayNormalized.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <div className="px-5 py-4 border-b border-[#E0E7E6]">
            <h3 className="font-semibold text-[#263238]">2. Matriks Normalisasi</h3>
            <p className="text-xs text-[#607D8B] mt-0.5">
              R[i][j] — Benefit: X[i][j] / MAX(X[*][j]) &nbsp;|&nbsp; Cost: MIN(X[*][j]) / X[i][j]
            </p>
          </div>
          {/* Jenis row */}
          <div className="px-5 py-2 border-b border-[#E0E7E6] flex flex-wrap gap-2">
            {kriteria.map((kr) => (
              <div key={kr.id} className="flex items-center gap-1.5 text-xs text-[#607D8B]">
                <span className="font-mono font-bold text-[#287C76]">{kr.kode}</span>
                <JenisBadge jenis={kr.jenis} />
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#F8FAF9' }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#607D8B] border-b border-[#E0E7E6]">
                    Konten
                  </th>
                  {kriteria.map((kr) => (
                    <th
                      key={kr.id}
                      className="px-4 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]"
                    >
                      {kr.kode}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayNormalized.map((row, ri) => {
                  const k = konten.find((c) => c.id === row.kontenId);
                  return (
                    <tr key={row.kontenId} className={`border-b border-[#E0E7E6] last:border-b-0 ${ri % 2 === 0 ? '' : 'bg-[#FAFCFB]'}`}>
                      <td className="px-4 py-2.5 font-medium text-[#263238] text-xs">
                        {k?.nama ?? row.kontenId}
                      </td>
                      {kriteria.map((kr) => (
                        <td key={kr.id} className="px-4 py-2.5 text-center font-mono text-xs text-[#263238]">
                          {formatVal(row.nilai[kr.id] ?? 0)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Section 3: Nilai Akhir & Peringkat ── */}
      {hasResults && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <div className="px-5 py-4 border-b border-[#E0E7E6]">
            <h3 className="font-semibold text-[#263238]">3. Nilai Akhir & Peringkat</h3>
            <p className="text-xs text-[#607D8B] mt-0.5">
              V[i] = Σ (W[j] × R[i][j]) — semakin besar nilai, semakin baik peringkat
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: '#F8FAF9' }}>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[#607D8B] border-b border-[#E0E7E6] w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#607D8B] border-b border-[#E0E7E6]">
                    Konten
                  </th>
                  {kriteria.map((kr) => (
                    <th
                      key={kr.id}
                      className="px-3 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]"
                      title={`W = ${bobot.find((b) => b.kriteriaId === kr.id)?.nilai ?? 0}`}
                    >
                      W×{kr.kode}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                    Nilai SAW
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...hasilSAW]
                  .sort((a, b) => a.peringkat - b.peringkat)
                  .map((h, ri) => {
                    const k = konten.find((c) => c.id === h.kontenId);
                    const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
                    return (
                      <tr
                        key={h.kontenId}
                        className="border-b border-[#E0E7E6] last:border-b-0"
                        style={h.peringkat === 1 ? { backgroundColor: '#FFF5AE' } : ri % 2 !== 0 ? { backgroundColor: '#FAFCFB' } : {}}
                      >
                        <td className="px-4 py-2.5 text-center text-sm font-bold text-[#287C76]">
                          {medals[h.peringkat] ?? h.peringkat}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-[#263238] text-xs">
                          {k?.nama ?? h.kontenId}
                        </td>
                        {kriteria.map((kr) => (
                          <td key={kr.id} className="px-3 py-2.5 text-center font-mono text-xs text-[#607D8B]">
                            {formatVal(h.nilaiTerbobot[kr.id] ?? 0)}
                          </td>
                        ))}
                        <td className="px-4 py-2.5 text-center">
                          <span className="font-mono font-bold text-[#287C76]">
                            {formatVal(h.nilaiAkhir)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hitung button (bottom) */}
      {!hasResults && hasData && bobotValid && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={<Play size={16} />}
            loading={calculating}
            onClick={handleHitung}
          >
            Hitung SAW
          </Button>
        </div>
      )}
    </div>
  );
}
