import { SiteBannerConfig, SiteHeaderConfig, SiteWidgetsConfig } from '@ossinsight/ui/src/types/ui-config';

export interface SiteConfig {
  /** @deprecated not used */
  host: string;
  header: SiteHeaderConfig;
  ga: {
    tag: string
    measurementId: string
    measurementSecret: string
    clientId: string
  }
  banner?: SiteBannerConfig;
  sizes: Record<string, ImageSizeConfig>;
  widgets: SiteWidgetsConfig;
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
