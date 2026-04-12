import type { SiteTheme } from './siteTheme';

/** Props passed to every routed page from `App`. */
export interface PageProps {
  onNavigate: (page: string) => void;
  theme: SiteTheme;
}
