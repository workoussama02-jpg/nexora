'use client';

import { useId } from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
}

export default function Toggle({ label, checked, onChange, helperText }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-gray-200 cursor-pointer">
          {label}
        </label>
        {helperText && <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer ${
          checked ? 'bg-brand-primary' : 'bg-white/20'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
