// ─── Laporan ──────────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { FileBarChart, Printer, AlertTriangle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import { getRekomendasiConfig, PLATFORM_CONFIG } from '../types';

function formatTanggal(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatTanggalShort(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Laporan() {
  const { state } = useApp();
  const { konten, kriteria, bobot, hasilSAW, lastCalculated, user } = state;

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  // Filter konten by periode
  const filteredKonten = useMemo(() => {
    if (!filterFrom && !filterTo) return konten;
    return konten.filter((k) => {
      const t = new Date(k.tanggalPublikasi).getTime();
      const from = filterFrom ? new Date(filterFrom).getTime() : -Infinity;
      const to = filterTo ? new Date(filterTo).getTime() : Infinity;
      return t >= from && t <= to;
    });
  }, [konten, filterFrom, filterTo]);

  // Filter hasilSAW to only konten in filteredKonten
  const filteredHasil = useMemo(() => {
    const ids = new Set(filteredKonten.map((k) => k.id));
    return [...hasilSAW]
      .filter((h) => ids.has(h.kontenId))
      .sort((a, b) => a.peringkat - b.peringkat);
  }, [hasilSAW, filteredKonten]);

  const handlePrint = () => window.print();

  const printTime = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalBobot = bobot.reduce((s, b) => s + b.nilai, 0);

  return (
    <div className="page-enter space-y-6">
      {/* Header — no-print */}
      <div className="flex items-start justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
          >
            <FileBarChart size={20} style={{ color: '#287C76' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#263238]">Laporan</h2>
            <p className="text-sm text-[#607D8B]">Cetak hasil analisis SPK SAW</p>
          </div>
        </div>
        <Button
          variant="primary"
          icon={<Printer size={15} />}
          onClick={handlePrint}
          disabled={hasilSAW.length === 0}
        >
          Cetak / Print
        </Button>
      </div>

      {/* Filter periode — no-print */}
      <div className="no-print bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={15} style={{ color: '#287C76' }} />
          <span className="text-sm font-semibold text-[#263238]">Filter Periode</span>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-[#607D8B] mb-1">Dari</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#607D8B] mb-1">Sampai</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="px-3 py-2 text-sm border border-[#E0E7E6] rounded-lg text-[#263238]"
            />
          </div>
          {(filterFrom || filterTo) && (
            <button
              onClick={() => { setFilterFrom(''); setFilterTo(''); }}
              className="text-xs text-[#287C76] hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
        {(filterFrom || filterTo) && (
          <p className="text-xs text-[#607D8B] mt-2">
            Menampilkan {filteredKonten.length} dari {konten.length} konten
          </p>
        )}
      </div>

      {/* Warning jika belum hitung */}
      {hasilSAW.length === 0 && (
        <div
          className="no-print flex items-start gap-3 rounded-xl p-4 border"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}
        >
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-yellow-500" />
          <p className="text-sm text-[#78350F]">
            Belum ada hasil perhitungan SAW. Lakukan perhitungan SAW terlebih dahulu sebelum mencetak laporan.
          </p>
        </div>
      )}

      {/* ── PRINT CONTENT ── */}
      <div className="print-content bg-white rounded-xl border border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)] overflow-hidden">

        {/* Print Header */}
        <div
          className="px-8 py-6 text-center"
          style={{ backgroundColor: '#287C76', color: 'white' }}
        >
          <h1 className="text-xl font-bold mb-1">
            SPK Pemilihan Konten Media Sosial Terbaik
          </h1>
          <p className="text-sm opacity-90">Metode Simple Additive Weighting (SAW)</p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#607D8B]">Tanggal Cetak:</span>{' '}
              <span className="font-medium text-[#263238]">{printTime}</span>
            </div>
            <div>
              <span className="text-[#607D8B]">Dicetak oleh:</span>{' '}
              <span className="font-medium text-[#263238]">{user?.displayName ?? 'Admin'}</span>
            </div>
            {lastCalculated && (
              <div>
                <span className="text-[#607D8B]">Terakhir Dihitung:</span>{' '}
                <span className="font-medium text-[#263238]">{formatTanggal(lastCalculated)}</span>
              </div>
            )}
            {(filterFrom || filterTo) && (
              <div>
                <span className="text-[#607D8B]">Periode:</span>{' '}
                <span className="font-medium text-[#263238]">
                  {filterFrom ? formatTanggalShort(filterFrom) : '—'} s/d{' '}
                  {filterTo ? formatTanggalShort(filterTo) : '—'}
                </span>
              </div>
            )}
          </div>

          {/* Ringkasan */}
          <div>
            <h3
              className="text-sm font-bold mb-3 pb-1 border-b"
              style={{ color: '#287C76', borderColor: '#E0E7E6' }}
            >
              Ringkasan Data
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Konten', value: filteredKonten.length },
                { label: 'Total Kriteria', value: kriteria.length },
                { label: 'Total Bobot', value: totalBobot.toFixed(2) },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-3 text-center border"
                  style={{ borderColor: '#E0E7E6', backgroundColor: '#F8FAF9' }}
                >
                  <div className="text-2xl font-bold" style={{ color: '#287C76' }}>
                    {s.value}
                  </div>
                  <div className="text-xs text-[#607D8B]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabel Bobot */}
          <div>
            <h3
              className="text-sm font-bold mb-3 pb-1 border-b"
              style={{ color: '#287C76', borderColor: '#E0E7E6' }}
            >
              Data Bobot Kriteria
            </h3>
            <table className="w-full text-sm border border-[#E0E7E6] rounded-lg overflow-hidden">
              <thead>
                <tr style={{ backgroundColor: '#F8FAF9' }}>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                    Nama Kriteria
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                    Jenis
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                    Bobot
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                    Persentase
                  </th>
                </tr>
              </thead>
              <tbody>
                {kriteria.map((kr, i) => {
                  const b = bobot.find((b) => b.kriteriaId === kr.id);
                  const nilai = b ? b.nilai : 0;
                  return (
                    <tr
                      key={kr.id}
                      className="border-b border-[#E0E7E6] last:border-b-0"
                      style={i % 2 !== 0 ? { backgroundColor: '#FAFCFB' } : {}}
                    >
                      <td className="px-4 py-2 font-medium text-[#263238]">{kr.nama}</td>
                      <td className="px-4 py-2 text-[#607D8B] capitalize">{kr.jenis}</td>
                      <td className="px-4 py-2 text-center font-mono text-[#263238]">{nilai.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center text-[#263238]">{(nilai * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tabel Hasil */}
          <div>
            <h3
              className="text-sm font-bold mb-3 pb-1 border-b"
              style={{ color: '#287C76', borderColor: '#E0E7E6' }}
            >
              Hasil Perangkingan Konten
            </h3>
            {filteredHasil.length === 0 ? (
              <p className="text-sm text-[#607D8B] text-center py-6">
                {hasilSAW.length === 0
                  ? 'Belum ada hasil perhitungan SAW.'
                  : 'Tidak ada konten pada periode yang dipilih.'}
              </p>
            ) : (
              <table className="w-full text-sm border border-[#E0E7E6] rounded-lg overflow-hidden">
                <thead>
                  <tr style={{ backgroundColor: '#F8FAF9' }}>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      #
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      Nama Konten
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      Platform
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      Tgl Publikasi
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      Nilai SAW
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-[#287C76] border-b border-[#E0E7E6]">
                      Rekomendasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHasil.map((h, i) => {
                    const k = filteredKonten.find((c) => c.id === h.kontenId);
                    if (!k) return null;
                    const rekCfg = getRekomendasiConfig(h.nilaiAkhir);
                    const platCfg = PLATFORM_CONFIG[k.platform];
                    return (
                      <tr
                        key={h.kontenId}
                        className="border-b border-[#E0E7E6] last:border-b-0"
                        style={i % 2 !== 0 ? { backgroundColor: '#FAFCFB' } : {}}
                      >
                        <td className="px-3 py-2 text-center font-bold text-[#287C76]">{h.peringkat}</td>
                        <td className="px-4 py-2 font-medium text-[#263238]">{k.nama}</td>
                        <td className="px-4 py-2">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: platCfg.color, color: platCfg.textColor }}
                          >
                            {platCfg.emoji} {platCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-[#607D8B]">
                          {formatTanggalShort(k.tanggalPublikasi)}
                        </td>
                        <td className="px-4 py-2 text-center font-mono font-bold text-[#287C76]">
                          {h.nilaiAkhir.toFixed(4)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: rekCfg.color, color: rekCfg.textColor }}
                          >
                            {rekCfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div
            className="text-center text-xs pt-4 border-t"
            style={{ color: '#90A4AE', borderColor: '#E0E7E6' }}
          >
            <p>Dokumen ini digenerate secara otomatis oleh Sistem Pendukung Keputusan SAW</p>
            <p>Konten Media Sosial · {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
