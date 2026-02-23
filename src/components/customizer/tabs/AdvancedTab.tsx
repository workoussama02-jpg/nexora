// Advanced tab — custom CSS, custom cursor, color transitions, falling effect
'use client';

import type { AdvancedConfig, ColorTransitionConfig, FallingEffectConfig } from '@/lib/types';
import TextareaField from '@/components/ui/TextareaField';
import CollapsibleSection from '../CollapsibleSection';
import Toggle from '@/components/ui/Toggle';
import RadioGroup from '@/components/ui/RadioGroup';
import Input from '@/components/ui/Input';
import EmojiPickerInput from '@/components/ui/EmojiPickerInput';
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

export default function AdvancedTab({ config, onChange }: AdvancedTabProps) {
  function updateColorTransitions<K extends keyof ColorTransitionConfig>(key: K, value: ColorTransitionConfig[K]) {
    onChange('colorTransitions', { ...config.colorTransitions, [key]: value });
  }

  function updateFallingEffect<K extends keyof FallingEffectConfig>(key: K, value: FallingEffectConfig[K]) {
    onChange('fallingEffect', { ...config.fallingEffect, [key]: value });
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
            <Slider label="Transition Speed" value={config.colorTransitions.transitionSpeed} onChange={(v) => updateColorTransitions('transitionSpeed', v)} min={1} max={20} unit="s" />
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
              <EmojiPickerInput
                label="Emoji"
                value={config.fallingEffect.emoji}
                onChange={(v) => updateFallingEffect('emoji', v)}
                helperText="Pick or type an emoji for the falling effect."
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
            <Slider label="Particle Opacity" value={config.fallingEffect.particleOpacity} onChange={(v) => updateFallingEffect('particleOpacity', v)} min={0.1} max={1} step={0.05} />
            <Toggle label="Show on Desktop" checked={config.fallingEffect.showOnDesktop} onChange={(v) => updateFallingEffect('showOnDesktop', v)} />
            <Toggle label="Show on Mobile" checked={config.fallingEffect.showOnMobile} onChange={(v) => updateFallingEffect('showOnMobile', v)} />
          </>
        )}
      </CollapsibleSection>
    </div>
  );
}
