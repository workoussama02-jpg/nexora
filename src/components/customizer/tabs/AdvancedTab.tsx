// Advanced tab — custom CSS, language selector, custom cursor, color transitions, falling effect
'use client';

import type { AdvancedConfig, ColorTransitionConfig, FallingEffectConfig } from '@/lib/types';
import TextareaField from '@/components/ui/TextareaField';
import CollapsibleSection from '../CollapsibleSection';
import Toggle from '@/components/ui/Toggle';
import RadioGroup from '@/components/ui/RadioGroup';
import Input from '@/components/ui/Input';
import Slider from '@/components/ui/Slider';
import NumberInput from '@/components/ui/NumberInput';
import ColorPicker from '../ColorPicker';

interface AdvancedTabProps {
  config: AdvancedConfig;
  onChange: <K extends keyof AdvancedConfig>(key: K, value: AdvancedConfig[K]) => void;
}

const CURSOR_TYPE_OPTIONS = [
  { label: 'Preset', value: 'preset' },
  { label: 'Custom URL', value: 'custom' },
];

const PRESET_CURSOR_OPTIONS = [
  { label: 'Pointer', value: 'pointer' },
  { label: 'Crosshair', value: 'crosshair' },
  { label: 'Grab', value: 'grab' },
  { label: 'Cell', value: 'cell' },
  { label: 'Help', value: 'help' },
];

const FALL_SPEED_OPTIONS = [
  { label: 'Slow', value: 'slow' },
  { label: 'Medium', value: 'medium' },
  { label: 'Fast', value: 'fast' },
];

const EFFECT_SOURCE_OPTIONS = [
  { label: 'Brand Logo', value: 'brand' },
  { label: 'Custom Image', value: 'custom' },
  { label: 'Emoji', value: 'emoji' },
];

const AVAILABLE_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Arabic', value: 'ar' },
];

