// Shared constants and default values
import type { WidgetAdvancedConfig } from './types';

export const MAX_FREE_WIDGETS = 1;

export const DEFAULT_WIDGET_CONFIG = {
  webhookRoute: 'general',
  poweredByText: 'Powered by Nexora',
  poweredByLink: process.env.NEXT_PUBLIC_APP_URL || 'https://nexora.app',
  primaryColor: '#854fff',
  secondaryColor: '#6b3fd4',
  backgroundColor: '#ffffff',
  fontColor: '#333333',
  position: 'right' as const,
};

export const APP_NAME = 'Nexora';

export const DEFAULT_ADVANCED_CONFIG: WidgetAdvancedConfig = {
  bubble: {
    borderRadiusStyle: 'circle',
    backgroundColor: '#854fff',
    customIconUrl: '',
    customIconSize: 60,
    customIconBorderRadius: 15,
    internalIconsColor: '#373434',
    size: 50,
    rightPosition: 20,
    bottomPosition: 20,
    autoOpen: false,
    openDelay: 0,
  },
  tooltip: {
    display: true,
    hideOnMobile: true,
    message: 'Hello 👋 How can I help you?',
    backgroundColor: '#fffff0',
    textColor: '#1c1c1c',
    fontSize: 15,
  },
  window: {
    borderRadiusStyle: 'rounded',
    height: 600,
    width: 400,
    backgroundColor: '#f7f8fa',
    fontSize: 16,
    showScrollbar: true,
    showTitle: true,
    title: '',
    titleAvatarUrl: '',
    avatarSize: 40,
    avatarBorderRadius: 25,
    welcomeMessage: '',
    customErrorMessage: 'Something went wrong. Please try again.',
    starterPrompts: [],
    starterPromptFontSize: 13,
    messageBorderRadius: 8,
    renderHtml: false,
    clearOnReload: true,
  },
  botMessage: {
    backgroundColor: '#f86839',
    textColor: '#fefefe',
    showAvatar: true,
    avatarUrl: '',
    showCopyIcon: false,
  },
  userMessage: {
    backgroundColor: '#eeeeee',
    textColor: '#603005',
    showAvatar: true,
    avatarUrl: '',
  },
  inputField: {
    borderRadius: 5,
    placeholder: 'Type a message...',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    sendButtonColor: '#854fff',
    sendButtonBorderRadius: 30,
    maxCharacters: 0,
    maxCharsWarning: 'You exceeded the character limit.',
    autoFocus: false,
  },
  footer: {
    mode: 'content',
    text: 'Powered by',
    companyName: '',
    companyLink: '',
    textColor: '#303235',
    customHtml: '',
  },
  advanced: {
    customCss: '',
  },
};
