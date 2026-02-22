'use client';

import { useId } from 'react';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  helperText?: string;
}

export default function TextareaField({ label, value, onChange, placeholder, maxLength, rows = 3, helperText }: TextareaFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className="w-full rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-primary resize-none"
      />
      {helperText && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helperText}</p>}
    </div>
  );
}
