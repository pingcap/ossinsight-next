'use client';

import { ColorSchemeProvider } from '@ossinsight/ui/src/components/ColorScheme';
import { PropsWithChildren } from 'react';

export function Providers ({ children }: PropsWithChildren) {
  return (
    <ColorSchemeProvider>
      {children}
    </ColorSchemeProvider>
  );
}
