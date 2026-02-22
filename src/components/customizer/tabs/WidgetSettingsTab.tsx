// Widget Settings tab — General, Webhook, and Branding sub-sections
'use client';

import { Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import CollapsibleSection from '../CollapsibleSection';

interface WidgetSettingsTabProps {
  name: string;
  webhookUrl: string;
  webhookRoute: string;
  logoUrl: string;
  companyName: string;
  welcomeText: string;
  responseTimeText: string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

export default function WidgetSettingsTab({
  name,
  webhookUrl,
  webhookRoute,
  logoUrl,
  companyName,
  welcomeText,
  responseTimeText,
  errors,
  onFieldChange,
}: WidgetSettingsTabProps) {
  return (
    <div className="space-y-4">
      <CollapsibleSection title="General">
        <Input
          label="Widget Name"
          placeholder="e.g., Support Bot"
          value={name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          error={errors.name}
          maxLength={100}
          helperText="Internal label — not shown in the widget."
          required
        />
      </CollapsibleSection>

      <CollapsibleSection title="Webhook">
        <Input
          label="Webhook URL"
          placeholder="https://your-n8n-instance.com/webhook/..."
          value={webhookUrl}
          onChange={(e) => onFieldChange('webhookUrl', e.target.value)}
          error={errors.webhookUrl}
          required
        />
        <Input
          label="Route"
          placeholder="general"
          value={webhookRoute}
          onChange={(e) => onFieldChange('webhookRoute', e.target.value)}
          helperText='Defaults to "general" if left empty.'
        />
      </CollapsibleSection>

      <CollapsibleSection title="Branding">
        <Input
          label="Logo URL"
          placeholder="https://example.com/logo.png"
          value={logoUrl}
          onChange={(e) => onFieldChange('logoUrl', e.target.value)}
          helperText="Paste a URL to your logo image (hosted on Imgur, your website, etc.)."
        />
        <Input
          label="Company / Bot Name"
          placeholder="e.g., Acme Support"
          value={companyName}
          onChange={(e) => onFieldChange('companyName', e.target.value)}
          error={errors.companyName}
          maxLength={50}
          required
        />
        <Input
          label="Welcome Text"
          placeholder="e.g., Hi there! 👋 How can we help?"
          value={welcomeText}
          onChange={(e) => onFieldChange('welcomeText', e.target.value)}
          error={errors.welcomeText}
          maxLength={200}
          required
        />
        <Input
          label="Response Time Text"
          placeholder="e.g., We usually respond in a few minutes"
          value={responseTimeText}
          onChange={(e) => onFieldChange('responseTimeText', e.target.value)}
          maxLength={100}
        />
      </CollapsibleSection>
    </div>
  );
}
