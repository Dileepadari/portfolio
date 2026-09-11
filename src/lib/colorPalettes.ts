/**
 * The accent palettes a visitor can pick between, and how one is applied.
 *
 * Each palette carries a light and a dark variant of the same three tokens,
 * so switching accent never has to know which theme is active. Applying a
 * palette writes CSS custom properties on the document root, which is what the
 * Tailwind theme reads, so nothing re-renders to change colour.
 *
 * @module theming
 */

export interface ColorPalette {
  name: string;
  light: { primary: string; accent: string; background: string; border?: string };
  dark: { primary: string; accent: string; background: string; border?: string };
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: "Common",
    light: { primary: "#2563eb", accent: "#22c55e", background: "#fdfdfdff", border: "#d1d5db" },
    dark: { primary: "#2563eb", accent: "#22c55e", background: "#1a1a1bff", border: "#4b5563" },
  },
  {
    name: "Monokai",
    light: { primary: "#f92672", accent: "#a6e22e", background: "#fffaf3", border: "#d1d5db" },
    dark: { primary: "#f92672", accent: "#a6e22e", background: "#18181b", border: "#4b5563" },
  },
  {
    name: "Original (GitHub)",
    light: { primary: "#24292f", accent: "#e36209", background: "#f8f9fb", border: "#d1d5db" },
    dark: { primary: "#cfd9e6ff", accent: "#e36209", background: "#0d1117", border: "#4b5563" },
  },
  {
    name: "Material Design",
    light: { primary: "#6200ea", accent: "#03dac6", background: "#f7f7fa", border: "#d1d5db" },
    dark: { primary: "#bb86fc", accent: "#03dac6", background: "#0a0a0a", border: "#4b5563" },
  },
  {
    name: "Original",
    light: { primary: "#3b82f6", accent: "#f59e42", background: "#f7f7fa", border: "#d1d5db" },
    dark: { primary: "#2563eb", accent: "#f59e42", background: "#18181b", border: "#4b5563" },
  },
];

function hexToHSL(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Applies the palette's colors as inline styles on <html> for whichever
 * theme is actually resolved right now. Takes resolvedTheme explicitly
 * rather than probing the DOM for a `.dark` element - in this app `.dark`
 * and `:root` are the same element (the class toggles on <html> itself), so
 * querying for `.dark` to decide "is dark active" is a race against
 * ThemeProvider's own effect that adds the class, and inline styles set
 * before that class lands will outrank the `.dark` CSS rule forever after.
 */
export function applyColorPalette(palette: ColorPalette, resolvedTheme: 'light' | 'dark'): void {
  const variant = palette[resolvedTheme];
  const root = document.documentElement;
  root.style.setProperty('--primary', hexToHSL(variant.primary));
  root.style.setProperty('--accent', hexToHSL(variant.accent));
  root.style.setProperty('--background', hexToHSL(variant.background));
  root.style.setProperty('--border', hexToHSL(variant.border || (resolvedTheme === 'dark' ? '#4b5563' : '#d1d5db')));
}
