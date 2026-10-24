// ─── Penilaian Konten ─────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { ClipboardList, Save, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import { PlatformBadge } from '../components/ui/Badge';
import type { Penilaian } from '../types';

type PenilaianMatrix = Record<string, Record<string, number>>; // kontenId → kriteriaId → nilai

export default function PenilaianKonten() {
  const { state, dispatch } = useApp();
  const { konten, kriteria, penilaian } = state;

  const [matrix, setMatrix] = useState<PenilaianMatrix>({});
  const [saved, setSaved] = useState(false);

  // Initialize from state
  useEffect(() => {
    const m: PenilaianMatrix = {};
    konten.forEach((k) => {
      m[k.id] = {};
      kriteria.forEach((kr) => {
        const p = penilaian.find((p) => p.kontenId === k.id && p.kriteriaId === kr.id);
        m[k.id][kr.id] = p ? p.nilai : 0;
      });
    });
    setMatrix(m);
  }, [konten, kriteria, penilaian]);

  const handleChange = (kontenId: string, kriteriaId: string, value: string) => {
    const parsed = parseFloat(value);
    const val = isNaN(parsed) ? 0 : Math.max(0, parsed);
    setMatrix((prev) => ({
      ...prev,
      [kontenId]: {
        ...prev[kontenId],
        [kriteriaId]: val,
      },
    }));
    setSaved(false);
  };

  const handleSimpan = () => {
    const payload: Penilaian[] = [];
    konten.forEach((k) => {
      kriteria.forEach((kr) => {
        payload.push({
          kontenId: k.id,
          kriteriaId: kr.id,
          nilai: matrix[k.id]?.[kr.id] ?? 0,
        });
      });
    });
    dispatch({ type: 'BATCH_PENILAIAN', payload });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalCells = konten.length * kriteria.length;
  const filledCells = konten.reduce((acc, k) => {
    return (
      acc +
      kriteria.filter((kr) => (matrix[k.id]?.[kr.id] ?? 0) > 0).length
    );
  }, 0);

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
        >
          <ClipboardList size={20} style={{ color: '#287C76' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#263238]">Penilaian Konten</h2>
          <p className="text-sm text-[#607D8B]">
            Masukkan nilai performa setiap konten berdasarkan kriteria
          </p>
        </div>
      </div>

      {/* Info */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 border"
        style={{ backgroundColor: '#F0F7F6', borderColor: '#C8D8D6' }}
      >
        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#287C76' }} />
        <p className="text-sm text-[#607D8B]">
          Masukkan nilai performa setiap konten berdasarkan masing-masing kriteria. Cell dengan nilai{' '}
          <span className="font-medium text-red-500">0</span> akan ditandai — pastikan semua terisi.
          Terisi <span className="font-semibold text-[#287C76]">{filledCells}</span> dari{' '}
          <span className="font-semibold">{totalCells}</span> cell.
        </p>
      </div>

      {konten.length === 0 || kriteria.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E0E7E6] p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm text-[#607D8B]">
            {konten.length === 0
              ? 'Belum ada konten. Tambahkan konten terlebih dahulu.'
              : 'Belum ada kriteria. Tambahkan kriteria terlebih dahulu.'}
          </p>
        </div>
      ) : (
        <>
          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse min-w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F8FAF9' }}>
                    {/* Corner */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#607D8B] border-b border-r border-[#E0E7E6] sticky left-0 bg-[#F8FAF9] z-10 min-w-[180px]">
                      Konten \ Kriteria
                    </th>
                    {kriteria.map((kr) => (
                      <th
                        key={kr.id}
                        className="px-3 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6] min-w-[110px]"
                      >
                        <div>{kr.kode}</div>
                        <div className="font-normal text-[#607D8B] text-[10px] mt-0.5">{kr.nama}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {konten.map((k, rowIdx) => (
                    <tr
                      key={k.id}
                      className={`border-b border-[#E0E7E6] last:border-b-0 ${
                        rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFB]'
                      }`}
                    >
                      {/* Row Header */}
                      <td className="px-4 py-3 border-r border-[#E0E7E6] sticky left-0 z-10"
                        style={{ backgroundColor: rowIdx % 2 === 0 ? 'white' : '#FAFCFB' }}>
                        <div className="font-medium text-[#263238] text-xs leading-tight">{k.nama}</div>
                        <div className="mt-1">
                          <PlatformBadge platform={k.platform} size="sm" />
                        </div>
                      </td>
                      {/* Input cells */}
                      {kriteria.map((kr) => {
                        const val = matrix[k.id]?.[kr.id] ?? 0;
                        const isEmpty = val === 0;
                        return (
                          <td key={kr.id} className="px-3 py-2 text-center">
                            <input
                              type="number"
                              value={val}
                              min={0}
                              step={1}
                              onChange={(e) => handleChange(k.id, kr.id, e.target.value)}
                              className="w-24 px-2 py-1.5 text-sm text-center rounded-lg font-mono
                                transition-colors"
                              style={{
                                border: isEmpty
                                  ? '1.5px solid #FCA5A5'
                                  : '1.5px solid #E0E7E6',
                                backgroundColor: isEmpty ? '#FFF5F5' : 'white',
                                color: '#263238',
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle size={14} />
                Penilaian berhasil disimpan!
              </span>
            )}
            <Button variant="primary" icon={<Save size={15} />} onClick={handleSimpan}>
              Simpan Semua Penilaian
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
