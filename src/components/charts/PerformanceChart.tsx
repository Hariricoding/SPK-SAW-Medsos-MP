// ─── PerformanceChart Component ───────────────────────────────────────────────
// UI-GUIDELINE: grafik teal muda #55AAA1, menggunakan Recharts

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import type { HasilSAW, Konten } from '../../types';

interface ChartData {
  nama: string;
  nilai: number;
  peringkat: number;
  fill: string;
}

interface PerformanceChartProps {
  hasilSAW: HasilSAW[];
  konten: Konten[];
  height?: number;
}

// Warna bar berdasarkan peringkat
function getBarColor(peringkat: number): string {
  if (peringkat === 1) return '#287C76'; // primary gelap
  if (peringkat === 2) return '#3D9E98';
  if (peringkat === 3) return '#55AAA1';
  return '#A8D5D1';                      // abu teal untuk peringkat bawah
}

// Custom Tooltip
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-[#E0E7E6] rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#263238] mb-1">#{d.peringkat} {d.nama}</p>
      <p className="text-[#287C76] font-bold text-base">{d.nilai.toFixed(4)}</p>
      <p className="text-[#607D8B] text-xs">Nilai SAW</p>
    </div>
  );
}

export default function PerformanceChart({
  hasilSAW,
  konten,
  height = 240,
}: PerformanceChartProps) {
  if (!hasilSAW.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center"
        style={{ height }}>
        <span className="text-4xl mb-2">📊</span>
        <p className="text-sm text-[#607D8B]">Jalankan perhitungan SAW untuk melihat grafik.</p>
      </div>
    );
  }

  // Ambil top 5, susun dari tertinggi ke terendah
  const top5 = [...hasilSAW]
    .sort((a, b) => a.peringkat - b.peringkat)
    .slice(0, 5);

  const chartData: ChartData[] = top5.map((h) => {
    const k = konten.find((c) => c.id === h.kontenId);
    // Persingkat nama untuk label sumbu
    const namaRaw = k?.nama ?? h.kontenId;
    const nama = namaRaw.length > 16 ? namaRaw.slice(0, 14) + '…' : namaRaw;
    return {
      nama,
      nilai: h.nilaiAkhir,
      peringkat: h.peringkat,
      fill: getBarColor(h.peringkat),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 16, left: -10, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E7E6" vertical={false} />
        <XAxis
          dataKey="nama"
          tick={{ fontSize: 11, fill: '#607D8B' }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(v) => v.toFixed(1)}
          tick={{ fontSize: 11, fill: '#607D8B' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(40,124,118,0.06)' }} />
        <Bar dataKey="nilai" radius={[6, 6, 0, 0]} maxBarSize={52}>
          {chartData.map((entry) => (
            <Cell key={entry.nama} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="nilai"
            position="top"
            formatter={(v: unknown) => typeof v === 'number' ? v.toFixed(3) : String(v)}
            style={{ fontSize: 10, fill: '#607D8B', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
