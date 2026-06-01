import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-breezy-muted">
          {label}
        </label>
      )}
      <input id={inputId} className={`x-input ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
