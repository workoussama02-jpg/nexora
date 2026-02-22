// Window tab — chat window customization with collapsible sub-sections
'use client';

import type { WindowConfig, BotMessageConfig, UserMessageConfig, InputFieldConfig, WindowBorderRadius, TimestampFormat, SendButtonIcon, SocialLink } from '@/lib/types';
import ColorPicker from '../ColorPicker';
import CollapsibleSection from '../CollapsibleSection';
import Toggle from '@/components/ui/Toggle';
import NumberInput from '@/components/ui/NumberInput';
import Slider from '@/components/ui/Slider';
import RadioGroup from '@/components/ui/RadioGroup';
import Input from '@/components/ui/Input';
import TextareaField from '@/components/ui/TextareaField';
import { Plus, Trash2 } from 'lucide-react';

interface WindowTabProps {
  windowConfig: WindowConfig;
  botMessage: BotMessageConfig;
  userMessage: UserMessageConfig;
  inputField: InputFieldConfig;
  onWindowChange: <K extends keyof WindowConfig>(key: K, value: WindowConfig[K]) => void;
  onBotChange: <K extends keyof BotMessageConfig>(key: K, value: BotMessageConfig[K]) => void;
  onUserChange: <K extends keyof UserMessageConfig>(key: K, value: UserMessageConfig[K]) => void;
  onInputChange: <K extends keyof InputFieldConfig>(key: K, value: InputFieldConfig[K]) => void;
}

const WINDOW_RADIUS_OPTIONS = [
  { label: 'Rounded', value: 'rounded' },
  { label: 'None', value: 'none' },
];

const TIMESTAMP_FORMAT_OPTIONS = [
  { label: '12-hour', value: '12-hour' },
  { label: '24-hour', value: '24-hour' },
  { label: 'Relative', value: 'relative' },
  { label: 'Full', value: 'full' },
];

const SEND_BUTTON_ICON_OPTIONS = [
  { label: 'Arrow Up', value: 'arrow-up' },
  { label: 'Paper Plane', value: 'paper-plane' },
  { label: 'Send', value: 'send' },
];

const SOCIAL_PLATFORMS = ['Website', 'Facebook', 'Twitter/X', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'WhatsApp', 'Telegram', 'GitHub'];

