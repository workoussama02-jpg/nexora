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

  // Build social links array string
  const socialLinksStr = cfg.window.socialLinks
    .map((l) => `{ platform: '${escapeForJs(l.platform)}', url: '${escapeForJs(l.url)}' }`)
    .join(', ');

  // Build available languages array string
  const availableLangsStr = cfg.advanced.availableLanguages
    .map((l) => `'${escapeForJs(l)}'`)
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
            openDelay: ${cfg.bubble.openDelay},
            animation: '${escapeForJs(cfg.bubble.animation)}',
            animationSpeed: '${escapeForJs(cfg.bubble.animationSpeed)}',
            animateOnlyOnLoad: ${cfg.bubble.animateOnlyOnLoad}
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
            clearOnReload: ${cfg.window.clearOnReload},
            showBackToWelcome: ${cfg.window.showBackToWelcome},
            showRefreshButton: ${cfg.window.showRefreshButton},
            showSendButton: ${cfg.window.showSendButton},
            sendButtonIcon: '${escapeForJs(cfg.window.sendButtonIcon)}',
            showTimestamps: ${cfg.window.showTimestamps},
            timestampFormat: '${escapeForJs(cfg.window.timestampFormat)}',
            timestampColor: '${escapeForJs(cfg.window.timestampColor)}',
            timestampFontSize: ${cfg.window.timestampFontSize},
            showSocialIcons: ${cfg.window.showSocialIcons},
            socialLinks: [${socialLinksStr}],
            socialIconSize: ${cfg.window.socialIconSize},
            socialIconColor: '${escapeForJs(cfg.window.socialIconColor)}',
            shadowEnabled: ${cfg.window.shadowEnabled},
            shadowColor1: '${escapeForJs(cfg.window.shadowColor1)}',
            shadowColor2: '${escapeForJs(cfg.window.shadowColor2)}',
            shadowBlur: ${cfg.window.shadowBlur},
            shadowSpread: ${cfg.window.shadowSpread},
            shadowAnimate: ${cfg.window.shadowAnimate},
            shadowAnimationSpeed: ${cfg.window.shadowAnimationSpeed}
        },
        botMessage: {
            backgroundColor: '${escapeForJs(cfg.botMessage.backgroundColor)}',
            textColor: '${escapeForJs(cfg.botMessage.textColor)}',
            showAvatar: ${cfg.botMessage.showAvatar},
            avatarUrl: '${escapeForJs(cfg.botMessage.avatarUrl)}',
            showCopyIcon: ${cfg.botMessage.showCopyIcon},
            showTypingIndicator: ${cfg.botMessage.showTypingIndicator},
            typingIndicatorColor: '${escapeForJs(cfg.botMessage.typingIndicatorColor)}'
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
            autoFocus: ${cfg.inputField.autoFocus},
            showEmojiPicker: ${cfg.inputField.showEmojiPicker}
        },
        footer: {
            mode: '${escapeForJs(cfg.footer.mode)}',
            text: '${escapeForJs(cfg.footer.text)}',
            companyName: '${escapeForJs(cfg.footer.companyName)}',
            companyLink: '${escapeForJs(cfg.footer.companyLink)}',
            textColor: '${escapeForJs(cfg.footer.textColor)}',
            customHtml: '${escapeForJs(cfg.footer.customHtml)}',
            showLogo: ${cfg.footer.showLogo},
            logoSource: '${escapeForJs(cfg.footer.logoSource)}',
            customLogoUrl: '${escapeForJs(cfg.footer.customLogoUrl)}',
            logoPosition: '${escapeForJs(cfg.footer.logoPosition)}',
            logoSize: ${cfg.footer.logoSize}
        },
        advanced: {
            customCss: '${escapeForJs(cfg.advanced.customCss)}',
            enableLanguageSelector: ${cfg.advanced.enableLanguageSelector},
            availableLanguages: [${availableLangsStr}],
            defaultLanguage: '${escapeForJs(cfg.advanced.defaultLanguage)}',
            enableCustomCursor: ${cfg.advanced.enableCustomCursor},
            cursorType: '${escapeForJs(cfg.advanced.cursorType)}',
            presetCursor: '${escapeForJs(cfg.advanced.presetCursor)}',
            customCursorUrl: '${escapeForJs(cfg.advanced.customCursorUrl)}',
            enableColorTransitions: ${cfg.advanced.enableColorTransitions},
            colorTransitions: {
                headerTransition: ${cfg.advanced.colorTransitions.headerTransition},
                headerColor1: '${escapeForJs(cfg.advanced.colorTransitions.headerColor1)}',
                headerColor2: '${escapeForJs(cfg.advanced.colorTransitions.headerColor2)}',
                toggleTransition: ${cfg.advanced.colorTransitions.toggleTransition},
                toggleColor1: '${escapeForJs(cfg.advanced.colorTransitions.toggleColor1)}',
                toggleColor2: '${escapeForJs(cfg.advanced.colorTransitions.toggleColor2)}',
                userMessageTransition: ${cfg.advanced.colorTransitions.userMessageTransition},
                userMessageColor1: '${escapeForJs(cfg.advanced.colorTransitions.userMessageColor1)}',
                userMessageColor2: '${escapeForJs(cfg.advanced.colorTransitions.userMessageColor2)}',
                botMessageTransition: ${cfg.advanced.colorTransitions.botMessageTransition},
                botMessageColor1: '${escapeForJs(cfg.advanced.colorTransitions.botMessageColor1)}',
                botMessageColor2: '${escapeForJs(cfg.advanced.colorTransitions.botMessageColor2)}',
                transitionSpeed: ${cfg.advanced.colorTransitions.transitionSpeed}
            },
            enableFallingEffect: ${cfg.advanced.enableFallingEffect},
            fallingEffect: {
                effectSource: '${escapeForJs(cfg.advanced.fallingEffect.effectSource)}',
                customImageUrl: '${escapeForJs(cfg.advanced.fallingEffect.customImageUrl)}',
                emoji: '${escapeForJs(cfg.advanced.fallingEffect.emoji)}',
                particleCount: ${cfg.advanced.fallingEffect.particleCount},
                fallSpeed: '${escapeForJs(cfg.advanced.fallingEffect.fallSpeed)}',
                particleSize: ${cfg.advanced.fallingEffect.particleSize},
                showOnDesktop: ${cfg.advanced.fallingEffect.showOnDesktop},
                showOnMobile: ${cfg.advanced.fallingEffect.showOnMobile}
            }
        },
        welcomePage: {
            welcomeButtonText: '${escapeForJs(cfg.welcomePage.welcomeButtonText)}',
            showWelcomeLogo: ${cfg.welcomePage.showWelcomeLogo},
            welcomeLogoSource: '${escapeForJs(cfg.welcomePage.welcomeLogoSource)}',
            welcomeCustomLogoUrl: '${escapeForJs(cfg.welcomePage.welcomeCustomLogoUrl)}',
            welcomeLogoPosition: '${escapeForJs(cfg.welcomePage.welcomeLogoPosition)}',
            welcomeLogoSize: ${cfg.welcomePage.welcomeLogoSize},
            welcomeLogoAnimation: '${escapeForJs(cfg.welcomePage.welcomeLogoAnimation)}',
            welcomeButtonAnimation: '${escapeForJs(cfg.welcomePage.welcomeButtonAnimation)}',
            welcomeBackgroundColor: '${escapeForJs(cfg.welcomePage.welcomeBackgroundColor)}'
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
