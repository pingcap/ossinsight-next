import { SiteHeaderConfig } from '@ossinsight/ui/src/types/ui-config';

export interface SiteConfig {
  header: SiteHeaderConfig;
}

export function defineSiteConfig (config: SiteConfig): SiteConfig {
  return config;
}