export default function WindowTab({
  windowConfig, botMessage, userMessage, inputField,
  onWindowChange, onBotChange, onUserChange, onInputChange,
}: WindowTabProps) {
  function addPrompt() {
    if (windowConfig.starterPrompts.length >= 5) return;
    onWindowChange('starterPrompts', [...windowConfig.starterPrompts, '']);
  }

  function removePrompt(index: number) {
    onWindowChange('starterPrompts', windowConfig.starterPrompts.filter((_, i) => i !== index));
  }

  function updatePrompt(index: number, value: string) {
    const updated = [...windowConfig.starterPrompts];
    updated[index] = value;
    onWindowChange('starterPrompts', updated);
  }

  return (
    <div className="space-y-4">
      {/* General Window Settings */}
      <CollapsibleSection title="General Window Settings">
        <RadioGroup
          label="Border Radius Style"
          value={windowConfig.borderRadiusStyle}
          onChange={(v) => onWindowChange('borderRadiusStyle', v as WindowBorderRadius)}
          options={WINDOW_RADIUS_OPTIONS}
        />
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="Window Height" value={windowConfig.height} onChange={(v) => onWindowChange('height', v)} min={300} max={800} unit="px" />
          <NumberInput label="Window Width" value={windowConfig.width} onChange={(v) => onWindowChange('width', v)} min={300} max={600} unit="px" />
        </div>
        <ColorPicker label="Background Color" value={windowConfig.backgroundColor} onChange={(v) => onWindowChange('backgroundColor', v)} />
        <NumberInput label="Font Size" value={windowConfig.fontSize} onChange={(v) => onWindowChange('fontSize', v)} min={12} max={24} unit="px" />
        <Toggle label="Show Scrollbar" checked={windowConfig.showScrollbar} onChange={(v) => onWindowChange('showScrollbar', v)} />
      </CollapsibleSection>

      {/* Header / Title */}
      <CollapsibleSection title="Header / Title">
        <Toggle label="Show Title Section" checked={windowConfig.showTitle} onChange={(v) => onWindowChange('showTitle', v)} />
        {windowConfig.showTitle && (
          <>
            <Input label="Title" placeholder="My Chat Bot" value={windowConfig.title} onChange={(e) => onWindowChange('title', e.target.value)} helperText="Defaults to Company Name if empty." />
            <Input label="Title Avatar URL" placeholder="https://example.com/avatar.png" value={windowConfig.titleAvatarUrl} onChange={(e) => onWindowChange('titleAvatarUrl', e.target.value)} />
            <Slider label="Avatar Size" value={windowConfig.avatarSize} onChange={(v) => onWindowChange('avatarSize', v)} min={20} max={80} unit="px" />
            <Slider label="Avatar Border Radius" value={windowConfig.avatarBorderRadius} onChange={(v) => onWindowChange('avatarBorderRadius', v)} min={0} max={50} unit="px" />
          </>
        )}
      </CollapsibleSection>

      {/* Welcome & Prompts */}
      <CollapsibleSection title="Welcome & Prompts">
        <TextareaField label="Welcome Message" value={windowConfig.welcomeMessage} onChange={(v) => onWindowChange('welcomeMessage', v)} placeholder="Hello! Welcome!" helperText="Defaults to the Welcome Text if empty." />
        <Input label="Custom Error Message" placeholder="Something went wrong..." value={windowConfig.customErrorMessage} onChange={(e) => onWindowChange('customErrorMessage', e.target.value)} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Starter Prompts</span>
            {windowConfig.starterPrompts.length < 5 && (
              <button type="button" onClick={addPrompt} className="flex items-center gap-1 text-xs text-brand-primary hover:underline">
                <Plus className="h-3 w-3" /> Add Prompt
              </button>
            )}
          </div>
          {windowConfig.starterPrompts.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500">No prompts yet. Add up to 5 starter prompts.</p>
          )}
          <div className="space-y-2">
            {windowConfig.starterPrompts.map((prompt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => updatePrompt(i, e.target.value)}
                  placeholder={`Prompt ${i + 1}`}
                  maxLength={100}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-primary"
                />
                <button type="button" onClick={() => removePrompt(i)} className="text-gray-400 hover:text-red-400 transition p-2">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <NumberInput label="Starter Prompt Font Size" value={windowConfig.starterPromptFontSize} onChange={(v) => onWindowChange('starterPromptFontSize', v)} min={10} max={18} unit="px" />
      </CollapsibleSection>

      {/* Message Display Settings */}
      <CollapsibleSection title="Message Display Settings">
        <Slider label="Message Border Radius" value={windowConfig.messageBorderRadius} onChange={(v) => onWindowChange('messageBorderRadius', v)} min={0} max={20} unit="px" />
        <Toggle label="Render HTML in Bot Responses" checked={windowConfig.renderHtml} onChange={(v) => onWindowChange('renderHtml', v)} helperText="When on, bot messages render HTML/Markdown." />
        <Toggle label="Clear Chat on Reload" checked={windowConfig.clearOnReload} onChange={(v) => onWindowChange('clearOnReload', v)} />
        <Toggle label="Show Back to Welcome Button" checked={windowConfig.showBackToWelcome} onChange={(v) => onWindowChange('showBackToWelcome', v)} helperText="Shows a back button in the header to return to welcome screen." />
        <Toggle label="Show Refresh Button" checked={windowConfig.showRefreshButton} onChange={(v) => onWindowChange('showRefreshButton', v)} helperText="Shows a refresh button in the header to reset chat." />
      </CollapsibleSection>

      {/* Message Timestamps */}
      <CollapsibleSection title="Message Timestamps">
        <Toggle label="Show Timestamps" checked={windowConfig.showTimestamps} onChange={(v) => onWindowChange('showTimestamps', v)} />
        {windowConfig.showTimestamps && (
          <>
            <RadioGroup
              label="Timestamp Format"
              value={windowConfig.timestampFormat}
              onChange={(v) => onWindowChange('timestampFormat', v as TimestampFormat)}
              options={TIMESTAMP_FORMAT_OPTIONS}
            />
            <ColorPicker label="Timestamp Color" value={windowConfig.timestampColor} onChange={(v) => onWindowChange('timestampColor', v)} />
            <NumberInput label="Timestamp Font Size" value={windowConfig.timestampFontSize} onChange={(v) => onWindowChange('timestampFontSize', v)} min={8} max={16} unit="px" />
          </>
        )}
      </CollapsibleSection>

      {/* Header Social Icons */}
      <CollapsibleSection title="Header Social Icons">
        <Toggle label="Show Social Icons" checked={windowConfig.showSocialIcons} onChange={(v) => onWindowChange('showSocialIcons', v)} />
        {windowConfig.showSocialIcons && (
          <>
            <Slider label="Icon Size" value={windowConfig.socialIconSize} onChange={(v) => onWindowChange('socialIconSize', v)} min={12} max={30} unit="px" />
            <ColorPicker label="Icon Color" value={windowConfig.socialIconColor} onChange={(v) => onWindowChange('socialIconColor', v)} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Social Links</span>
                {windowConfig.socialLinks.length < 5 && (
                  <button type="button" onClick={() => onWindowChange('socialLinks', [...windowConfig.socialLinks, { platform: 'Website', url: '' }])} className="flex items-center gap-1 text-xs text-brand-primary hover:underline">
                    <Plus className="h-3 w-3" /> Add Link
                  </button>
                )}
              </div>
              {windowConfig.socialLinks.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500">No social links yet. Add up to 5.</p>
              )}
              <div className="space-y-3">
                {windowConfig.socialLinks.map((link: SocialLink, i: number) => (
                  <div key={i} className="space-y-1 rounded-lg border border-gray-200 dark:border-white/10 p-3">
                    <div className="flex items-center justify-between">
                      <select
                        value={link.platform}
                        onChange={(e) => {
                          const updated = [...windowConfig.socialLinks];
                          updated[i] = { ...updated[i], platform: e.target.value };
                          onWindowChange('socialLinks', updated);
                        }}
                        className="text-sm rounded border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-2 py-1 text-gray-900 dark:text-white outline-none"
                      >
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => onWindowChange('socialLinks', windowConfig.socialLinks.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-400 transition p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...windowConfig.socialLinks];
                        updated[i] = { ...updated[i], url: e.target.value };
                        onWindowChange('socialLinks', updated);
                      }}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-brand-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CollapsibleSection>

      {/* Shadow & Glow */}
      <CollapsibleSection title="Shadow & Glow">
        <Toggle label="Enable Shadow / Glow" checked={windowConfig.shadowEnabled} onChange={(v) => onWindowChange('shadowEnabled', v)} />
        {windowConfig.shadowEnabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Shadow Color 1" value={windowConfig.shadowColor1} onChange={(v) => onWindowChange('shadowColor1', v)} />
              <ColorPicker label="Shadow Color 2" value={windowConfig.shadowColor2} onChange={(v) => onWindowChange('shadowColor2', v)} />
            </div>
            <Slider label="Shadow Blur" value={windowConfig.shadowBlur} onChange={(v) => onWindowChange('shadowBlur', v)} min={5} max={50} unit="px" />
            <Slider label="Shadow Spread" value={windowConfig.shadowSpread} onChange={(v) => onWindowChange('shadowSpread', v)} min={1} max={20} unit="px" />
            <Toggle label="Animate Shadow" checked={windowConfig.shadowAnimate} onChange={(v) => onWindowChange('shadowAnimate', v)} />
            {windowConfig.shadowAnimate && (
              <Slider label="Animation Speed" value={windowConfig.shadowAnimationSpeed} onChange={(v) => onWindowChange('shadowAnimationSpeed', v)} min={1} max={10} unit="s" />
            )}
          </>
        )}
      </CollapsibleSection>

      {/* Bot Message Settings */}
      <CollapsibleSection title="Bot Message Settings">
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Background Color" value={botMessage.backgroundColor} onChange={(v) => onBotChange('backgroundColor', v)} />
          <ColorPicker label="Text Color" value={botMessage.textColor} onChange={(v) => onBotChange('textColor', v)} />
        </div>
        <Toggle label="Show Bot Avatar" checked={botMessage.showAvatar} onChange={(v) => onBotChange('showAvatar', v)} />
        {botMessage.showAvatar && (
          <Input label="Bot Avatar URL" placeholder="https://example.com/bot-avatar.png" value={botMessage.avatarUrl} onChange={(e) => onBotChange('avatarUrl', e.target.value)} />
        )}
        <Toggle label="Show Copy to Clipboard Icon" checked={botMessage.showCopyIcon} onChange={(v) => onBotChange('showCopyIcon', v)} />
        <Toggle label="Show Typing Indicator" checked={botMessage.showTypingIndicator} onChange={(v) => onBotChange('showTypingIndicator', v)} helperText="Shows animated typing dots before bot responds." />
        {botMessage.showTypingIndicator && (
          <ColorPicker label="Typing Indicator Color" value={botMessage.typingIndicatorColor} onChange={(v) => onBotChange('typingIndicatorColor', v)} />
        )}
      </CollapsibleSection>

      {/* User Message Settings */}
      <CollapsibleSection title="User Message Settings">
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Background Color" value={userMessage.backgroundColor} onChange={(v) => onUserChange('backgroundColor', v)} />
          <ColorPicker label="Text Color" value={userMessage.textColor} onChange={(v) => onUserChange('textColor', v)} />
        </div>
        <Toggle label="Show User Avatar" checked={userMessage.showAvatar} onChange={(v) => onUserChange('showAvatar', v)} />
        {userMessage.showAvatar && (
          <Input label="User Avatar URL" placeholder="https://example.com/user-avatar.png" value={userMessage.avatarUrl} onChange={(e) => onUserChange('avatarUrl', e.target.value)} />
        )}
      </CollapsibleSection>

      {/* Text Input Field Settings */}
      <CollapsibleSection title="Text Input Field Settings">
        <Slider label="Input Border Radius" value={inputField.borderRadius} onChange={(v) => onInputChange('borderRadius', v)} min={0} max={30} unit="px" />
        <Input label="Placeholder Text" placeholder="Type a message..." value={inputField.placeholder} onChange={(e) => onInputChange('placeholder', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Input Background" value={inputField.backgroundColor} onChange={(v) => onInputChange('backgroundColor', v)} />
          <ColorPicker label="Input Text Color" value={inputField.textColor} onChange={(v) => onInputChange('textColor', v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Send Button Color" value={inputField.sendButtonColor} onChange={(v) => onInputChange('sendButtonColor', v)} />
          <Slider label="Send Button Radius" value={inputField.sendButtonBorderRadius} onChange={(v) => onInputChange('sendButtonBorderRadius', v)} min={0} max={50} unit="px" />
        </div>
        <NumberInput label="Maximum Characters" value={inputField.maxCharacters} onChange={(v) => onInputChange('maxCharacters', v)} min={0} max={5000} helperText="0 = no limit" />
        {inputField.maxCharacters > 0 && (
          <Input label="Max Characters Warning" value={inputField.maxCharsWarning} onChange={(e) => onInputChange('maxCharsWarning', e.target.value)} />
        )}
        <Toggle label="Auto Focus" checked={inputField.autoFocus} onChange={(v) => onInputChange('autoFocus', v)} helperText="Focus the input when the chat window opens." />
        <Toggle label="Show Send Button" checked={windowConfig.showSendButton} onChange={(v) => onWindowChange('showSendButton', v)} />
        {windowConfig.showSendButton && (
          <RadioGroup
            label="Send Button Icon"
            value={windowConfig.sendButtonIcon}
            onChange={(v) => onWindowChange('sendButtonIcon', v as SendButtonIcon)}
            options={SEND_BUTTON_ICON_OPTIONS}
          />
        )}
        <Toggle label="Show Emoji Picker" checked={inputField.showEmojiPicker} onChange={(v) => onInputChange('showEmojiPicker', v)} helperText="Adds an emoji button next to the text input." />
      </CollapsibleSection>
    </div>
  );
}
