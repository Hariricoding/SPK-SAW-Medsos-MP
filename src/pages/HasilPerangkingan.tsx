// ─── Hasil Perangkingan ───────────────────────────────────────────────────────
import { useState } from 'react';
import { Trophy, RefreshCw, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DataTable, { type Column } from '../components/ui/DataTable';
import { PlatformBadge, RekomendosiBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import type { HasilSAW } from '../types';

interface RankRow extends Record<string, unknown> {
  kontenId: string;
  peringkat: number;
  nama: string;
  platform: string;
  nilaiAkhir: number;
}

export default function HasilPerangkingan() {
  const { state, runHitungSAW } = useApp();
  const { konten, hasilSAW, lastCalculated } = state;
  const navigate = useNavigate();
  const [calculating, setCalculating] = useState(false);

  const handleHitungUlang = () => {
    setCalculating(true);
    setTimeout(() => {
      runHitungSAW();
      setCalculating(false);
    }, 400);
  };

  const rows: RankRow[] = [...hasilSAW]
    .sort((a, b) => a.peringkat - b.peringkat)
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

  const terbaik = rows[0];
  const terbaikKonten = terbaik ? konten.find((k) => k.id === terbaik.kontenId) : null;

  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  const columns: Column<RankRow>[] = [
    {
      key: 'peringkat',
      header: 'Peringkat',
      width: '90px',
      align: 'center',
      render: (row) => (
        <span className="font-bold text-lg">
          {medals[row.peringkat as number] ?? (
            <span className="text-[#287C76]">#{row.peringkat}</span>
          )}
        </span>
      ),
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
      render: (row) => (
        <PlatformBadge platform={row.platform as Parameters<typeof PlatformBadge>[0]['platform']} />
      ),
    },
    {
      key: 'nilaiAkhir',
      header: 'Nilai SAW',
      align: 'center',
      render: (row) => (
        <span className="font-mono font-bold text-[#287C76]">
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(40,124,118,0.1)' }}
          >
            <Trophy size={20} style={{ color: '#287C76' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#263238]">Hasil Perangkingan</h2>
            <p className="text-sm text-[#607D8B]">Peringkat konten berdasarkan nilai SAW</p>
          </div>
        </div>
        {hasilSAW.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
            loading={calculating}
            onClick={handleHitungUlang}
          >
            Hitung Ulang
          </Button>
        )}
      </div>

      {/* Belum dihitung */}
      {hasilSAW.length === 0 && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] p-12 text-center shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-base font-semibold text-[#263238] mb-1">Belum Ada Hasil</h3>
          <p className="text-sm text-[#607D8B] mb-6 max-w-sm mx-auto">
            Lakukan perhitungan SAW terlebih dahulu untuk melihat peringkat konten.
          </p>
          <Button
            variant="primary"
            icon={<ArrowRight size={15} />}
            onClick={() => navigate('/perhitungan-saw')}
          >
            Pergi ke Perhitungan SAW
          </Button>
        </div>
      )}

      {/* Summary konten terbaik */}
      {terbaik && terbaikKonten && (
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: '#FFF5AE', borderColor: '#F6D860' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ backgroundColor: 'rgba(255,200,0,0.2)' }}
            >
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                  Konten Terbaik
                </span>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                >
                  <Star size={10} />
                  Sangat Direkomendasikan
                </span>
              </div>
              <p className="font-bold text-[#263238] text-base truncate">{terbaikKonten.nama}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <PlatformBadge platform={terbaikKonten.platform} />
                <span className="text-sm font-mono font-semibold text-[#287C76]">
                  Nilai SAW: {terbaik.nilaiAkhir.toFixed(4)}
                </span>
                {lastCalculated && (
                  <span className="text-xs text-[#607D8B]">
                    Dihitung: {new Date(lastCalculated).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {hasilSAW.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E0E7E6] p-5 shadow-[0_2px_8px_rgba(40,124,118,0.08)]">
          <DataTable<RankRow>
            columns={columns}
            data={rows}
            rowKey={(r) => r.kontenId as string}
            highlightFirst
            emptyMessage="Belum ada data perangkingan"
          />
        </div>
      )}
    </div>
  );
}
