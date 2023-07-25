import { StaticImageData } from 'next/image';
import { ComponentType, SVGProps } from 'react';

/**
 *
 */
export type ConfigIconType = ComponentType<SVGProps<SVGSVGElement>> | StaticImageData | { src: string, width: number, height: number, alt: string };

export interface MenuItemBaseConfig {
  label: string;
  icon?: ConfigIconType;
}

export interface MenuItemConfig extends MenuItemBaseConfig {
  href: string;
}

export interface MenuParentItemConfig extends MenuItemBaseConfig {
  items: MenuItemConfig[];
}

export type Spacer = 'spacer';
export type Divider = 'divider';

export interface MenuConfig {
  items: (MenuItemConfig | MenuParentItemConfig | Spacer | Divider)[];
}

export interface SiteHeaderConfig extends MenuConfig {
  logo: ConfigIconType;
}
