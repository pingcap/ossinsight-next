import { RemoteSelectorInputProps } from '@ossinsight/ui';
import { CollectionInfo, CollectionSelector } from '@ossinsight/ui/src/components/CollectionSelector';
import { useCallback, useContext } from 'react';
import { ParametersContext } from '../context';

export function CollectionIdInput ({ value, onValueChange }: { value: number, onValueChange: (newValue: number) => void }) {
  const { linkedData } = useContext(ParametersContext);

  const handleCollectionChange = useCallback((collection: CollectionInfo) => {
    linkedData.collections[String(collection.id)] = collection;
    onValueChange(collection.id);
  }, []);

  const collection = linkedData.collections[String(value)];

  return (
    <CollectionSelector
      collection={collection}
      onCollectionSelected={handleCollectionChange}
      renderInput={renderInput}
    />
  );
}

function renderInput (props: RemoteSelectorInputProps) {
  return <input className="TextInput" {...props}
                type={(props as any).type === 'button' ? undefined : (props as any).type} />;
}