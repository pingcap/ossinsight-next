import { RemoteSelector, RemoteSelectorProps } from '../RemoteSelector';
import { GHRepoItem } from './GHRepoItem';
import { GHRepoListItem } from './GHRepoListItem';
import { getRepoText, isRepoEquals, searchRepo } from './utils';
import type { RemoteRepoInfo } from './GHRepoSelector';

export interface GHOrgRepoSelectorProps
  extends Pick<RemoteSelectorProps<any>, 'id' | 'renderInput'> {
  repos: RemoteRepoInfo[];
  onRepoSelected: (repo: RemoteRepoInfo | undefined) => void;
  onRepoRemoved?: (repo: RemoteRepoInfo) => void;
  compat?: boolean;
  maxItems?: number;
  orgName: string;
  disableInput?: boolean;
}

export function GHOrgRepoSelector({
  repos,
  onRepoSelected,
  onRepoRemoved,
  compat,
  renderInput,
  maxItems = 2,
  orgName,
  disableInput = false,
  ...props
}: GHOrgRepoSelectorProps) {
  return (
    <RemoteSelector<RemoteRepoInfo>
      {...props}
      renderInput={(params) =>
        renderInput({
          disabled: disableInput || repos.length >= maxItems,
          placeholder:
            repos.length >= maxItems
              ? `Max ${maxItems} repos`
              : `${orgName}/...`,
          ...params,
        })
      }
      getItemText={getRepoText}
      value={repos}
      onSelect={onRepoSelected}
      getRemoteOptions={searchRepo}
      isMultiSelect
      renderSelectedItems={(items) => {
        return (
          <>
            {items.map((item) => (
              <GHRepoItem
                key={item.id}
                id={props.id}
                item={item}
                compat={compat}
                onClear={() => onRepoRemoved && onRepoRemoved(item)}
              />
            ))}
          </>
        );
      }}
      renderListItem={(props) => (
        <GHRepoListItem key={props.item.id} {...props} />
      )}
      equals={isRepoEquals}
      inputPrefix={`${orgName}/`}
      filterResults={(items) => {
        return items.filter((item) => item.fullName.startsWith(`${orgName}/`));
      }}
    />
  );
}
