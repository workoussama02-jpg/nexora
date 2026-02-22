'use client';

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export default function RadioGroup({ label, value, onChange, options }: RadioGroupProps) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
      <div className="inline-flex rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium transition ${
              i === 0 ? 'rounded-l-lg' : ''
            } ${i === options.length - 1 ? 'rounded-r-lg' : ''} ${
              value === opt.value
                ? 'bg-brand-primary text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
