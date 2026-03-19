/**
 * UI Themes Module
 * Color palettes for different visual themes
 */

export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight (Default)',
    colors: {
      bg: '#0b1020',
      panel: '#121a33',
      text: '#e8eeff',
      muted: '#a7b3da',
      accent: '#7aa2ff',
      bad: '#ff6b6b',
      good: '#57d38c',
      gradientStart: '#4a6cf7',
      gradientEnd: '#7aa2ff',
      card: '#1a1a2e',
      border: '#333',
      borderLight: '#555',
      shopBg: '#1a1a2e',
      successBg: '#1e3a2e',
      successText: '#8f8',
      tabBg: '#222',
      tabActiveBg: '#336',
      tabActiveText: '#fff',
      tabText: '#ccc',
      goldText: '#fc0',
      descText: '#999',
      statText: '#8af',
      countText: '#aaa',
      inputBg: '#1a1a2e',
      inputBorder: '#444',
      overlayBg: 'rgba(0,0,0,0.85)',
      subtleBg: 'rgba(255,255,255,0.04)',
      subtleBorder: 'rgba(255,255,255,0.07)',
      hoverBorder: 'rgba(122,162,255,0.3)',
      dimText: '#888',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      bg: '#0d1a0d',
      panel: '#152415',
      text: '#e8ffe8',
      muted: '#a7daa7',
      accent: '#7aff7a',
      bad: '#ff6b6b',
      good: '#57d38c',
      gradientStart: '#2d8a4e',
      gradientEnd: '#7aff7a',
      card: '#1a1a2e',
      border: '#333',
      borderLight: '#555',
      shopBg: '#1a1a2e',
      successBg: '#1e3a2e',
      successText: '#8f8',
      tabBg: '#222',
      tabActiveBg: '#336',
      tabActiveText: '#fff',
      tabText: '#ccc',
      goldText: '#fc0',
      descText: '#999',
      statText: '#8af',
      countText: '#aaa',
      inputBg: '#1a1a2e',
      inputBorder: '#444',
      overlayBg: 'rgba(0,0,0,0.85)',
      subtleBg: 'rgba(255,255,255,0.04)',
      subtleBorder: 'rgba(255,255,255,0.07)',
      hoverBorder: 'rgba(122,162,255,0.3)',
      dimText: '#888',
    },
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson',
    colors: {
      bg: '#1a0d0d',
      panel: '#251515',
      text: '#ffe8e8',
      muted: '#daa7a7',
      accent: '#ff7a7a',
      bad: '#ff6b6b',
      good: '#57d38c',
      gradientStart: '#c44a4a',
      gradientEnd: '#ff7a7a',
      card: '#1a1a2e',
      border: '#333',
      borderLight: '#555',
      shopBg: '#1a1a2e',
      successBg: '#1e3a2e',
      successText: '#8f8',
      tabBg: '#222',
      tabActiveBg: '#336',
      tabActiveText: '#fff',
      tabText: '#ccc',
      goldText: '#fc0',
      descText: '#999',
      statText: '#8af',
      countText: '#aaa',
      inputBg: '#1a1a2e',
      inputBorder: '#444',
      overlayBg: 'rgba(0,0,0,0.85)',
      subtleBg: 'rgba(255,255,255,0.04)',
      subtleBorder: 'rgba(255,255,255,0.07)',
      hoverBorder: 'rgba(122,162,255,0.3)',
      dimText: '#888',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      bg: '#0d1a1a',
      panel: '#152525',
      text: '#e8ffff',
      muted: '#a7dada',
      accent: '#7affff',
      bad: '#ff6b6b',
      good: '#57d38c',
      gradientStart: '#2a7a8a',
      gradientEnd: '#7affff',
      card: '#1a1a2e',
      border: '#333',
      borderLight: '#555',
      shopBg: '#1a1a2e',
      successBg: '#1e3a2e',
      successText: '#8f8',
      tabBg: '#222',
      tabActiveBg: '#336',
      tabActiveText: '#fff',
      tabText: '#ccc',
      goldText: '#fc0',
      descText: '#999',
      statText: '#8af',
      countText: '#aaa',
      inputBg: '#1a1a2e',
      inputBorder: '#444',
      overlayBg: 'rgba(0,0,0,0.85)',
      subtleBg: 'rgba(255,255,255,0.04)',
      subtleBorder: 'rgba(255,255,255,0.07)',
      hoverBorder: 'rgba(122,162,255,0.3)',
      dimText: '#888',
    },
  },
  light: {
    id: 'light',
    name: 'Light Mode',
    colors: {
      bg: '#f5f5f5',
      panel: '#ffffff',
      text: '#1a1a2e',
      muted: '#666680',
      accent: '#3366cc',
      bad: '#cc3333',
      good: '#339944',
      gradientStart: '#4488dd',
      gradientEnd: '#3366cc',
      card: '#f0f0f5',
      border: '#ccc',
      borderLight: '#aaa',
      shopBg: '#f0f0f5',
      successBg: '#d4edda',
      successText: '#155724',
      tabBg: '#e8e8ee',
      tabActiveBg: '#3366cc',
      tabActiveText: '#fff',
      tabText: '#444',
      goldText: '#b8860b',
      descText: '#666',
      statText: '#2255aa',
      countText: '#666',
      inputBg: '#ffffff',
      inputBorder: '#ccc',
      overlayBg: 'rgba(0,0,0,0.5)',
      subtleBg: 'rgba(0,0,0,0.03)',
      subtleBorder: 'rgba(0,0,0,0.08)',
      hoverBorder: 'rgba(51,102,204,0.3)',
      dimText: '#888',
    },
  },
};

export const DEFAULT_THEME = 'midnight';

/**
 * Apply a theme to the document
 * @param {string} themeId - Theme ID to apply
 */
export function applyTheme(themeId) {
  if (typeof document === 'undefined') return;
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;
  
  for (const [key, value] of Object.entries(theme.colors)) {
    // Convert camelCase to kebab-case for CSS variables
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssKey}`, value);
  }
}

/**
 * Get list of available themes for UI
 * @returns {Array<{id: string, name: string}>}
 */
export function getThemeList() {
  return Object.values(THEMES).map(t => ({ id: t.id, name: t.name }));
}
