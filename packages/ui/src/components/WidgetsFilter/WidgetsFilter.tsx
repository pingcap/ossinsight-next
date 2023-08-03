import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { SiteWidgetsTagsConfig } from '../../types/ui-config';
import { Tag } from '../Tag';
import { useCategories } from './useCategories';

export type WidgetsFilterConfig = {
  tags: string[]
  search: string
}

export interface WidgetsFilterProps {
  availableTags: string[];
  categoriesConfig: SiteWidgetsTagsConfig['categories'];
  defaultCategoryName?: string;
  config: WidgetsFilterConfig;
  onConfigChange: (config: WidgetsFilterConfig) => void;
}

export function WidgetsFilter (props: WidgetsFilterProps) {
  const { config, onConfigChange } = props;
  const [search, setSearch] = useState(props.config.search);
  const categories = useCategories(props.categoriesConfig, props.availableTags, props.defaultCategoryName);

  const debouncedOnConfigChange = useDebouncedCallback(onConfigChange, { timeout: 400 });
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    debouncedOnConfigChange({
      ...config,
      search: event.target.value,
    });
  };

  const makeHandleSelect = (tag: string) => {
    return () => {
      if (config.tags.includes(tag)) {
        onConfigChange({ ...config, tags: config.tags.filter((t) => t !== tag) });
      } else {
        onConfigChange({ ...config, tags: [...config.tags, tag] });
      }
    };
  };

  return (
    <div className="rounded-2xl border-2 border-dashed p-4 bg-toolbar">
      <h5 className="text-lg text-subtitle">Filter</h5>
      <section className="mt-2">
        <input className="TextInput" value={search} onChange={handleSearchChange} />
      </section>
      <h5 className="mt-4 text-lg text-subtitle">Tags</h5>
      <section className="mt-2 space-y-4">
        {categories.map(category => (
          <div key={category.key} className="space-y-2">
            <h6 className="text-xs text-subtitle">{category.name}</h6>
            <div key={category.key} className="flex flex-wrap gap-2 mt-2">
              {category.tags.map((tag, index) => (
                <Tag key={tag} selected={config?.tags.includes(tag)} onSelected={makeHandleSelect(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}