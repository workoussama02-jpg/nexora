// Welcome Page tab — configure welcome screen logo, button text, animations
'use client';

import type { WelcomePageConfig, WelcomeLogoPosition, WelcomeAnimation } from '@/lib/types';
import ColorPicker from '../ColorPicker';
import CollapsibleSection from '../CollapsibleSection';
import Toggle from '@/components/ui/Toggle';
import RadioGroup from '@/components/ui/RadioGroup';
import Slider from '@/components/ui/Slider';
import Input from '@/components/ui/Input';

interface WelcomePageTabProps {
  config: WelcomePageConfig;
  onChange: <K extends keyof WelcomePageConfig>(key: K, value: WelcomePageConfig[K]) => void;
}

const LOGO_SOURCE_OPTIONS = [
  { label: 'Brand Logo', value: 'brand' },
  { label: 'Custom URL', value: 'custom' },
];

const LOGO_POSITION_OPTIONS = [
  { label: 'Top Center', value: 'top-center' },
  { label: 'Top Left', value: 'top-left' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Above Text', value: 'above-text' },
  { label: 'Below Text', value: 'below-text' },
];

const ANIMATION_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Float', value: 'float' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Spin', value: 'spin' },
  { label: 'Glow', value: 'glow' },
];

export default function WelcomePageTab({ config, onChange }: WelcomePageTabProps) {
  return (
    <div className="space-y-4">
      {/* Button Text */}
      <CollapsibleSection title="Welcome Button">
        <Input
          label="Button Text"
          placeholder="Send us a message"
          value={config.welcomeButtonText}
          onChange={(e) => onChange('welcomeButtonText', e.target.value)}
          helperText="Text displayed on the welcome screen button."
        />
        <RadioGroup
          label="Button Animation"
          value={config.welcomeButtonAnimation}
          onChange={(v) => onChange('welcomeButtonAnimation', v as WelcomeAnimation)}
          options={ANIMATION_OPTIONS}
        />
      </CollapsibleSection>

      {/* Logo Settings */}
      <CollapsibleSection title="Welcome Logo">
        <Toggle
          label="Show Logo"
          checked={config.showWelcomeLogo}
          onChange={(v) => onChange('showWelcomeLogo', v)}
        />
        {config.showWelcomeLogo && (
          <>
            <RadioGroup
              label="Logo Source"
              value={config.welcomeLogoSource}
              onChange={(v) => onChange('welcomeLogoSource', v as 'brand' | 'custom')}
              options={LOGO_SOURCE_OPTIONS}
            />
            {config.welcomeLogoSource === 'custom' && (
              <Input
                label="Custom Logo URL"
                placeholder="https://example.com/logo.png"
                value={config.welcomeCustomLogoUrl}
                onChange={(e) => onChange('welcomeCustomLogoUrl', e.target.value)}
              />
            )}
            <RadioGroup
              label="Logo Position"
              value={config.welcomeLogoPosition}
              onChange={(v) => onChange('welcomeLogoPosition', v as WelcomeLogoPosition)}
              options={LOGO_POSITION_OPTIONS}
            />
            <Slider
              label="Logo Size"
              value={config.welcomeLogoSize}
              onChange={(v) => onChange('welcomeLogoSize', v)}
              min={20}
              max={120}
              unit="px"
            />
            <RadioGroup
              label="Logo Animation"
              value={config.welcomeLogoAnimation}
              onChange={(v) => onChange('welcomeLogoAnimation', v as WelcomeAnimation)}
              options={ANIMATION_OPTIONS}
            />
          </>
        )}
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Welcome Background">
        <ColorPicker
          label="Background Color"
          value={config.welcomeBackgroundColor}
          onChange={(v) => onChange('welcomeBackgroundColor', v)}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500">Leave empty to use the window background color.</p>
      </CollapsibleSection>
    </div>
  );
}
