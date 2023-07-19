import * as RuiPopover from '@radix-ui/react-popover';
import { ChangeEvent, FocusEvent, MouseEvent, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { CancelablePromise } from '../../utils/promise';
import './style.scss';

export interface RemoteSelectorProps<Item> {
  value: Item[];
  getRemoteOptions: (text: string) => Promise<Item[]> & { cancel: () => void };

  getItemText?: (item: Item) => string;

  popoverPortalProps?: Omit<RuiPopover.PortalProps, 'children'>;
  popoverContentProps?: Omit<RuiPopover.PopoverContentProps, 'children' | 'onOpenAutoFocus'>;

  onSelect? (item: Item, event: MouseEvent): void;

  onStartFetching? (text: string): void;

  onFinishedFetching? (text: string): void;

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
  onStartFetching,
  onFinishedFetching,
  popoverContentProps,
  popoverPortalProps,
  equals = Object.is,
  getItemText = String,
}: RemoteSelectorProps<Item>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const debouncedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(true);

  const getRemoteOptionsRef = useRef(getRemoteOptions);
  getRemoteOptionsRef.current = getRemoteOptions;

  const fetchingPromise = useRef<CancelablePromise<Item[]>>();

  const onInputChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInput(value);

    clearTimeout(debouncedTimerRef.current);
    debouncedTimerRef.current = setTimeout(() => {
      startFetch(value);
    }, 500);
  }, []);

  const onInputFocus = useCallback((ev: FocusEvent<HTMLInputElement>) => {
    onInputChange(ev);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(debouncedTimerRef.current);
      mounted.current = false;
      fetchingPromise.current?.cancel();
    };
  }, []);

  const startFetch = useCallback((text: string) => {
    fetchingPromise.current?.cancel();
    setLoading(true);
    setError(undefined);
    onStartFetching?.(text);

    const p = getRemoteOptionsRef.current(text);

    fetchingPromise.current = p;

    p
      .then(res => {
        setItems(res);
        onFinishedFetching?.(text);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
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
