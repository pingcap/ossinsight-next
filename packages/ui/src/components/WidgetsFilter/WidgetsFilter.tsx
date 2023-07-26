import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { colors, Tag } from '../Tag';

export type WidgetsFilterConfig = {
  tags: string[]
  search: string
}

export interface WidgetsFilterProps {
  availableTags: string[];
  config: WidgetsFilterConfig;
  onConfigChange: (config: WidgetsFilterConfig) => void;
}

export function WidgetsFilter (props: WidgetsFilterProps) {
  const { config, onConfigChange } = props;
  const [search, setSearch] = useState(props.config.search);

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
    <div className="WidgetsFilter">
      <h2 className="text-lg text-subtitle">Filter</h2>
      <div className="WidgetsFilter-search">
        <input className="TextInput" value={search} onChange={handleSearchChange} />
      </div>
      <div className="WidgetsFilter-tags">
        {props.availableTags.map((tag, index) => (
          <Tag key={tag} variant={colors[index % colors.length]} selected={config?.tags.includes(tag)} onSelected={makeHandleSelect(tag)}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
}