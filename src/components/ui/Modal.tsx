// ─── Modal Component ──────────────────────────────────────────────────────────
// UI-GUIDELINE §4.7 — overlay, header, body, footer, animation

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={[
          'relative w-full bg-white rounded-2xl z-10 flex flex-col',
          'shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
          'animate-[modalIn_0.2s_ease_forwards]',
          SIZE_MAP[size],
        ].join(' ')}
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E7E6] flex-shrink-0">
          <h2 id="modal-title" className="text-base font-semibold text-[#263238]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#607D8B] hover:bg-[#F0F7F6] hover:text-[#263238]
              transition-colors"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E0E7E6] flex items-center justify-end
            gap-3 flex-shrink-0 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>

      {/* Modal animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  );
}
