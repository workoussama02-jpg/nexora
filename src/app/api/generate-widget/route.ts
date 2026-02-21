// File generation API route — validates input, generates widget ZIP, streams response
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@insforge/nextjs/server';
import { generateWidgetZip, slugify } from '@/lib/widget-generator';
import { DEFAULT_ADVANCED_CONFIG } from '@/lib/constants';
import type { GenerateWidgetPayload, WidgetAdvancedConfig } from '@/lib/types';

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;
const URL_REGEX = /^https?:\/\/.+/;

function validatePayload(body: Record<string, unknown>): string | null {
  if (!body.webhookUrl || typeof body.webhookUrl !== 'string' || !URL_REGEX.test(body.webhookUrl)) {
    return 'Invalid configuration: webhookUrl must be a valid URL starting with http:// or https://';
  }
  if (!body.companyName || typeof body.companyName !== 'string' || !body.companyName.trim()) {
    return 'Invalid configuration: companyName is required';
  }
  if (!body.welcomeText || typeof body.welcomeText !== 'string' || !body.welcomeText.trim()) {
    return 'Invalid configuration: welcomeText is required';
  }
  for (const field of ['primaryColor', 'secondaryColor', 'backgroundColor', 'fontColor'] as const) {
    if (!body[field] || typeof body[field] !== 'string' || !HEX_REGEX.test(body[field] as string)) {
      return `Invalid configuration: ${field} must be a valid 7-character hex code (e.g. #854fff)`;
    }
  }
  if (body.position !== 'left' && body.position !== 'right') {
    return 'Invalid configuration: position must be "left" or "right"';
  }
  if (!body.widgetName || typeof body.widgetName !== 'string' || !body.widgetName.trim()) {
    return 'Invalid configuration: widgetName is required';
  }
  return null;
}

/** Merge partial config from request with defaults */
function resolveConfig(raw: unknown): WidgetAdvancedConfig {
  const d = DEFAULT_ADVANCED_CONFIG;
  if (!raw || typeof raw !== 'object') return { ...d };
  const c = raw as Partial<WidgetAdvancedConfig>;
  return {
    bubble: { ...d.bubble, ...c.bubble },
    tooltip: { ...d.tooltip, ...c.tooltip },
    window: { ...d.window, ...c.window, starterPrompts: (c.window as WidgetAdvancedConfig['window'])?.starterPrompts ?? d.window.starterPrompts },
    botMessage: { ...d.botMessage, ...c.botMessage },
    userMessage: { ...d.userMessage, ...c.userMessage },
    inputField: { ...d.inputField, ...c.inputField },
    footer: { ...d.footer, ...c.footer },
    advanced: { ...d.advanced, ...c.advanced },
  };
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const resolvedConfig = resolveConfig(body.config);

    const config: GenerateWidgetPayload = {
      webhookUrl: body.webhookUrl,
      webhookRoute: body.webhookRoute || 'general',
      logoUrl: body.logoUrl || '',
      companyName: body.companyName,
      welcomeText: body.welcomeText,
      responseTimeText: body.responseTimeText || '',
      poweredByText: body.poweredByText || 'Powered by Nexora',
      poweredByLink: body.poweredByLink || '',
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      backgroundColor: body.backgroundColor,
      fontColor: body.fontColor,
      position: body.position,
      widgetName: body.widgetName,
      config: resolvedConfig,
    };

    const zipBuffer = await generateWidgetZip(config);
    const filename = `chat-widget-${slugify(config.widgetName)}.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Widget generation error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
