// Type definitions for widget configuration and database rows

// --- Advanced config sub-types ---

export type BubbleBorderRadius = 'circle' | 'rounded' | 'none';
export type BubbleAnimation = 'none' | 'bounce' | 'float' | 'pulse' | 'shake' | 'wiggle';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface BubbleConfig {
  borderRadiusStyle: BubbleBorderRadius;
  backgroundColor: string;
  customIconUrl: string;
  customIconSize: number;
  customIconBorderRadius: number;
  internalIconsColor: string;
  size: number;
  rightPosition: number;
  bottomPosition: number;
  autoOpen: boolean;
  openDelay: number;
  animation: BubbleAnimation;
  animationSpeed: AnimationSpeed;
  animateOnlyOnLoad: boolean;
}

export interface TooltipConfig {
  display: boolean;
  hideOnMobile: boolean;
  message: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export type WindowBorderRadius = 'rounded' | 'none';
export type TimestampFormat = '12-hour' | '24-hour' | 'relative' | 'full';
export type SendButtonIcon = 'arrow-up' | 'paper-plane' | 'send';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface WindowConfig {
  borderRadiusStyle: WindowBorderRadius;
  height: number;
  width: number;
  backgroundColor: string;
  fontSize: number;
  showScrollbar: boolean;
  showTitle: boolean;
  title: string;
  titleAvatarUrl: string;
  avatarSize: number;
  avatarBorderRadius: number;
  welcomeMessage: string;
  customErrorMessage: string;
  starterPrompts: string[];
  starterPromptFontSize: number;
  messageBorderRadius: number;
  renderHtml: boolean;
  clearOnReload: boolean;
  showBackToWelcome: boolean;
  showRefreshButton: boolean;
  showSendButton: boolean;
  sendButtonIcon: SendButtonIcon;
  showTimestamps: boolean;
  timestampFormat: TimestampFormat;
  timestampColor: string;
  timestampFontSize: number;
  showSocialIcons: boolean;
  socialLinks: SocialLink[];
  socialIconSize: number;
  socialIconColor: string;
  shadowEnabled: boolean;
  shadowColor1: string;
  shadowColor2: string;
  shadowBlur: number;
  shadowSpread: number;
  shadowAnimate: boolean;
  shadowAnimationSpeed: number;
}

export interface BotMessageConfig {
  backgroundColor: string;
  textColor: string;
  showAvatar: boolean;
  avatarUrl: string;
  showCopyIcon: boolean;
  showTypingIndicator: boolean;
  typingIndicatorColor: string;
}

export interface UserMessageConfig {
  backgroundColor: string;
  textColor: string;
  showAvatar: boolean;
  avatarUrl: string;
}

export interface InputFieldConfig {
  borderRadius: number;
  placeholder: string;
  backgroundColor: string;
  textColor: string;
  sendButtonColor: string;
  sendButtonBorderRadius: number;
  maxCharacters: number;
  maxCharsWarning: string;
  autoFocus: boolean;
  showEmojiPicker: boolean;
}

export type FooterMode = 'content' | 'html';
export type FooterLogoPosition = 'left' | 'right' | 'both';

export interface FooterConfig {
  mode: FooterMode;
  text: string;
  companyName: string;
  companyLink: string;
  textColor: string;
  customHtml: string;
  showLogo: boolean;
  logoSource: 'brand' | 'custom';
  customLogoUrl: string;
  logoPosition: FooterLogoPosition;
  logoSize: number;
}

export type WelcomeLogoPosition = 'top-center' | 'top-left' | 'top-right' | 'above-text' | 'below-text';
export type WelcomeAnimation = 'none' | 'bounce' | 'float' | 'pulse' | 'spin' | 'glow';

export interface WelcomePageConfig {
  welcomeButtonText: string;
  showWelcomeLogo: boolean;
  welcomeLogoSource: 'brand' | 'custom';
  welcomeCustomLogoUrl: string;
  welcomeLogoPosition: WelcomeLogoPosition;
  welcomeLogoSize: number;
  welcomeLogoAnimation: WelcomeAnimation;
  welcomeButtonAnimation: WelcomeAnimation;
  welcomeBackgroundColor: string;
}

export interface ColorTransitionConfig {
  headerTransition: boolean;
  headerColor1: string;
  headerColor2: string;
  toggleTransition: boolean;
  toggleColor1: string;
  toggleColor2: string;
  userMessageTransition: boolean;
  userMessageColor1: string;
  userMessageColor2: string;
  botMessageTransition: boolean;
  botMessageColor1: string;
  botMessageColor2: string;
  transitionSpeed: number;
}

export interface FallingEffectConfig {
  effectSource: 'brand' | 'custom' | 'emoji';
  customImageUrl: string;
  emoji: string;
  particleCount: number;
  fallSpeed: 'slow' | 'medium' | 'fast';
  particleSize: number;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

export interface AdvancedConfig {
  customCss: string;
  enableLanguageSelector: boolean;
  availableLanguages: string[];
  defaultLanguage: string;
  enableCustomCursor: boolean;
  cursorType: 'preset' | 'custom';
  presetCursor: string;
  customCursorUrl: string;
  enableColorTransitions: boolean;
  colorTransitions: ColorTransitionConfig;
  enableFallingEffect: boolean;
  fallingEffect: FallingEffectConfig;
}

/** Full advanced config stored in the JSONB `config` column */
export interface WidgetAdvancedConfig {
  bubble: BubbleConfig;
  tooltip: TooltipConfig;
  window: WindowConfig;
  botMessage: BotMessageConfig;
  userMessage: UserMessageConfig;
  inputField: InputFieldConfig;
  footer: FooterConfig;
  advanced: AdvancedConfig;
  welcomePage: WelcomePageConfig;
}

// --- Base types ---

export interface WidgetConfig {
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

export interface WidgetRow {
  id: string;
  user_id: string;
  name: string;
  webhook_url: string;
  webhook_route: string;
  logo_url: string | null;
  company_name: string;
  welcome_text: string;
  response_time_text: string | null;
  powered_by_text: string;
  powered_by_link: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  font_color: string;
  position: 'left' | 'right';
  config: Partial<WidgetAdvancedConfig>;
  created_at: string;
  updated_at: string;
}

export interface CreateWidgetPayload {
  name: string;
  webhook_url: string;
  webhook_route: string;
  logo_url?: string | null;
  company_name: string;
  welcome_text: string;
  response_time_text?: string | null;
  powered_by_text: string;
  powered_by_link: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  font_color: string;
  position: 'left' | 'right';
  config: WidgetAdvancedConfig;
  user_id: string;
}

export interface UpdateWidgetPayload {
  name?: string;
  webhook_url?: string;
  webhook_route?: string;
  logo_url?: string | null;
  company_name?: string;
  welcome_text?: string;
  response_time_text?: string | null;
  powered_by_text?: string;
  powered_by_link?: string;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  font_color?: string;
  position?: 'left' | 'right';
  config?: WidgetAdvancedConfig;
}

export interface GenerateWidgetPayload {
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
  widgetName: string;
  config: WidgetAdvancedConfig;
}

export interface ApiErrorResponse {
  error: string;
}
