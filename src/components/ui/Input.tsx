// ─── Input Component ──────────────────────────────────────────────────────────
// UI-GUIDELINE §4.6 — text, select, error state

import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

// ── Base input styles ─────────────────────────────────────────────────────────
const BASE =
  'w-full px-3.5 py-2.5 rounded-lg text-sm border transition-all duration-150 ' +
  'text-[#263238] placeholder-[#90A4AE] bg-white ' +
  'focus:outline-none focus:border-[#287C76] focus:ring-2 focus:ring-[#287C76]/10 ' +
  'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400';

const BORDER_NORMAL = 'border-[#E0E7E6]';
const BORDER_ERROR  = 'border-red-400 focus:border-red-400 focus:ring-red-100';

// ── Label + wrapper helper ────────────────────────────────────────────────────
interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-[#263238]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
      {!error && hint && <p className="text-xs text-[#90A4AE]">{hint}</p>}
    </div>
  );
}

// ── Text Input ────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <FieldWrapper label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={[BASE, error ? BORDER_ERROR : BORDER_NORMAL, className].join(' ')}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = 'Input';

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <FieldWrapper label={label} htmlFor={selectId} error={error} hint={hint} required={required}>
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={[BASE, error ? BORDER_ERROR : BORDER_NORMAL, 'cursor-pointer', className].join(' ')}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = 'Select';

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const taId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <FieldWrapper label={label} htmlFor={taId} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          id={taId}
          required={required}
          rows={3}
          className={[BASE, error ? BORDER_ERROR : BORDER_NORMAL, 'resize-none', className].join(' ')}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;
