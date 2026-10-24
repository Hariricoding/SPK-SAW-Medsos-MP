// ─── Badge Component ──────────────────────────────────────────────────────────
// UI-GUIDELINE §4.8 & §4.9 — platform badge, rekomendasi badge

import type { ReactNode } from 'react';
import { type Platform, PLATFORM_CONFIG, getRekomendasiConfig } from '../../types';

// ── Generic Badge ─────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;      // background
  textColor: string;
  icon?: string | ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, textColor, icon, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      ].join(' ')}
      style={{ backgroundColor: color, color: textColor }}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      {label}
    </span>
  );
}

// ── Platform Badge ────────────────────────────────────────────────────────────
interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

export function PlatformBadge({ platform, size = 'sm' }: PlatformBadgeProps) {
  const cfg = PLATFORM_CONFIG[platform];
  return (
    <Badge
      label={cfg.label}
      color={cfg.color}
      textColor={cfg.textColor}
      icon={cfg.emoji}
      size={size}
    />
  );
}

// ── Rekomendasi Badge ─────────────────────────────────────────────────────────
interface RekomendosiBadgeProps {
  nilai: number;
  size?: 'sm' | 'md';
}

export function RekomendosiBadge({ nilai, size = 'sm' }: RekomendosiBadgeProps) {
  const cfg = getRekomendasiConfig(nilai);
  return (
    <Badge
      label={cfg.label}
      color={cfg.color}
      textColor={cfg.textColor}
      size={size}
    />
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

const STATUS_STYLES: Record<StatusVariant, { bg: string; text: string }> = {
  success: { bg: '#DCFCE7', text: '#16A34A' },
  danger:  { bg: '#FEE2E2', text: '#DC2626' },
  warning: { bg: '#FEF3C7', text: '#D97706' },
  info:    { bg: '#E0F2FE', text: '#0284C7' },
  neutral: { bg: '#F3F4F6', text: '#6B7280' },
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
}

export function StatusBadge({ label, variant = 'neutral', size = 'sm' }: StatusBadgeProps) {
  const s = STATUS_STYLES[variant];
  return <Badge label={label} color={s.bg} textColor={s.text} size={size} />;
}

// ── Jenis Kriteria Badge ──────────────────────────────────────────────────────
export function JenisBadge({ jenis }: { jenis: 'benefit' | 'cost' }) {
  return (
    <Badge
      label={jenis === 'benefit' ? 'Benefit ↑' : 'Cost ↓'}
      color={jenis === 'benefit' ? '#DCFCE7' : '#FEE2E2'}
      textColor={jenis === 'benefit' ? '#16A34A' : '#DC2626'}
    />
  );
}

export default Badge;
