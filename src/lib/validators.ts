// Form and API input validation functions
import type { WidgetAdvancedConfig } from './types';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateUrl(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return `Enter a valid ${fieldName} starting with http:// or https://`;
  }
  return null;
}

export function validateOptionalUrl(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) return null;
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return `Enter a valid ${fieldName} starting with http:// or https://`;
  }
  return null;
}

export function validateHexColor(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  if (!HEX_COLOR_REGEX.test(value)) {
    return `Enter a valid hex color (e.g., #854fff)`;
  }
  return null;
}

export function validatePosition(value: string): string | null {
  if (value !== 'left' && value !== 'right') {
    return 'Position must be "left" or "right"';
  }
  return null;
}

export function validateMaxLength(value: string, max: number, fieldName: string): string | null {
  if (value && value.length > max) {
    return `${fieldName} must be ${max} characters or less`;
  }
  return null;
}

export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateWidgetForm(data: {
  name: string;
  webhookUrl: string;
  companyName: string;
  welcomeText: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontColor: string;
  position: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameErr = validateRequired(data.name, 'Widget name') || validateMaxLength(data.name, 100, 'Widget name');
  if (nameErr) errors.name = nameErr;

  const urlErr = validateUrl(data.webhookUrl, 'Webhook URL');
  if (urlErr) errors.webhookUrl = urlErr;

  const companyErr = validateRequired(data.companyName, 'Company name') || validateMaxLength(data.companyName, 50, 'Company name');
  if (companyErr) errors.companyName = companyErr;

  const welcomeErr = validateRequired(data.welcomeText, 'Welcome text') || validateMaxLength(data.welcomeText, 200, 'Welcome text');
  if (welcomeErr) errors.welcomeText = welcomeErr;

  const primaryErr = validateHexColor(data.primaryColor, 'Primary color');
  if (primaryErr) errors.primaryColor = primaryErr;

  const secondaryErr = validateHexColor(data.secondaryColor, 'Secondary color');
  if (secondaryErr) errors.secondaryColor = secondaryErr;

  const bgErr = validateHexColor(data.backgroundColor, 'Background color');
  if (bgErr) errors.backgroundColor = bgErr;

  const fontErr = validateHexColor(data.fontColor, 'Font color');
  if (fontErr) errors.fontColor = fontErr;

  const posErr = validatePosition(data.position);
  if (posErr) errors.position = posErr;

  return errors;
}

/** Validate all advanced config color fields and ranges */
export function validateAdvancedConfig(cfg: WidgetAdvancedConfig): ValidationErrors {
  const errors: ValidationErrors = {};

  // Bubble colors
  const bubbleBg = validateHexColor(cfg.bubble.backgroundColor, 'Bubble background');
  if (bubbleBg) errors['bubble.backgroundColor'] = bubbleBg;
  const bubbleIcons = validateHexColor(cfg.bubble.internalIconsColor, 'Internal icons color');
  if (bubbleIcons) errors['bubble.internalIconsColor'] = bubbleIcons;

  // Tooltip colors
  const tooltipBg = validateHexColor(cfg.tooltip.backgroundColor, 'Tooltip background');
  if (tooltipBg) errors['tooltip.backgroundColor'] = tooltipBg;
  const tooltipText = validateHexColor(cfg.tooltip.textColor, 'Tooltip text color');
  if (tooltipText) errors['tooltip.textColor'] = tooltipText;

  // Window colors
  const winBg = validateHexColor(cfg.window.backgroundColor, 'Window background');
  if (winBg) errors['window.backgroundColor'] = winBg;

  // Bot message colors
  const botBg = validateHexColor(cfg.botMessage.backgroundColor, 'Bot message background');
  if (botBg) errors['botMessage.backgroundColor'] = botBg;
  const botText = validateHexColor(cfg.botMessage.textColor, 'Bot message text');
  if (botText) errors['botMessage.textColor'] = botText;

  // User message colors
  const userBg = validateHexColor(cfg.userMessage.backgroundColor, 'User message background');
  if (userBg) errors['userMessage.backgroundColor'] = userBg;
  const userText = validateHexColor(cfg.userMessage.textColor, 'User message text');
  if (userText) errors['userMessage.textColor'] = userText;

  // Input field colors
  const inputBg = validateHexColor(cfg.inputField.backgroundColor, 'Input background');
  if (inputBg) errors['inputField.backgroundColor'] = inputBg;
  const inputText = validateHexColor(cfg.inputField.textColor, 'Input text color');
  if (inputText) errors['inputField.textColor'] = inputText;
  const sendBtn = validateHexColor(cfg.inputField.sendButtonColor, 'Send button color');
  if (sendBtn) errors['inputField.sendButtonColor'] = sendBtn;

  // Footer color
  const footerText = validateHexColor(cfg.footer.textColor, 'Footer text color');
  if (footerText) errors['footer.textColor'] = footerText;

  // Range validations
  const tooltipFont = validateRange(cfg.tooltip.fontSize, 10, 24, 'Tooltip font size');
  if (tooltipFont) errors['tooltip.fontSize'] = tooltipFont;
  const winH = validateRange(cfg.window.height, 300, 800, 'Window height');
  if (winH) errors['window.height'] = winH;
  const winW = validateRange(cfg.window.width, 300, 600, 'Window width');
  if (winW) errors['window.width'] = winW;
  const winFont = validateRange(cfg.window.fontSize, 12, 24, 'Window font size');
  if (winFont) errors['window.fontSize'] = winFont;

  // Tooltip message length
  const tooltipMsg = validateMaxLength(cfg.tooltip.message, 100, 'Tooltip message');
  if (tooltipMsg) errors['tooltip.message'] = tooltipMsg;

  // Starter prompts max 5
  if (cfg.window.starterPrompts.length > 5) {
    errors['window.starterPrompts'] = 'Maximum 5 starter prompts';
  }

  return errors;
}
