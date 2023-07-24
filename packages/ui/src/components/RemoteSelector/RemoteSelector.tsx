import { ChangeEvent, FocusEvent, MouseEvent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { InputPopover, InputPopoverProps } from '../InputPopover';
import { useRemoteList, UseRemoteListOptions } from './useRemoteList';

export interface RemoteSelectorProps<Item> extends UseRemoteListOptions<Item>, Pick<InputPopoverProps, 'popoverContentProps' | 'popoverPortalProps'> {
  value: Item[];

  getItemText?: (item: Item) => string;

  onSelect? (item: Item, event: MouseEvent): void;

  renderInput (props: RemoteSelectorInputProps): ReactElement;

  renderList? (props: RemoteSelectorListProps): ReactElement;

  renderListItem (props: RemoteSelectorListItemProps<Item>): ReactElement;

  renderLoading? (): ReactElement;

  renderEmpty? (): ReactElement;

  renderError? (error: unknown): ReactElement;

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
  renderList = defaultRenderList,
  renderListItem,
  renderLoading = defaultRenderLoading,
  renderEmpty = defaultRenderEmpty,
  renderError = defaultRenderError,
  onSelect,
  popoverContentProps,
  popoverPortalProps,
  equals = Object.is,
  getItemText = String,
}: RemoteSelectorProps<Item>) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(() => value[0] && getItemText(value[0]));
  const { items, reload, error, loading } = useRemoteList({ getRemoteOptions });

  const onInputChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setInput(value);
    reload(value);
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
    <InputPopover
      open={open}
      onOpenChange={setOpen}
      input={renderInput({ value: input, onChange: onInputChange, onFocus: onInputFocus })}
      popperContent={renderChildren()}
      popoverPortalProps={popoverPortalProps}
      popoverContentProps={popoverContentProps}
    />
  );
}

function defaultRenderList ({ children }: RemoteSelectorListProps) {
  return (
    <ul>
      {children}
    </ul>
  );
}

function defaultRenderLoading () {
  return <div className="py-1 px-2 text-disabled text-xs">Loading...</div>;
}

function defaultRenderEmpty () {
  return <div className="py-1 px-2 text-disabled text-xs">Empty result</div>;
}

function defaultRenderError (error: unknown) {
  return <div className="py-1 px-2 text-content text-xs">Failed to load</div>;
}

const prevent = (ev: Event) => ev.preventDefault();
