// Widget file generation logic — reads template + builds embed with full config
// License: The master template (chat-widget.js) is from https://github.com/juansebsol/n8n-chatbot-template (MIT License)
import { readFileSync } from 'fs';
import { join } from 'path';
import JSZip from 'jszip';
import type { GenerateWidgetPayload } from './types';

/**
 * Escape a user-provided string for safe insertion into a JS string literal.
 */
function escapeForJs(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * Slugify a widget name for the ZIP filename.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate customized widget files and package them into a ZIP.
 */
export async function generateWidgetZip(payload: GenerateWidgetPayload): Promise<Buffer> {
  // Read the master template
  const templatePath = join(process.cwd(), 'templates', 'chat-widget.js');
  const jsContent = readFileSync(templatePath, 'utf-8');

  const cfg = payload.config;

  // Build starter prompts array string
  const promptsStr = cfg.window.starterPrompts
    .map((p) => `'${escapeForJs(p)}'`)
    .join(', ');

  // Build the HTML embed snippet with full ChatWidgetConfig
  const htmlContent = `<!-- Nexora Chat Widget -->
<script>
    window.ChatWidgetConfig = {
        webhook: {
            url: '${escapeForJs(payload.webhookUrl)}',
            route: '${escapeForJs(payload.webhookRoute)}'
        },
        branding: {
            logo: '${escapeForJs(payload.logoUrl)}',
            name: '${escapeForJs(payload.companyName)}',
            welcomeText: '${escapeForJs(payload.welcomeText)}',
            responseTimeText: '${escapeForJs(payload.responseTimeText)}',
            poweredBy: {
                text: '${escapeForJs(payload.poweredByText)}',
                link: '${escapeForJs(payload.poweredByLink)}'
            }
        },
        style: {
            primaryColor: '${escapeForJs(payload.primaryColor)}',
            secondaryColor: '${escapeForJs(payload.secondaryColor)}',
            position: '${escapeForJs(payload.position)}',
            backgroundColor: '${escapeForJs(payload.backgroundColor)}',
            fontColor: '${escapeForJs(payload.fontColor)}'
        },
        bubble: {
            borderRadiusStyle: '${escapeForJs(cfg.bubble.borderRadiusStyle)}',
            backgroundColor: '${escapeForJs(cfg.bubble.backgroundColor)}',
            customIconUrl: '${escapeForJs(cfg.bubble.customIconUrl)}',
            customIconSize: ${cfg.bubble.customIconSize},
            customIconBorderRadius: ${cfg.bubble.customIconBorderRadius},
            internalIconsColor: '${escapeForJs(cfg.bubble.internalIconsColor)}',
            size: ${cfg.bubble.size},
            rightPosition: ${cfg.bubble.rightPosition},
            bottomPosition: ${cfg.bubble.bottomPosition},
            autoOpen: ${cfg.bubble.autoOpen},
            openDelay: ${cfg.bubble.openDelay}
        },
        tooltip: {
            display: ${cfg.tooltip.display},
            hideOnMobile: ${cfg.tooltip.hideOnMobile},
            message: '${escapeForJs(cfg.tooltip.message)}',
            backgroundColor: '${escapeForJs(cfg.tooltip.backgroundColor)}',
            textColor: '${escapeForJs(cfg.tooltip.textColor)}',
            fontSize: ${cfg.tooltip.fontSize}
        },
        window: {
            borderRadiusStyle: '${escapeForJs(cfg.window.borderRadiusStyle)}',
            height: ${cfg.window.height},
            width: ${cfg.window.width},
            backgroundColor: '${escapeForJs(cfg.window.backgroundColor)}',
            fontSize: ${cfg.window.fontSize},
            showScrollbar: ${cfg.window.showScrollbar},
            showTitle: ${cfg.window.showTitle},
            title: '${escapeForJs(cfg.window.title)}',
            titleAvatarUrl: '${escapeForJs(cfg.window.titleAvatarUrl)}',
            avatarSize: ${cfg.window.avatarSize},
            avatarBorderRadius: ${cfg.window.avatarBorderRadius},
            welcomeMessage: '${escapeForJs(cfg.window.welcomeMessage)}',
            customErrorMessage: '${escapeForJs(cfg.window.customErrorMessage)}',
            starterPrompts: [${promptsStr}],
            starterPromptFontSize: ${cfg.window.starterPromptFontSize},
            messageBorderRadius: ${cfg.window.messageBorderRadius},
            renderHtml: ${cfg.window.renderHtml},
            clearOnReload: ${cfg.window.clearOnReload}
        },
        botMessage: {
            backgroundColor: '${escapeForJs(cfg.botMessage.backgroundColor)}',
            textColor: '${escapeForJs(cfg.botMessage.textColor)}',
            showAvatar: ${cfg.botMessage.showAvatar},
            avatarUrl: '${escapeForJs(cfg.botMessage.avatarUrl)}',
            showCopyIcon: ${cfg.botMessage.showCopyIcon}
        },
        userMessage: {
            backgroundColor: '${escapeForJs(cfg.userMessage.backgroundColor)}',
            textColor: '${escapeForJs(cfg.userMessage.textColor)}',
            showAvatar: ${cfg.userMessage.showAvatar},
            avatarUrl: '${escapeForJs(cfg.userMessage.avatarUrl)}'
        },
        inputField: {
            borderRadius: ${cfg.inputField.borderRadius},
            placeholder: '${escapeForJs(cfg.inputField.placeholder)}',
            backgroundColor: '${escapeForJs(cfg.inputField.backgroundColor)}',
            textColor: '${escapeForJs(cfg.inputField.textColor)}',
            sendButtonColor: '${escapeForJs(cfg.inputField.sendButtonColor)}',
            sendButtonBorderRadius: ${cfg.inputField.sendButtonBorderRadius},
            maxCharacters: ${cfg.inputField.maxCharacters},
            maxCharsWarning: '${escapeForJs(cfg.inputField.maxCharsWarning)}',
            autoFocus: ${cfg.inputField.autoFocus}
        },
        footer: {
            mode: '${escapeForJs(cfg.footer.mode)}',
            text: '${escapeForJs(cfg.footer.text)}',
            companyName: '${escapeForJs(cfg.footer.companyName)}',
            companyLink: '${escapeForJs(cfg.footer.companyLink)}',
            textColor: '${escapeForJs(cfg.footer.textColor)}',
            customHtml: '${escapeForJs(cfg.footer.customHtml)}'
        },
        advanced: {
            customCss: '${escapeForJs(cfg.advanced.customCss)}'
        }
    };
</script>

<!-- Widget Script -->
<script src="YOUR_CHAT_WIDGET_JS_URL_HERE"></script>
`;

  // Package into ZIP
  const zip = new JSZip();
  zip.file('chat-widget.js', jsContent);
  zip.file('embed.html', htmlContent);

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  return buffer;
}
