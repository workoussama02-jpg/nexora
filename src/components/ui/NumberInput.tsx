'use client';

import { useId } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helperText?: string;
}

export default function NumberInput({ label, value, onChange, min, max, step = 1, unit, helperText }: NumberInputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}{unit ? ` (${unit})` : ''}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-primary"
      />
      {helperText && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helperText}</p>}
    </div>
  );
}
