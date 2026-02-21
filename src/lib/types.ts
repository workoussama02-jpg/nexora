// Type definitions for widget configuration and database rows

// --- Advanced config sub-types ---

export type BubbleBorderRadius = 'circle' | 'rounded' | 'none';

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
}

export interface BotMessageConfig {
  backgroundColor: string;
  textColor: string;
  showAvatar: boolean;
  avatarUrl: string;
  showCopyIcon: boolean;
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
}

export type FooterMode = 'content' | 'html';

export interface FooterConfig {
  mode: FooterMode;
  text: string;
  companyName: string;
  companyLink: string;
  textColor: string;
  customHtml: string;
}

export interface AdvancedConfig {
  customCss: string;
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
