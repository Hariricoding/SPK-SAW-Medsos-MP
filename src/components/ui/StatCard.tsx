// ─── StatCard Component ───────────────────────────────────────────────────────
// UI-GUIDELINE §4.3 — icon, nilai besar, label, trend indicator

import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;           // positif = naik, negatif = turun, 0/undefined = netral
  trendLabel?: string;
  accentColor?: string;     // default: #287C76
  highlight?: boolean;      // kuning pastel untuk konten terbaik
  subtitle?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  accentColor = '#287C76',
  highlight = false,
  subtitle,
}: StatCardProps) {
  const hasTrend = trend !== undefined;
  const isUp   = (trend ?? 0) > 0;
  const isDown = (trend ?? 0) < 0;

  return (
    <div
      className={[
        'bg-white rounded-[12px] p-5 border transition-all duration-200',
        'hover:shadow-[0_8px_24px_rgba(40,124,118,0.12)] hover:-translate-y-0.5',
        highlight
          ? 'border-yellow-200 shadow-[0_2px_12px_rgba(255,245,174,0.6)]'
          : 'border-[#E0E7E6] shadow-[0_2px_8px_rgba(40,124,118,0.08)]',
      ].join(' ')}
      style={highlight ? { borderTopColor: '#D4B000', borderTopWidth: 3 } : { borderTopColor: accentColor, borderTopWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: highlight ? 'rgba(255,245,174,0.6)' : `${accentColor}18` }}
        >
          <span style={{ color: highlight ? '#B8860B' : accentColor }}>
            {icon}
          </span>
        </div>

        {/* Trend */}
        {hasTrend && (
          <div className={[
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            isUp   ? 'bg-green-50 text-green-600' :
            isDown ? 'bg-red-50 text-red-500' :
                     'bg-gray-100 text-gray-500',
          ].join(' ')}>
            {isUp   ? <TrendingUp size={12} /> :
             isDown ? <TrendingDown size={12} /> :
                      <Minus size={12} />}
            <span>{Math.abs(trend ?? 0)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-3">
        <p className="text-2xl font-bold text-[#263238] leading-tight truncate">
          {value}
        </p>
        <p className="text-sm text-[#607D8B] mt-0.5 font-medium">{label}</p>
        {subtitle && (
          <p className="text-xs text-[#90A4AE] mt-0.5 truncate">{subtitle}</p>
        )}
        {trendLabel && (
          <p className="text-xs text-[#90A4AE] mt-1">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
