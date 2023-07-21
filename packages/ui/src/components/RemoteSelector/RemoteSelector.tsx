import * as RuiPopover from '@radix-ui/react-popover';
import { ChangeEvent, FocusEvent, MouseEvent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { useCancellablePromise } from '../../hooks/useCancellablePromise';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { CancelablePromise } from '../../utils/promise';
import './style.scss';

export interface RemoteSelectorProps<Item> {
  value: Item[];
  getRemoteOptions: (text: string) => CancelablePromise<Item[]>;

  getItemText?: (item: Item) => string;

  popoverPortalProps?: Omit<RuiPopover.PortalProps, 'children'>;
  popoverContentProps?: Omit<RuiPopover.PopoverContentProps, 'children' | 'onOpenAutoFocus'>;

  onSelect? (item: Item, event: MouseEvent): void;

  renderInput (props: RemoteSelectorInputProps): ReactElement;

  renderList (props: RemoteSelectorListProps): ReactElement;

  renderListItem (props: RemoteSelectorListItemProps<Item>): ReactElement;

  renderLoading (): ReactElement;

  renderEmpty (): ReactElement;

  renderError (error: unknown): ReactElement;

  equals?: (item: Item, Item: Item) => boolean;
}

export interface RemoteSelectorInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
}

export interface RemoteSelectorListProps {
  children: ReactNode;
}

export interface RemoteSelectorListItemProps<Item> {
  item: Item;
  disabled: boolean;
  selected: boolean;
  onClick: (event: MouseEvent) => void;
}

export function RemoteSelector<Item> ({
  value,
  getRemoteOptions,
  renderInput,
  renderList,
  renderListItem,
  renderLoading,
  renderEmpty,
  renderError,
  onSelect,
  popoverContentProps,
  popoverPortalProps,
  equals = Object.is,
  getItemText = String,
}: RemoteSelectorProps<Item>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { execute, result: items, executing: loading, error } = useCancellablePromise<string, Item[]>({
    executor: getRemoteOptions,
    defaultResult: [],
  });

  const startFetch = useDebouncedCallback(execute, { timeout: 500 });

  const onInputChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInput(value);
    startFetch(value);
  }, []);

  const onInputFocus = useCallback((ev: FocusEvent<HTMLInputElement>) => {
  }, []);

  const renderChildren = () => {
    if (error) {
      return renderError(error);
    }
    if (loading) {
      return renderLoading();
    }
    if (items.length === 0) {
      return renderEmpty();
    }

    const makeHandleSelectItem = (item: Item) => (ev: MouseEvent) => {
      onSelect?.(item, ev);
      setOpen(false);
      setInput(getItemText(item));
    };

    return renderList({
      children: items.map(item => (
        renderListItem({
          item,
          disabled: false,
          selected: !!value.find(v => equals(v, item)),
          onClick: makeHandleSelectItem(item),
        })
      )),
    });
  };

  return (
    <RuiPopover.Root open={open} onOpenChange={setOpen}>
      <RuiPopover.Trigger asChild>
        <RuiPopover.Anchor asChild>
          {renderInput({ value: input, onChange: onInputChange, onFocus: onInputFocus })}
        </RuiPopover.Anchor>
      </RuiPopover.Trigger>
      <RuiPopover.Portal {...popoverPortalProps}>
        <RuiPopover.Content className="remote-popper-content" {...popoverContentProps} onOpenAutoFocus={prevent}>
          {renderChildren()}
        </RuiPopover.Content>
      </RuiPopover.Portal>
    </RuiPopover.Root>
  );
}

const prevent = (ev: Event) => ev.preventDefault();
