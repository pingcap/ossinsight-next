

import { makeNoopCancellablePromise } from '../../utils/promise';
import { RemoteSelectItem, RemoteSelector, RemoteSelectorProps } from '../RemoteSelector';
import { collectionsPromise, getCollectionText, isCollectionEquals } from './utils';

export type CollectionInfo = {
  id: number
  name: string
  public: boolean
}

export interface CollectionSelectorProps extends Pick<RemoteSelectorProps<any>, 'renderInput'> {
  collection: CollectionInfo | undefined;
  onCollectionSelected: (collection: CollectionInfo) => void;
}

export function CollectionSelector ({ collection, onCollectionSelected, renderInput }: CollectionSelectorProps) {
  return (
    <RemoteSelector<CollectionInfo>
      executeOnMount
      getItemText={getCollectionText}
      value={collection ? [collection] : []}
      onSelect={onCollectionSelected}
      getRemoteOptions={searchCollection}
      renderInput={renderInput}
      renderListItem={({ item, ...props }) => <RemoteSelectItem key={item.id} {...props} >{item.name}</RemoteSelectItem>}
      equals={isCollectionEquals}
    />
  );
}

export function searchCollection (name: string) {
  return makeNoopCancellablePromise(collectionsPromise.then(collections => collections.filter(c => name ? c.name.toLowerCase().includes(name.toLowerCase()) : true)));
}
