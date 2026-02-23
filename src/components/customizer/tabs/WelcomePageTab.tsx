// Welcome Page tab — configure welcome screen logo, button text, animations
'use client';

import type { WelcomePageConfig, WelcomeLogoPosition, WelcomeAnimation, LanguageButton } from '@/lib/types';
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
  function addLanguageButton() {
    const updated: LanguageButton[] = [...config.languageButtons, { label: 'English', message: 'Language: English' }];
    onChange('languageButtons', updated);
  }

  function removeLanguageButton(index: number) {
    const updated = config.languageButtons.filter((_, i) => i !== index);
    onChange('languageButtons', updated);
  }

  function updateLanguageButton(index: number, field: keyof LanguageButton, value: string) {
    const updated = config.languageButtons.map((btn, i) =>
      i === index ? { ...btn, [field]: value } : btn
    );
    onChange('languageButtons', updated);
  }

  return (
    <div className="space-y-4">
      {/* Welcome Button */}
      <CollapsibleSection title="Welcome Button">
        <Toggle
          label="Show Welcome Button"
          checked={config.showWelcomeButton}
          onChange={(v) => onChange('showWelcomeButton', v)}
          helperText='Toggle the main "Send us a message" button on the welcome screen.'
        />
        {config.showWelcomeButton && (
          <>
            <Input
              label="Button Text"
              placeholder="Send us a message"
              value={config.welcomeButtonText}
              onChange={(e) => onChange('welcomeButtonText', e.target.value)}
              helperText="Text displayed on the welcome screen button."
            />
            <ColorPicker
              label="Button Color"
              value={config.welcomeButtonColor}
              onChange={(v) => onChange('welcomeButtonColor', v)}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">Leave empty to use the theme gradient.</p>
            <RadioGroup
              label="Button Animation"
              value={config.welcomeButtonAnimation}
              onChange={(v) => onChange('welcomeButtonAnimation', v as WelcomeAnimation)}
              options={ANIMATION_OPTIONS}
            />
            {config.welcomeButtonAnimation !== 'none' && (
              <Slider
                label="Animation Speed"
                value={config.welcomeButtonAnimationSpeed}
                onChange={(v) => onChange('welcomeButtonAnimationSpeed', v)}
                min={0}
                max={10}
                step={0.1}
                unit="s"
              />
            )}
          </>
        )}
      </CollapsibleSection>

      {/* Language Buttons */}
      <CollapsibleSection title="Language Buttons">
        <Toggle
          label="Enable Language Buttons"
          checked={config.enableLanguageButtons}
          onChange={(v) => onChange('enableLanguageButtons', v)}
          helperText="Add language buttons below the welcome button. Each button immediately starts the chat with its predefined message."
        />
        {config.enableLanguageButtons && (
          <div className="space-y-3">
            <ColorPicker
              label="Buttons Color"
              value={config.languageButtonColor}
              onChange={(v) => onChange('languageButtonColor', v)}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">Leave empty to use the theme gradient.</p>
            <Slider
              label="Button Font Size"
              value={config.languageButtonSize ?? 13}
              onChange={(v) => onChange('languageButtonSize', v)}
              min={10}
              max={22}
              unit="px"
            />
            {config.languageButtons.map((btn, index) => (
              <div key={index} className="flex gap-2 items-start p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <div className="flex-1 space-y-2">
                  <Input
                    label="Button Label"
                    placeholder="English"
                    value={btn.label}
                    onChange={(e) => updateLanguageButton(index, 'label', e.target.value)}
                  />
                  <Input
                    label="Flag Image URL"
                    placeholder="https://example.com/flag.png"
                    value={btn.flagUrl ?? ''}
                    onChange={(e) => updateLanguageButton(index, 'flagUrl', e.target.value)}
                  />
                  <Input
                    label="Message Sent"
                    placeholder="Language: English"
                    value={btn.message}
                    onChange={(e) => updateLanguageButton(index, 'message', e.target.value)}
                    helperText="Text sent to the bot when this button is clicked."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguageButton(index)}
                  className="mt-6 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  title="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguageButton}
              className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 text-sm text-gray-500 dark:text-gray-400 hover:border-brand-primary hover:text-brand-primary transition"
            >
              + Add Language Button
            </button>
          </div>
        )}
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
