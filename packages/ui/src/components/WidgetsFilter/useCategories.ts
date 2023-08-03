import { useMemo } from 'react';
import { SiteWidgetsTagsConfig } from '../../types/ui-config';

type Category = {
  key: string
  name: string
  tags: string[]
}

export function useCategories (config: SiteWidgetsTagsConfig['categories'], tags: string[], defaultCategoryName = 'Others') {
  return useMemo(() => {
    const others = new Set<string>(tags);

    const categories = config.map(({ name, key, tags }) => {
      tags.forEach(tag => others.delete(tag));

      return {
        key: key || name,
        name,
        tags: tags.sort(),
      };
    });

    if (others.size > 0) {
      categories.push({
        key: '__DEFAULT__',
        name: defaultCategoryName,
        tags: Array.from(others).sort(),
      });
    }
    return categories;
  }, [config, tags, defaultCategoryName]);
}