import { SiteHeaderConfig } from '@ossinsight/ui/src/types/ui-config';

export interface SiteConfig {
  header: SiteHeaderConfig;
  sizes: Record<string, ImageSizeConfig>;
}

export interface ImageSizeConfig {
  width: number;
  height: number;
  /**
   * Device pixel ratio, default to 2
   */
  dpr?: number;
}

export function defineSiteConfig (config: SiteConfig): SiteConfig {
  return config;
}

export function resolveImageSizeConfig (config: SiteConfig, name: string) {
  return config.sizes[name] || config.sizes['default'];
}
