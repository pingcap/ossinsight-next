'use client';

import * as RuiMenubar from '@radix-ui/react-menubar';
import Link from 'next/link';
import { useState } from 'react';
import { SiteHeaderConfig } from '../../types/ui-config';
import { SiteConfigIcon } from '../SiteConfigIcon';
import { MenuItem } from './MenuItem';
import './style.scss';

export interface SiteHeaderProps extends SiteHeaderConfig {

}

const logoHeight = 32;

export function SiteHeader ({ logo, items }: SiteHeaderConfig) {
  const [value, setValue] = useState<string>();

  return (
    <RuiMenubar.Root asChild value={value} onValueChange={setValue}>
      <header className="SiteHeader">
        <RuiMenubar.Label asChild>
          <Link href="https://ossinsight.io/">
            <SiteConfigIcon icon={logo} alt="Logo" height={logoHeight} />
          </Link>
        </RuiMenubar.Label>
        <nav className="SiteHeader-menu">
          <ul>
            {items.map((item, index) => (
              <MenuItem item={item} key={index} onValueChange={setValue} />
            ))}
          </ul>
        </nav>
      </header>
    </RuiMenubar.Root>
  );
}
