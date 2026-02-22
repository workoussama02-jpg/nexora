// Footer tab — footer customization with content/HTML mode toggle
'use client';

import type { FooterConfig, FooterMode, FooterLogoPosition } from '@/lib/types';
import ColorPicker from '../ColorPicker';
import CollapsibleSection from '../CollapsibleSection';
import RadioGroup from '@/components/ui/RadioGroup';
import Input from '@/components/ui/Input';
import TextareaField from '@/components/ui/TextareaField';
import Toggle from '@/components/ui/Toggle';
import Slider from '@/components/ui/Slider';
import { Lock } from 'lucide-react';

interface FooterTabProps {
  config: FooterConfig;
  onChange: <K extends keyof FooterConfig>(key: K, value: FooterConfig[K]) => void;
}

const MODE_OPTIONS = [
  { label: 'Content', value: 'content' },
  { label: 'Custom HTML', value: 'html' },
];

const LOGO_SOURCE_OPTIONS = [
  { label: 'Brand Logo', value: 'brand' },
  { label: 'Custom URL', value: 'custom' },
];

const LOGO_POSITION_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];

export default function FooterTab({ config, onChange }: FooterTabProps) {
  return (
    <div className="space-y-5">
      <RadioGroup
        label="Footer Mode"
        value={config.mode}
        onChange={(v) => onChange('mode', v as FooterMode)}
        options={MODE_OPTIONS}
      />

      {config.mode === 'content' ? (
        <>
          <div className="relative">
            <div className="pointer-events-none opacity-50">
              <Input
                label="Footer Text"
                value={config.text}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className="absolute right-2 top-0 flex items-center gap-1 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Pro only</span>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none opacity-50">
              <Input
                label="Company Name"
                value={config.companyName}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className="absolute right-2 top-0 flex items-center gap-1 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Pro only</span>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none opacity-50">
              <Input
                label="Company Link"
                value={config.companyLink}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className="absolute right-2 top-0 flex items-center gap-1 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Pro only</span>
            </div>
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="pointer-events-none opacity-50">
            <TextareaField
              label="Custom HTML"
              value={config.customHtml}
              onChange={() => {}}
              placeholder='<a href="https://..." target="_blank">Powered by Us</a>'
              rows={4}
              helperText="Paste custom HTML for the footer area."
            />
          </div>
          <div className="absolute right-2 top-0 flex items-center gap-1 text-xs text-gray-500">
            <Lock className="h-3 w-3" />
            <span>Pro only</span>
          </div>
        </div>
      )}

      <ColorPicker
        label="Text Color"
        value={config.textColor}
        onChange={(v) => onChange('textColor', v)}
      />

      {/* Footer Logo */}
      <CollapsibleSection title="Footer Logo">
        <Toggle
          label="Show Logo in Footer"
          checked={config.showLogo}
          onChange={(v) => onChange('showLogo', v)}
        />
        {config.showLogo && (
          <>
            <RadioGroup
              label="Logo Source"
              value={config.logoSource}
              onChange={(v) => onChange('logoSource', v as 'brand' | 'custom')}
              options={LOGO_SOURCE_OPTIONS}
            />
            {config.logoSource === 'custom' && (
              <Input
                label="Custom Logo URL"
                placeholder="https://example.com/logo.png"
                value={config.customLogoUrl}
                onChange={(e) => onChange('customLogoUrl', e.target.value)}
              />
            )}
            <RadioGroup
              label="Logo Position"
              value={config.logoPosition}
              onChange={(v) => onChange('logoPosition', v as FooterLogoPosition)}
              options={LOGO_POSITION_OPTIONS}
            />
            <Slider
              label="Logo Size"
              value={config.logoSize}
              onChange={(v) => onChange('logoSize', v)}
              min={10}
              max={40}
              unit="px"
            />
          </>
        )}
      </CollapsibleSection>
    </div>
  );
}
