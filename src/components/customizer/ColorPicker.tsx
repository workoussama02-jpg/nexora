// Color picker — swatch + hex text input synced bidirectionally
'use client';

import { useState, useEffect, useId } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId();
  const [textValue, setTextValue] = useState(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  function handleTextChange(newVal: string) {
    setTextValue(newVal);
    if (HEX_REGEX.test(newVal)) {
      onChange(newVal);
    }
  }

  function handleBlur() {
    if (!HEX_REGEX.test(textValue)) {
      setTextValue(value);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-200">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
          aria-label={`${label} color swatch`}
        />
        <input
          id={id}
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={handleBlur}
          maxLength={7}
          className="w-28 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-brand-primary"
          placeholder="#854fff"
        />
      </div>
    </div>
  );
}
