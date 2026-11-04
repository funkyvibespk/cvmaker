import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputClassName =
  'w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 aria-[invalid=true]:border-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

interface FieldFrameProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldFrame({ id, label, error, hint, children }: FieldFrameProps) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ id, label, error, hint, className, ...props }: TextFieldProps) {
  return (
    <FieldFrame id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        className={`${inputClassName} ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </FieldFrame>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

export function TextAreaField({ id, label, error, hint, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldFrame id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        className={`${inputClassName} min-h-24 resize-y leading-relaxed ${className ?? ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
    </FieldFrame>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function SelectField({ id, label, error, options, ...props }: SelectFieldProps) {
  return (
    <FieldFrame id={id} label={label} error={error}>
      <select
        id={id}
        className={inputClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </FieldFrame>
  );
}
