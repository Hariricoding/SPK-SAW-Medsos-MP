// ─── Dashboard ────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { LayoutDashboard, FileText, ListChecks, Scale, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import PerformanceChart from '../components/charts/PerformanceChart';
import DataTable, { type Column } from '../components/ui/DataTable';
import { PlatformBadge, RekomendosiBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { HasilSAW } from '../types';

interface HasilRow extends Record<string, unknown> {
  kontenId: string;
  peringkat: number;
  nama: string;
  platform: string;
  nilaiAkhir: number;
}

function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { state, runHitungSAW } = useApp();
  const { konten, kriteria, bobot, hasilSAW, lastCalculated } = state;
  const [calculating, setCalculating] = useState(false);

  const totalBobotAktif = bobot.filter((b) => b.nilai > 0).length;

  const kontenTerbaik =
    hasilSAW.length > 0
      ? konten.find((k) => k.id === hasilSAW.find((h) => h.peringkat === 1)?.kontenId)?.nama ?? 'Belum dihitung'
      : 'Belum dihitung';

  const handleHitung = async () => {
    setCalculating(true);
    setTimeout(() => {
      runHitungSAW();
      setCalculating(false);
    }, 300);
  };

  // Build top-5 rows
  const top5: HasilRow[] = [...hasilSAW]
    .sort((a, b) => a.peringkat - b.peringkat)
    .slice(0, 5)
    .map((h: HasilSAW) => {
      const k = konten.find((c) => c.id === h.kontenId);
      return {
        kontenId: h.kontenId,
        peringkat: h.peringkat,
        nama: k?.nama ?? h.kontenId,
        platform: k?.platform ?? '',
        nilaiAkhir: h.nilaiAkhir,
      };
    });

  const columns: Column<HasilRow>[] = [
    {
      key: 'peringkat',
      header: '#',
      width: '48px',
      align: 'center',
      render: (row) => {
        const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return (
          <span className="font-bold text-[#287C76]">
            {medals[row.peringkat] ?? row.peringkat}
          </span>
        );
      },
    },
    {
      key: 'nama',
      header: 'Nama Konten',
      render: (row) => (
        <span className="font-medium text-[#263238]">{row.nama}</span>
      ),
    },
    {
      key: 'platform',
      header: 'Platform',
      render: (row) => <PlatformBadge platform={row.platform as Parameters<typeof PlatformBadge>[0]['platform']} />,
    },
    {
      key: 'nilaiAkhir',
      header: 'Nilai SAW',
      align: 'center',
      render: (row) => (
        <span className="font-mono font-semibold text-[#287C76]">
          {(row.nilaiAkhir as number).toFixed(4)}
        </span>
      ),
    },
    {
      key: 'rekomendasi',
      header: 'Rekomendasi',
      align: 'center',
      render: (row) => <RekomendosiBadge nilai={row.nilaiAkhir as number} />,
    },
  ];

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
        >
          <LayoutDashboard size={20} style={{ color: '#287C76' }} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#263238]">Dashboard</h2>
          <p className="text-sm text-[#607D8B]">Ringkasan sistem SPK konten media sosial</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Konten"
          value={konten.length}
          icon={<FileText size={20} />}
        />
        <StatCard
          label="Total Kriteria"
          value={kriteria.length}
          icon={<ListChecks size={20} />}
        />
        <StatCard
          label="Kriteria Berbobot"
          value={totalBobotAktif}
          icon={<Scale size={20} />}
        />
        <StatCard
          label="Konten Terbaik"
          value={kontenTerbaik}
          icon={<Trophy size={20} />}
          highlight={hasilSAW.length > 0}
          subtitle={
            hasilSAW.length > 0
              ? `Nilai: ${hasilSAW.find((h) => h.peringkat === 1)?.nilaiAkhir.toFixed(4)}`
              : undefined
          }
        />
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#263238]">Grafik Performa Konten</h3>
          {hasilSAW.length === 0 && (
            <Button
              variant="primary"
              size="sm"
              loading={calculating}
              onClick={handleHitung}
            >
              Hitung SAW Sekarang
            </Button>
          )}
        </div>
        <PerformanceChart hasilSAW={hasilSAW} konten={konten} height={240} />
        {lastCalculated && (
          <p className="text-xs text-[#90A4AE] mt-3 text-right">
            Terakhir dihitung: {formatTanggal(lastCalculated)}
          </p>
        )}
      </div>

      {/* Top 5 Table */}
      <div className="bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
        <h3 className="font-semibold text-[#263238] mb-4">Top 5 Konten Terbaik</h3>
        {hasilSAW.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm text-[#607D8B] mb-4">
              Belum ada hasil perhitungan SAW. Jalankan perhitungan untuk melihat peringkat.
            </p>
            <Button variant="primary" loading={calculating} onClick={handleHitung}>
              Hitung SAW Sekarang
            </Button>
          </div>
        ) : (
          <DataTable<HasilRow>
            columns={columns}
            data={top5}
            rowKey={(r) => r.kontenId as string}
            highlightFirst
            emptyMessage="Belum ada data hasil SAW"
          />
        )}
      </div>
    </div>
  );
}
