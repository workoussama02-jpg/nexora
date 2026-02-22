// Bubble tab — chat toggle button customization
'use client';

import type { BubbleConfig, BubbleBorderRadius, BubbleAnimation, AnimationSpeed } from '@/lib/types';
import ColorPicker from '../ColorPicker';
import PositionToggle from '../PositionToggle';
import CollapsibleSection from '../CollapsibleSection';
import RadioGroup from '@/components/ui/RadioGroup';
import NumberInput from '@/components/ui/NumberInput';
import Slider from '@/components/ui/Slider';
import Toggle from '@/components/ui/Toggle';
import Input from '@/components/ui/Input';

interface BubbleTabProps {
  config: BubbleConfig;
  position: 'left' | 'right';
  onChange: <K extends keyof BubbleConfig>(key: K, value: BubbleConfig[K]) => void;
  onPositionChange: (position: 'left' | 'right') => void;
}

const RADIUS_OPTIONS = [
  { label: 'Circle', value: 'circle' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'None', value: 'none' },
];

const ANIMATION_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Float', value: 'float' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Shake', value: 'shake' },
  { label: 'Wiggle', value: 'wiggle' },
];

const SPEED_OPTIONS = [
  { label: 'Slow', value: 'slow' },
  { label: 'Normal', value: 'normal' },
  { label: 'Fast', value: 'fast' },
];

export default function BubbleTab({ config, position, onChange, onPositionChange }: BubbleTabProps) {
  return (
    <div className="space-y-5">
      <PositionToggle value={position} onChange={onPositionChange} />

      <RadioGroup
        label="Border Radius Style"
        value={config.borderRadiusStyle}
        onChange={(v) => onChange('borderRadiusStyle', v as BubbleBorderRadius)}
        options={RADIUS_OPTIONS}
      />

      <ColorPicker
        label="Background Color"
        value={config.backgroundColor}
        onChange={(v) => onChange('backgroundColor', v)}
      />

      <Input
        label="Custom Icon URL"
        placeholder="https://example.com/icon.svg"
        value={config.customIconUrl}
        onChange={(e) => onChange('customIconUrl', e.target.value)}
        helperText="URL to a custom SVG or image for the bubble. Leave empty for default icon."
      />

      <Slider
        label="Custom Icon Size"
        value={config.customIconSize}
        onChange={(v) => onChange('customIconSize', v)}
        min={20}
        max={100}
        unit="%"
      />

      <Slider
        label="Custom Icon Border Radius"
        value={config.customIconBorderRadius}
        onChange={(v) => onChange('customIconBorderRadius', v)}
        min={0}
        max={50}
        unit="px"
      />

      <ColorPicker
        label="Color of Internal Icons"
        value={config.internalIconsColor}
        onChange={(v) => onChange('internalIconsColor', v)}
      />

      <NumberInput
        label="Bubble Size"
        value={config.size}
        onChange={(v) => onChange('size', v)}
        min={30}
        max={100}
        unit="px"
      />

      {position === 'right' && (
        <NumberInput
          label="Right Position"
          value={config.rightPosition}
          onChange={(v) => onChange('rightPosition', v)}
          min={0}
          max={100}
          unit="px"
        />
      )}

      {position === 'left' && (
        <NumberInput
          label="Left Position"
          value={config.rightPosition}
          onChange={(v) => onChange('rightPosition', v)}
          min={0}
          max={100}
          unit="px"
        />
      )}

      <NumberInput
        label="Bottom Position"
        value={config.bottomPosition}
        onChange={(v) => onChange('bottomPosition', v)}
        min={0}
        max={100}
        unit="px"
      />

      <Toggle
        label="Auto Open Bot Window"
        checked={config.autoOpen}
        onChange={(v) => onChange('autoOpen', v)}
        helperText="Automatically opens the chat window when the page loads."
      />

      {config.autoOpen && (
        <NumberInput
          label="Open Delay"
          value={config.openDelay}
          onChange={(v) => onChange('openDelay', v)}
          min={0}
          max={30}
          unit="seconds"
        />
      )}

      {/* Bubble Animation */}
      <CollapsibleSection title="Bubble Animation">
        <RadioGroup
          label="Animation Style"
          value={config.animation}
          onChange={(v) => onChange('animation', v as BubbleAnimation)}
          options={ANIMATION_OPTIONS}
        />
        {config.animation !== 'none' && (
          <>
            <RadioGroup
              label="Animation Speed"
              value={config.animationSpeed}
              onChange={(v) => onChange('animationSpeed', v as AnimationSpeed)}
              options={SPEED_OPTIONS}
            />
            <Toggle
              label="Animate Only on Load"
              checked={config.animateOnlyOnLoad}
              onChange={(v) => onChange('animateOnlyOnLoad', v)}
              helperText="When on, animation plays once. When off, it loops."
            />
          </>
        )}
      </CollapsibleSection>
    </div>
  );
}
