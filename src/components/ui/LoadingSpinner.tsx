// ─── LoadingSpinner Component ─────────────────────────────────────────────────

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullPage?: boolean;
}

const SIZE_MAP = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export default function LoadingSpinner({
  size = 'md',
  label = 'Memuat...',
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`animate-spin ${SIZE_MAP[size]}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#287C76" strokeWidth="4" />
        <path
          className="opacity-80"
          fill="#287C76"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {label && <p className="text-sm text-[#607D8B]">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
