// Full customizer form — manages all form state, validation, save, download
// Tabbed interface: Bubble | Tooltip | Window | Footer | Advanced
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@insforge/nextjs';
import { Lock } from 'lucide-react';
import { createWidget, updateWidget } from '@/lib/widgets';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_ADVANCED_CONFIG } from '@/lib/constants';
import { validateWidgetForm, validateAdvancedConfig } from '@/lib/validators';
import type { WidgetRow, WidgetAdvancedConfig, BubbleConfig, TooltipConfig, WindowConfig, BotMessageConfig, UserMessageConfig, InputFieldConfig, FooterConfig, AdvancedConfig } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormSection from './FormSection';
import ColorPicker from './ColorPicker';
import PositionToggle from './PositionToggle';
import PreviewPane from './PreviewPane';
import DeployInstructions from './DeployInstructions';
import BubbleTab from './tabs/BubbleTab';
import TooltipTab from './tabs/TooltipTab';
import WindowTab from './tabs/WindowTab';
import FooterTab from './tabs/FooterTab';
import AdvancedTab from './tabs/AdvancedTab';

interface CustomizerFormProps {
  widget?: WidgetRow | null;
}

interface FormState {
  name: string;
  webhookUrl: string;
  webhookRoute: string;
  logoUrl: string;
  companyName: string;
  welcomeText: string;
  responseTimeText: string;
  poweredByText: string;
  poweredByLink: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontColor: string;
  position: 'left' | 'right';
}

const TABS = ['Bubble', 'Tooltip', 'Window', 'Footer', 'Advanced'] as const;
type TabName = typeof TABS[number];

/** Deep merge saved partial config with full defaults */
function mergeConfig(saved: Partial<WidgetAdvancedConfig> | undefined): WidgetAdvancedConfig {
  const d = DEFAULT_ADVANCED_CONFIG;
  if (!saved) return { ...d };
  return {
    bubble: { ...d.bubble, ...saved.bubble },
    tooltip: { ...d.tooltip, ...saved.tooltip },
    window: { ...d.window, ...saved.window, starterPrompts: saved.window?.starterPrompts ?? d.window.starterPrompts },
    botMessage: { ...d.botMessage, ...saved.botMessage },
    userMessage: { ...d.userMessage, ...saved.userMessage },
    inputField: { ...d.inputField, ...saved.inputField },
    footer: { ...d.footer, ...saved.footer },
    advanced: { ...d.advanced, ...saved.advanced },
  };
}

function widgetToForm(w: WidgetRow): FormState {
  return {
    name: w.name,
    webhookUrl: w.webhook_url,
    webhookRoute: w.webhook_route,
    logoUrl: w.logo_url ?? '',
    companyName: w.company_name,
    welcomeText: w.welcome_text,
    responseTimeText: w.response_time_text ?? '',
    poweredByText: w.powered_by_text,
    poweredByLink: w.powered_by_link,
    primaryColor: w.primary_color,
    secondaryColor: w.secondary_color,
    backgroundColor: w.background_color,
    fontColor: w.font_color,
    position: w.position,
  };
}

const INITIAL_FORM: FormState = {
  name: '',
  webhookUrl: '',
  webhookRoute: DEFAULT_WIDGET_CONFIG.webhookRoute,
  logoUrl: '',
  companyName: '',
  welcomeText: '',
  responseTimeText: '',
  poweredByText: DEFAULT_WIDGET_CONFIG.poweredByText,
  poweredByLink: DEFAULT_WIDGET_CONFIG.poweredByLink,
  primaryColor: DEFAULT_WIDGET_CONFIG.primaryColor,
  secondaryColor: DEFAULT_WIDGET_CONFIG.secondaryColor,
  backgroundColor: DEFAULT_WIDGET_CONFIG.backgroundColor,
  fontColor: DEFAULT_WIDGET_CONFIG.fontColor,
  position: DEFAULT_WIDGET_CONFIG.position,
};

