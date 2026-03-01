// Full customizer form — manages all form state, validation, save, download
// Tabbed interface: Bubble | Tooltip | Window | Footer | Advanced
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@insforge/nextjs';
import { createWidget, updateWidget } from '@/lib/widgets';
import { DEFAULT_WIDGET_CONFIG, DEFAULT_ADVANCED_CONFIG } from '@/lib/constants';
import { validateWidgetForm, validateAdvancedConfig } from '@/lib/validators';
import type { WidgetRow, WidgetAdvancedConfig, BubbleConfig, TooltipConfig, WindowConfig, BotMessageConfig, UserMessageConfig, InputFieldConfig, FooterConfig, AdvancedConfig, WelcomePageConfig } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import PreviewPane from './PreviewPane';
import DeployInstructions from './DeployInstructions';
import WidgetSettingsTab from './tabs/WidgetSettingsTab';
import BubbleTab from './tabs/BubbleTab';
import TooltipTab from './tabs/TooltipTab';
import WindowTab from './tabs/WindowTab';
import FooterTab from './tabs/FooterTab';
import AdvancedTab from './tabs/AdvancedTab';
import WelcomePageTab from './tabs/WelcomePageTab';
import { Upload, Download, Eye, EyeOff, X } from 'lucide-react';

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

const TABS = ['Settings', 'Bubble', 'Tooltip', 'Window', 'Welcome Page', 'Footer', 'Advanced'] as const;
type TabName = typeof TABS[number];

/** Deep merge saved partial config with full defaults */
function mergeConfig(saved: Partial<WidgetAdvancedConfig> | undefined): WidgetAdvancedConfig {
  const d = DEFAULT_ADVANCED_CONFIG;
  if (!saved) return { ...d };
  return {
    bubble: { ...d.bubble, ...saved.bubble },
    tooltip: { ...d.tooltip, ...saved.tooltip },
    window: { ...d.window, ...saved.window, starterPrompts: saved.window?.starterPrompts ?? d.window.starterPrompts, socialLinks: saved.window?.socialLinks ?? d.window.socialLinks },
    botMessage: { ...d.botMessage, ...saved.botMessage },
    userMessage: { ...d.userMessage, ...saved.userMessage },
    inputField: { ...d.inputField, ...saved.inputField },
    footer: { ...d.footer, ...saved.footer },
    advanced: { ...d.advanced, ...saved.advanced, colorTransitions: { ...d.advanced.colorTransitions, ...saved.advanced?.colorTransitions }, fallingEffect: { ...d.advanced.fallingEffect, ...saved.advanced?.fallingEffect } },
    welcomePage: { ...d.welcomePage, ...saved.welcomePage, languageButtons: saved.welcomePage?.languageButtons ?? d.welcomePage.languageButtons },
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
  const [activeTab, setActiveTab] = useState<TabName>('Settings');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isDirtyRef = useRef(false);
  const savedRef = useRef(!!widget);
  const importInputRef = useRef<HTMLInputElement>(null);

  /** Export current form + config as JSON */
  function handleExportJson() {
    const payload = { form, config };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-widget-${(form.name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Config exported as JSON.', 'success');
  }

  /** Import form + config from a JSON file */
  function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed.form || !parsed.config) {
          showToast('Invalid config file — missing form or config.', 'error');
          return;
        }
        setForm({ ...INITIAL_FORM, ...parsed.form });
        setConfig(mergeConfig(parsed.config));
        isDirtyRef.current = true;
        showToast('Config imported! Review and save.', 'success');
      } catch {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  }

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

  const updateWelcomePage = useCallback(<K extends keyof WelcomePageConfig>(key: K, value: WelcomePageConfig[K]) => {
    setConfig((prev) => ({ ...prev, welcomePage: { ...prev.welcomePage, [key]: value } }));
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
      <div className="max-w-2xl">
        {/* Tabbed customization sections */}
        <div>
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 dark:border-white/10 mb-6 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[200px]">
            {activeTab === 'Settings' && (
              <WidgetSettingsTab
                name={form.name}
                webhookUrl={form.webhookUrl}
                webhookRoute={form.webhookRoute}
                logoUrl={form.logoUrl}
                companyName={form.companyName}
                welcomeText={form.welcomeText}
                responseTimeText={form.responseTimeText}
                errors={errors}
                onFieldChange={(field, value) => updateField(field as keyof FormState, value as never)}
              />
            )}
            {activeTab === 'Bubble' && (
              <BubbleTab
                config={config.bubble}
                position={form.position}
                onChange={updateBubble}
                onPositionChange={(v) => updateField('position', v)}
              />
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
            {activeTab === 'Welcome Page' && (
              <WelcomePageTab
                config={config.welcomePage}
                onChange={updateWelcomePage}
                welcomeText={form.welcomeText}
                welcomeTextError={errors.welcomeText}
                onWelcomeTextChange={(v) => updateField('welcomeText', v)}
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
        <div className="flex flex-wrap items-center gap-3 pb-8 mt-8">
          <Button variant="secondary" onClick={handleSave} loading={saving} disabled={downloading}>
            Save Widget
          </Button>
          <Button onClick={handleDownload} loading={downloading} disabled={saving}>
            Download Files
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              title={showPreview ? 'Hide preview' : 'Show preview'}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-white/10"
            >
              {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPreview ? 'Hide' : 'Preview'}
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              title="Export config as JSON"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              title="Import config from JSON"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-white/10"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </button>
            <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJson} />
          </div>
        </div>
      </div>

      {/* Live Preview Side Panel */}
      {showPreview && (
        <div className="fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-[420px] border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f1a] shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shrink-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</span>
            <button
              onClick={() => setShowPreview(false)}
              className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <PreviewPane config={previewConfig} />
          </div>
        </div>
      )}

      <DeployInstructions open={showInstructions} onClose={() => setShowInstructions(false)} />
    </>
  );
}
