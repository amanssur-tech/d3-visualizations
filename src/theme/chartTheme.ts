// src/theme/chartTheme.ts
/**
 * Centralized CSS variable references for chart styling so every renderer
 * stays in sync with the current light/dark theme instantly.
 */

export const cssVar = (token: string) => `var(${token})`;

export const chartTheme = {
  textPrimary: cssVar('--color-text'),
  textMuted: cssVar('--color-text-soft'),
  grid: cssVar('--color-grid'),
  accent: cssVar('--color-accent'),
  accentStrong: cssVar('--color-accent-strong'),
  surface: cssVar('--color-surface'),
};
