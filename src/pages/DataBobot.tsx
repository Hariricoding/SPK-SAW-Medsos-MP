// ─── Data Bobot ───────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Scale, RotateCcw, Save, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import { getTotalBobot, isBobotValid } from '../utils/sawCalculation';
import type { Bobot } from '../types';
import { dummyBobot } from '../data/dummyData';

export default function DataBobot() {
  const { state, dispatch } = useApp();
  const { kriteria, bobot } = state;

  // Local editable state
  const [localBobot, setLocalBobot] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  // Initialize from state
  useEffect(() => {
    const map: Record<string, number> = {};
    kriteria.forEach((k) => {
      const b = bobot.find((b) => b.kriteriaId === k.id);
      map[k.id] = b ? b.nilai : 0;
    });
    setLocalBobot(map);
  }, [kriteria, bobot]);

  const total = getTotalBobot(
    kriteria.map((k) => ({ kriteriaId: k.id, nilai: localBobot[k.id] ?? 0 }))
  );
  const valid = Math.abs(total - 1.0) < 0.001;

  const handleChange = (kriteriaId: string, value: string) => {
    const parsed = parseFloat(value);
    const val = isNaN(parsed) ? 0 : Math.max(0, Math.min(1, parsed));
    setLocalBobot((prev) => ({ ...prev, [kriteriaId]: val }));
    setSaved(false);
  };

  const handleSimpan = () => {
    if (!valid) return;
    const payload: Bobot[] = kriteria.map((k) => ({
      kriteriaId: k.id,
      nilai: localBobot[k.id] ?? 0,
    }));
    dispatch({ type: 'UPDATE_BOBOT', payload });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const map: Record<string, number> = {};
    kriteria.forEach((k) => {
      const def = dummyBobot.find((b) => b.kriteriaId === k.id);
      map[k.id] = def ? def.nilai : 0;
    });
    setLocalBobot(map);
    setSaved(false);
  };

  const persen = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
        >
          <Scale size={20} style={{ color: '#287C76' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#263238]">Data Bobot</h2>
          <p className="text-sm text-[#607D8B]">
            Atur bobot setiap kriteria. Total bobot harus sama dengan 1.00
          </p>
        </div>
      </div>

      {/* Status Total */}
      <div
        className="flex items-center gap-3 rounded-xl p-4 border"
        style={{
          backgroundColor: valid ? '#F0FFF4' : '#FFF5F5',
          borderColor: valid ? '#9AE6B4' : '#FEB2B2',
        }}
      >
        {valid ? (
          <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
        ) : (
          <XCircle size={20} className="text-red-500 flex-shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold" style={{ color: valid ? '#276749' : '#C53030' }}>
            Total Bobot: {total.toFixed(4)} / 1.00 {valid ? '✅' : '❌'}
          </p>
          {!valid && (
            <p className="text-xs mt-0.5" style={{ color: '#E53E3E' }}>
              Selisih: {Math.abs(total - 1.0).toFixed(4)} — Sesuaikan bobot agar total tepat 1.00
            </p>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)] overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 w-full" style={{ backgroundColor: '#E0E7E6' }}>
          <div
            className="h-2 transition-all duration-300"
            style={{
              width: `${Math.min(100, total * 100)}%`,
              backgroundColor: valid ? '#287C76' : '#E53E3E',
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAF9' }}>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                  Kode
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                  Nama Kriteria
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6] w-36">
                  Bobot (0–1)
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6] w-32">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {kriteria.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-[#607D8B]">
                    Belum ada kriteria. Tambahkan kriteria terlebih dahulu.
                  </td>
                </tr>
              )}
              {kriteria.map((k, i) => {
                const val = localBobot[k.id] ?? 0;
                return (
                  <tr
                    key={k.id}
                    className={`border-b border-[#E0E7E6] last:border-b-0 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFB]'
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono font-bold text-[#287C76] text-xs bg-[#F0F7F6] px-2 py-0.5 rounded">
                        {k.kode}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#263238]">{k.nama}</td>
                    <td className="px-5 py-3 text-center">
                      <input
                        type="number"
                        value={val}
                        step={0.01}
                        min={0}
                        max={1}
                        onChange={(e) => handleChange(k.id, e.target.value)}
                        className="w-24 px-2 py-1.5 text-sm border border-[#E0E7E6] rounded-lg text-center
                          text-[#263238] font-mono focus:border-[#287C76]"
                      />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className="inline-block font-semibold text-sm px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: val > 0 ? 'rgba(40,124,118,0.1)' : '#F3F4F6',
                          color: val > 0 ? '#287C76' : '#6B7280',
                        }}
                      >
                        {persen(val)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {kriteria.length > 0 && (
              <tfoot>
                <tr style={{ backgroundColor: '#F8FAF9' }}>
                  <td colSpan={2} className="px-5 py-3 font-semibold text-[#263238] border-t border-[#E0E7E6]">
                    Total
                  </td>
                  <td className="px-5 py-3 text-center border-t border-[#E0E7E6]">
                    <span
                      className="font-bold font-mono"
                      style={{ color: valid ? '#287C76' : '#E53E3E' }}
                    >
                      {total.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center border-t border-[#E0E7E6]">
                    <span
                      className="font-bold"
                      style={{ color: valid ? '#287C76' : '#E53E3E' }}
                    >
                      {persen(total)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={handleReset}
        >
          Reset ke Default
        </Button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle size={14} />
              Bobot berhasil disimpan!
            </span>
          )}
          <Button
            variant="primary"
            icon={<Save size={15} />}
            disabled={!valid}
            onClick={handleSimpan}
          >
            Simpan Bobot
          </Button>
        </div>
      </div>
    </div>
  );
}