export default function AdvancedTab({ config, onChange }: AdvancedTabProps) {
  function updateColorTransitions<K extends keyof ColorTransitionConfig>(key: K, value: ColorTransitionConfig[K]) {
    onChange('colorTransitions', { ...config.colorTransitions, [key]: value });
  }

  function updateFallingEffect<K extends keyof FallingEffectConfig>(key: K, value: FallingEffectConfig[K]) {
    onChange('fallingEffect', { ...config.fallingEffect, [key]: value });
  }

  function toggleLanguage(lang: string) {
    const current = config.availableLanguages;
    if (current.includes(lang)) {
      if (current.length > 1) {
        const updated = current.filter((l) => l !== lang);
        onChange('availableLanguages', updated);
        if (config.defaultLanguage === lang) onChange('defaultLanguage', updated[0]);
      }
    } else {
      onChange('availableLanguages', [...current, lang]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Custom CSS */}
      <CollapsibleSection title="Custom CSS">
        <TextareaField
          label="Custom CSS"
          value={config.customCss}
          onChange={(v) => onChange('customCss', v)}
          placeholder={`.chat-container {\n  /* your custom styles */\n}`}
          rows={8}
          helperText="Inject custom CSS into the widget. Advanced users only — may break layout."
        />
      </CollapsibleSection>

      {/* Language Selector */}
      <CollapsibleSection title="Language Selector">
        <Toggle
          label="Enable Language Selector"
          checked={config.enableLanguageSelector}
          onChange={(v) => onChange('enableLanguageSelector', v)}
          helperText="Shows language switcher buttons in the chat header."
        />
        {config.enableLanguageSelector && (
          <>
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Available Languages</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleLanguage(lang.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                      config.availableLanguages.includes(lang.value)
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            <RadioGroup
              label="Default Language"
              value={config.defaultLanguage}
              onChange={(v) => onChange('defaultLanguage', v)}
              options={config.availableLanguages.map((l) => ({ label: l.toUpperCase(), value: l }))}
            />
          </>
        )}
      </CollapsibleSection>

      {/* Custom Cursor */}
      <CollapsibleSection title="Custom Cursor">
        <Toggle
          label="Enable Custom Cursor"
          checked={config.enableCustomCursor}
          onChange={(v) => onChange('enableCustomCursor', v)}
        />
        {config.enableCustomCursor && (
          <>
            <RadioGroup
              label="Cursor Type"
              value={config.cursorType}
              onChange={(v) => onChange('cursorType', v as 'preset' | 'custom')}
              options={CURSOR_TYPE_OPTIONS}
            />
            {config.cursorType === 'preset' ? (
              <RadioGroup
                label="Preset Cursor"
                value={config.presetCursor}
                onChange={(v) => onChange('presetCursor', v)}
                options={PRESET_CURSOR_OPTIONS}
              />
            ) : (
              <Input
                label="Custom Cursor URL"
                placeholder="https://example.com/cursor.png"
                value={config.customCursorUrl}
                onChange={(e) => onChange('customCursorUrl', e.target.value)}
                helperText="URL to a cursor image (32x32 recommended)."
              />
            )}
          </>
        )}
      </CollapsibleSection>

      {/* Color Transitions */}
      <CollapsibleSection title="Color Transitions">
        <Toggle
          label="Enable Color Transitions"
          checked={config.enableColorTransitions}
          onChange={(v) => onChange('enableColorTransitions', v)}
          helperText="Animates colors between two values on selected elements."
        />
        {config.enableColorTransitions && (
          <>
            <Slider label="Transition Speed" value={config.colorTransitions.transitionSpeed} onChange={(v) => updateColorTransitions('transitionSpeed', v)} min={1} max={10} unit="s" />
            <Toggle label="Header Transition" checked={config.colorTransitions.headerTransition} onChange={(v) => updateColorTransitions('headerTransition', v)} />
            {config.colorTransitions.headerTransition && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Color 1" value={config.colorTransitions.headerColor1} onChange={(v) => updateColorTransitions('headerColor1', v)} />
                <ColorPicker label="Color 2" value={config.colorTransitions.headerColor2} onChange={(v) => updateColorTransitions('headerColor2', v)} />
              </div>
            )}
            <Toggle label="Toggle Transition" checked={config.colorTransitions.toggleTransition} onChange={(v) => updateColorTransitions('toggleTransition', v)} />
            {config.colorTransitions.toggleTransition && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Color 1" value={config.colorTransitions.toggleColor1} onChange={(v) => updateColorTransitions('toggleColor1', v)} />
                <ColorPicker label="Color 2" value={config.colorTransitions.toggleColor2} onChange={(v) => updateColorTransitions('toggleColor2', v)} />
              </div>
            )}
            <Toggle label="User Message Transition" checked={config.colorTransitions.userMessageTransition} onChange={(v) => updateColorTransitions('userMessageTransition', v)} />
            {config.colorTransitions.userMessageTransition && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Color 1" value={config.colorTransitions.userMessageColor1} onChange={(v) => updateColorTransitions('userMessageColor1', v)} />
                <ColorPicker label="Color 2" value={config.colorTransitions.userMessageColor2} onChange={(v) => updateColorTransitions('userMessageColor2', v)} />
              </div>
            )}
            <Toggle label="Bot Message Transition" checked={config.colorTransitions.botMessageTransition} onChange={(v) => updateColorTransitions('botMessageTransition', v)} />
            {config.colorTransitions.botMessageTransition && (
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="Color 1" value={config.colorTransitions.botMessageColor1} onChange={(v) => updateColorTransitions('botMessageColor1', v)} />
                <ColorPicker label="Color 2" value={config.colorTransitions.botMessageColor2} onChange={(v) => updateColorTransitions('botMessageColor2', v)} />
              </div>
            )}
          </>
        )}
      </CollapsibleSection>

      {/* Falling Effect */}
      <CollapsibleSection title="Falling Effect">
        <Toggle
          label="Enable Falling Effect"
          checked={config.enableFallingEffect}
          onChange={(v) => onChange('enableFallingEffect', v)}
          helperText="Particles fall inside the chat window for visual flair."
        />
        {config.enableFallingEffect && (
          <>
            <RadioGroup
              label="Effect Source"
              value={config.fallingEffect.effectSource}
              onChange={(v) => updateFallingEffect('effectSource', v as 'brand' | 'custom' | 'emoji')}
              options={EFFECT_SOURCE_OPTIONS}
            />
            {config.fallingEffect.effectSource === 'custom' && (
              <Input
                label="Custom Image URL"
                placeholder="https://example.com/particle.png"
                value={config.fallingEffect.customImageUrl}
                onChange={(e) => updateFallingEffect('customImageUrl', e.target.value)}
              />
            )}
            {config.fallingEffect.effectSource === 'emoji' && (
              <Input
                label="Emoji"
                value={config.fallingEffect.emoji}
                onChange={(e) => updateFallingEffect('emoji', e.target.value)}
                helperText="Single emoji character for the falling effect."
              />
            )}
            <NumberInput label="Particle Count" value={config.fallingEffect.particleCount} onChange={(v) => updateFallingEffect('particleCount', v)} min={5} max={50} />
            <RadioGroup
              label="Fall Speed"
              value={config.fallingEffect.fallSpeed}
              onChange={(v) => updateFallingEffect('fallSpeed', v as 'slow' | 'medium' | 'fast')}
              options={FALL_SPEED_OPTIONS}
            />
            <Slider label="Particle Size" value={config.fallingEffect.particleSize} onChange={(v) => updateFallingEffect('particleSize', v)} min={8} max={40} unit="px" />
            <Toggle label="Show on Desktop" checked={config.fallingEffect.showOnDesktop} onChange={(v) => updateFallingEffect('showOnDesktop', v)} />
            <Toggle label="Show on Mobile" checked={config.fallingEffect.showOnMobile} onChange={(v) => updateFallingEffect('showOnMobile', v)} />
          </>
        )}
      </CollapsibleSection>
    </div>
  );
}
