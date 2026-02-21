// Advanced tab — custom CSS injection
'use client';

import type { AdvancedConfig } from '@/lib/types';
import TextareaField from '@/components/ui/TextareaField';

interface AdvancedTabProps {
  config: AdvancedConfig;
  onChange: <K extends keyof AdvancedConfig>(key: K, value: AdvancedConfig[K]) => void;
}

export default function AdvancedTab({ config, onChange }: AdvancedTabProps) {
  return (
    <div className="space-y-5">
      <TextareaField
        label="Custom CSS"
        value={config.customCss}
        onChange={(v) => onChange('customCss', v)}
        placeholder={`.chat-container {\n  /* your custom styles */\n}`}
        rows={10}
        helperText="Inject custom CSS into the widget. Advanced users only — may break layout."
      />
    </div>
  );
}
