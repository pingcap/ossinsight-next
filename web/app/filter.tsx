'use client';

import siteConfig from '@/site.config';
import { allWidgetKeywords } from '@/utils/widgets';
import { WidgetsFilter, WidgetsFilterConfig } from '@ossinsight/ui/src/components/WidgetsFilter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Filter ({ config }: { config: WidgetsFilterConfig }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handle = (config: WidgetsFilterConfig) => {
    const usp = new URLSearchParams(searchParams as any);
    usp.delete('tag');
    if (config.search) {
      usp.set('q', config.search);
    } else {
      usp.delete('q');
    }
    config.tags.forEach(tag => usp.append('tag', tag));

    router.push(pathname + '?' + usp.toString(), {
      scroll: false
    });
  };

  return (
    <WidgetsFilter
      categoriesConfig={siteConfig.widgets.tags.categories}
      availableTags={allWidgetKeywords}
      config={config}
      onConfigChange={handle}
    />
  );
}