export default function CustomizerForm({ widget }: CustomizerFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState>(widget ? widgetToForm(widget) : INITIAL_FORM);
  const [config, setConfig] = useState<WidgetAdvancedConfig>(() => mergeConfig(widget?.config));
  const [activeTab, setActiveTab] = useState<TabName>('Bubble');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const isDirtyRef = useRef(false);
  const savedRef = useRef(!!widget);

  // Track dirty state for beforeunload
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    isDirtyRef.current = true;
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // Config sub-object updaters
  const updateBubble = useCallback(<K extends keyof BubbleConfig>(key: K, value: BubbleConfig[K]) => {
    setConfig((prev) => ({ ...prev, bubble: { ...prev.bubble, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateTooltip = useCallback(<K extends keyof TooltipConfig>(key: K, value: TooltipConfig[K]) => {
    setConfig((prev) => ({ ...prev, tooltip: { ...prev.tooltip, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateWindow = useCallback(<K extends keyof WindowConfig>(key: K, value: WindowConfig[K]) => {
    setConfig((prev) => ({ ...prev, window: { ...prev.window, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateBotMessage = useCallback(<K extends keyof BotMessageConfig>(key: K, value: BotMessageConfig[K]) => {
    setConfig((prev) => ({ ...prev, botMessage: { ...prev.botMessage, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateUserMessage = useCallback(<K extends keyof UserMessageConfig>(key: K, value: UserMessageConfig[K]) => {
    setConfig((prev) => ({ ...prev, userMessage: { ...prev.userMessage, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateInputField = useCallback(<K extends keyof InputFieldConfig>(key: K, value: InputFieldConfig[K]) => {
    setConfig((prev) => ({ ...prev, inputField: { ...prev.inputField, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateFooter = useCallback(<K extends keyof FooterConfig>(key: K, value: FooterConfig[K]) => {
    setConfig((prev) => ({ ...prev, footer: { ...prev.footer, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  const updateAdvanced = useCallback(<K extends keyof AdvancedConfig>(key: K, value: AdvancedConfig[K]) => {
    setConfig((prev) => ({ ...prev, advanced: { ...prev.advanced, [key]: value } }));
    isDirtyRef.current = true;
  }, []);

  async function handleSave(): Promise<string | null> {
    const validationErrors = validateWidgetForm({
      name: form.name,
      webhookUrl: form.webhookUrl,
      companyName: form.companyName,
      welcomeText: form.welcomeText,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      backgroundColor: form.backgroundColor,
      fontColor: form.fontColor,
      position: form.position,
    });

    const advancedErrors = validateAdvancedConfig(config);
    const allErrors = { ...validationErrors, ...advancedErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      showToast('Please fix the errors before saving.', 'error');
      return null;
    }

    if (!user?.id) return null;
    setSaving(true);
    setErrors({});

    try {
      if (widget) {
        const { error } = await updateWidget(widget.id, user.id, {
          name: form.name,
          webhook_url: form.webhookUrl,
          webhook_route: form.webhookRoute || 'general',
          logo_url: form.logoUrl || null,
          company_name: form.companyName,
          welcome_text: form.welcomeText,
          response_time_text: form.responseTimeText || null,
          powered_by_text: form.poweredByText,
          powered_by_link: form.poweredByLink,
          primary_color: form.primaryColor,
          secondary_color: form.secondaryColor,
          background_color: form.backgroundColor,
          font_color: form.fontColor,
          position: form.position,
          config,
        });
        if (error) {
          showToast(error, 'error');
          return null;
        }
        isDirtyRef.current = false;
        savedRef.current = true;
        showToast('Widget saved!', 'success');
        return widget.id;
      } else {
        const { data, error } = await createWidget({
          name: form.name,
          webhook_url: form.webhookUrl,
          webhook_route: form.webhookRoute || 'general',
          logo_url: form.logoUrl || null,
          company_name: form.companyName,
          welcome_text: form.welcomeText,
          response_time_text: form.responseTimeText || null,
          powered_by_text: form.poweredByText,
          powered_by_link: form.poweredByLink,
          primary_color: form.primaryColor,
          secondary_color: form.secondaryColor,
          background_color: form.backgroundColor,
          font_color: form.fontColor,
          position: form.position,
          config,
          user_id: user.id,
        });
        if (error || !data) {
          showToast(error ?? 'Something went wrong. Please try again.', 'error');
          return null;
        }
        isDirtyRef.current = false;
        savedRef.current = true;
        showToast('Widget saved!', 'success');
        router.replace(`/dashboard/edit/${data.id}`);
        return data.id;
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const widgetId = await handleSave();
      if (!widgetId) {
        setDownloading(false);
        return;
      }

      const res = await fetch('/api/generate-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: form.webhookUrl,
          webhookRoute: form.webhookRoute || 'general',
          logoUrl: form.logoUrl,
          companyName: form.companyName,
          welcomeText: form.welcomeText,
          responseTimeText: form.responseTimeText,
          poweredByText: form.poweredByText,
          poweredByLink: form.poweredByLink,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          backgroundColor: form.backgroundColor,
          fontColor: form.fontColor,
          position: form.position,
          widgetName: form.name,
          config,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        showToast(body?.error ?? 'Download failed. Please try again.', 'error');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-widget-${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Widget files downloaded!', 'success');
      setShowInstructions(true);
    } catch {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  }

  const previewConfig = {
    logoUrl: form.logoUrl,
    companyName: form.companyName,
    welcomeText: form.welcomeText,
    responseTimeText: form.responseTimeText,
    poweredByText: form.poweredByText,
    poweredByLink: form.poweredByLink,
    primaryColor: form.primaryColor,
    secondaryColor: form.secondaryColor,
    backgroundColor: form.backgroundColor,
    fontColor: form.fontColor,
    position: form.position,
    advancedConfig: config,
  };

  return (
    <>
      <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
        {/* Left: Form */}
        <div className="space-y-8">
          <FormSection title="Widget Settings">
            <Input
              label="Widget Name"
              placeholder="e.g., Support Bot"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
              maxLength={100}
              helperText="Internal label — not shown in the widget."
              required
            />
          </FormSection>

          <FormSection title="Webhook">
            <Input
              label="Webhook URL"
              placeholder="https://your-n8n-instance.com/webhook/..."
              value={form.webhookUrl}
              onChange={(e) => updateField('webhookUrl', e.target.value)}
              error={errors.webhookUrl}
              required
            />
            <Input
              label="Route"
              placeholder="general"
              value={form.webhookRoute}
              onChange={(e) => updateField('webhookRoute', e.target.value)}
              helperText='Defaults to "general" if left empty.'
            />
          </FormSection>

          <FormSection title="Branding">
            <Input
              label="Logo URL"
              placeholder="https://example.com/logo.png"
              value={form.logoUrl}
              onChange={(e) => updateField('logoUrl', e.target.value)}
              helperText="Paste a URL to your logo image (hosted on Imgur, your website, etc.)."
            />
            <Input
              label="Company / Bot Name"
              placeholder="e.g., Acme Support"
              value={form.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              error={errors.companyName}
              maxLength={50}
              required
            />
            <Input
              label="Welcome Text"
              placeholder="e.g., Hi there! 👋 How can we help?"
              value={form.welcomeText}
              onChange={(e) => updateField('welcomeText', e.target.value)}
              error={errors.welcomeText}
              maxLength={200}
              required
            />
            <Input
              label="Response Time Text"
              placeholder="e.g., We usually respond in a few minutes"
              value={form.responseTimeText}
              onChange={(e) => updateField('responseTimeText', e.target.value)}
              maxLength={100}
            />

            {/* Powered By — locked on Free tier */}
            <div className="relative">
              <div className="pointer-events-none opacity-50">
                <Input
                  label="Powered By Text"
                  value={form.poweredByText}
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
                  label="Powered By Link"
                  value={form.poweredByLink}
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div className="absolute right-2 top-0 flex items-center gap-1 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Pro only</span>
              </div>
            </div>
          </FormSection>

          <FormSection title="Style">
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Primary Color" value={form.primaryColor} onChange={(v) => updateField('primaryColor', v)} />
              <ColorPicker label="Secondary Color" value={form.secondaryColor} onChange={(v) => updateField('secondaryColor', v)} />
              <ColorPicker label="Background Color" value={form.backgroundColor} onChange={(v) => updateField('backgroundColor', v)} />
              <ColorPicker label="Font Color" value={form.fontColor} onChange={(v) => updateField('fontColor', v)} />
            </div>
            <PositionToggle value={form.position} onChange={(v) => updateField('position', v)} />
          </FormSection>

          {/* Tabbed customization sections */}
          <div>
            {/* Tab bar */}
            <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[200px]">
              {activeTab === 'Bubble' && (
                <BubbleTab config={config.bubble} position={form.position} onChange={updateBubble} />
              )}
              {activeTab === 'Tooltip' && (
                <TooltipTab config={config.tooltip} onChange={updateTooltip} />
              )}
              {activeTab === 'Window' && (
                <WindowTab
                  windowConfig={config.window}
                  botMessage={config.botMessage}
                  userMessage={config.userMessage}
                  inputField={config.inputField}
                  onWindowChange={updateWindow}
                  onBotChange={updateBotMessage}
                  onUserChange={updateUserMessage}
                  onInputChange={updateInputField}
                />
              )}
              {activeTab === 'Footer' && (
                <FooterTab config={config.footer} onChange={updateFooter} />
              )}
              {activeTab === 'Advanced' && (
                <AdvancedTab config={config.advanced} onChange={updateAdvanced} />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-8">
            <Button variant="secondary" onClick={handleSave} loading={saving} disabled={downloading}>
              Save Widget
            </Button>
            <Button onClick={handleDownload} loading={downloading} disabled={saving}>
              Download Files
            </Button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="hidden md:block">
          <PreviewPane config={previewConfig} />
        </div>
      </div>

      {/* Mobile preview below form */}
      <div className="mt-8 md:hidden">
        <PreviewPane config={previewConfig} />
      </div>

      <DeployInstructions open={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  );
}
