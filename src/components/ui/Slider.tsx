'use client';

import { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export default function Slider({ label, value, onChange, min, max, step = 1, unit = '' }: SliderProps) {
  const id = useId();
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
        <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{value}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-white/10 accent-brand-primary cursor-pointer"
      />
    </div>
  );
}
