// ─── ConfirmDialog Component ──────────────────────────────────────────────────
// UI-GUIDELINE — konfirmasi sebelum hapus data

import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl z-10 p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          animate-[modalIn_0.2s_ease_forwards]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        {/* Icon */}
        <div className={[
          'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
          variant === 'danger' ? 'bg-red-50' : 'bg-yellow-50',
        ].join(' ')}>
          <AlertTriangle
            size={24}
            className={variant === 'danger' ? 'text-red-500' : 'text-yellow-500'}
          />
        </div>

        {/* Text */}
        <h3 id="confirm-title" className="text-base font-semibold text-[#263238] text-center mb-2">
          {title}
        </h3>
        <p id="confirm-message" className="text-sm text-[#607D8B] text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}
