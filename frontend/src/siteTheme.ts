import type { CSSProperties } from 'react';

export type SiteTheme = 'night' | 'day';

export const SITE_THEME_STORAGE_KEY = 'portfolio-site-theme';

export function readStoredTheme(): SiteTheme {
  try {
    const v = localStorage.getItem(SITE_THEME_STORAGE_KEY);
    if (v === 'day') return 'day';
  } catch {
    /* ignore */
  }
  return 'night';
}

export function ambientLayerStyle(theme: SiteTheme): CSSProperties {
  if (theme === 'day') {
    return {
      background: `
        radial-gradient(ellipse 120% 85% at 50% -18%, rgba(200, 190, 255, 0.28), transparent 52%),
        radial-gradient(ellipse 85% 58% at 88% 100%, rgba(120, 210, 200, 0.22), transparent 50%),
        radial-gradient(ellipse 72% 48% at 8% 88%, rgba(255, 200, 220, 0.14), transparent 44%),
        linear-gradient(180deg, #f3f0eb 0%, #ebe6df 42%, #e5f4f1 100%)
      `,
    };
  }
  return {
    background: `
      radial-gradient(ellipse 120% 80% at 50% -20%, rgba(120, 180, 255, 0.12), transparent 50%),
      radial-gradient(ellipse 90% 60% at 80% 100%, rgba(180, 120, 255, 0.08), transparent 45%),
      radial-gradient(ellipse 70% 50% at 10% 90%, rgba(100, 220, 200, 0.06), transparent 40%),
      linear-gradient(180deg, #060a12 0%, #050810 40%, #070c18 100%)
    `,
  };
}
