// Tooltip tab — floating label near the chat bubble
'use client';

import type { TooltipConfig } from '@/lib/types';
import ColorPicker from '../ColorPicker';
import Toggle from '@/components/ui/Toggle';
import NumberInput from '@/components/ui/NumberInput';
import Input from '@/components/ui/Input';

interface TooltipTabProps {
  config: TooltipConfig;
  onChange: <K extends keyof TooltipConfig>(key: K, value: TooltipConfig[K]) => void;
}

export default function TooltipTab({ config, onChange }: TooltipTabProps) {
  return (
    <div className="space-y-5">
      <Toggle
        label="Display Tooltip"
        checked={config.display}
        onChange={(v) => onChange('display', v)}
      />

      {config.display && (
        <>
          <Toggle
            label="Hide Tooltip on Mobile Devices"
            checked={config.hideOnMobile}
            onChange={(v) => onChange('hideOnMobile', v)}
            helperText="Hidden on screens smaller than 768px."
          />

          <Input
            label="Message"
            placeholder="Hello 👋 How can I help you?"
            value={config.message}
            onChange={(e) => onChange('message', e.target.value)}
            maxLength={100}
          />

          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Background Color"
              value={config.backgroundColor}
              onChange={(v) => onChange('backgroundColor', v)}
            />
            <ColorPicker
              label="Text Color"
              value={config.textColor}
              onChange={(v) => onChange('textColor', v)}
            />
          </div>

          <NumberInput
            label="Font Size"
            value={config.fontSize}
            onChange={(v) => onChange('fontSize', v)}
            min={10}
            max={24}
            unit="px"
          />
        </>
      )}
    </div>
  );
}
