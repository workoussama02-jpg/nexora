// Color utility functions

interface RGB {
  r: number;
  g: number;
  b: number;
}

const FALLBACK_RGB: RGB = { r: 133, g: 79, b: 255 };

/**
 * Convert a hex color string to RGB components.
 * Handles 3-char shorthand (#f0a → #ff00aa), 6-char (#854fff), with or without #.
 * Returns fallback purple on invalid input.
 */
export function hexToRgb(hex: string): RGB {
  if (typeof hex !== 'string') return FALLBACK_RGB;

  let cleaned = hex.replace(/^#/, '');

  // Expand 3-char shorthand
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }

  if (cleaned.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return FALLBACK_RGB;
  }

  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}
