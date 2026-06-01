import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  full?: boolean;
}

const variants = {
  primary: 'x-btn-primary',
  outline: 'x-btn-outline',
  ghost: 'rounded-full px-4 py-2 font-bold transition-colors hover:bg-white/[0.05]',
  danger: 'rounded-full bg-red-500/10 px-5 py-2 font-bold text-red-400 hover:bg-red-500/20',
};

export function Button({
  variant = 'primary',
  loading,
  full,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
