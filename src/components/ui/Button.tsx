// ─── Button Component ─────────────────────────────────────────────────────────
// UI-GUIDELINE §4.5 — primary, secondary, danger, icon variants

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   'bg-[#287C76] text-white hover:bg-[#1F5E5A] border border-[#287C76] hover:border-[#1F5E5A]',
  secondary: 'bg-white text-[#287C76] border border-[#287C76] hover:bg-[#F0F7F6]',
  danger:    'bg-[#E53E3E] text-white border border-[#E53E3E] hover:bg-[#C53030] hover:border-[#C53030]',
  ghost:     'bg-transparent text-[#287C76] border border-transparent hover:bg-[#F0F7F6]',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-lg',
        'transition-all duration-200 focus:outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#287C76] focus-visible:ring-offset-2',
        'active:scale-[0.98] select-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
