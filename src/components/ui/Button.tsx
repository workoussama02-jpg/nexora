// Reusable Button component with variants and loading state
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90',
  secondary:
    'bg-white/10 border border-white/20 text-white hover:bg-white/20',
  destructive:
    'bg-red-600 text-white hover:bg-red-700',
  ghost:
    'text-gray-300 hover:bg-white/10',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, disabled, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
