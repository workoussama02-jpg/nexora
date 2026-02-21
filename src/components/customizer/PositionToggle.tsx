// Position toggle — Left / Right segmented control
'use client';

interface PositionToggleProps {
  value: 'left' | 'right';
  onChange: (position: 'left' | 'right') => void;
}

export default function PositionToggle({ value, onChange }: PositionToggleProps) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-200">Widget Position</span>
      <div className="inline-flex rounded-lg border border-white/20 bg-white/5">
        <button
          type="button"
          onClick={() => onChange('left')}
          className={`rounded-l-lg px-4 py-2 text-sm font-medium transition ${
            value === 'left'
              ? 'bg-brand-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={value === 'left'}
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => onChange('right')}
          className={`rounded-r-lg px-4 py-2 text-sm font-medium transition ${
            value === 'right'
              ? 'bg-brand-primary text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={value === 'right'}
        >
          Right
        </button>
      </div>
    </div>
  );
}
