import * as SelectPrimitive from '@radix-ui/react-select';
import CheckIcon from 'bootstrap-icons/icons/check.svg';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg';
import clsx from 'clsx';
import * as React from 'react';
import './style.scss';

export const Select = React.forwardRef<
  HTMLButtonElement,
  SelectPrimitive.SelectProps & {
  id?: string
  label?: string | React.ReactNode;
  className?: string;
} & Pick<SelectPrimitive.SelectContentProps, 'position'>
>(({ id, children, className, position, ...props }, forwardedRef) => {
  return (
    <div className={clsx('SelectWrapper', className)}>
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          className={clsx('SelectTrigger')}
          id={id}
          ref={forwardedRef}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className={clsx('SelectIcon')}>
            <ChevronDownIcon width={12} height={12} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={clsx('SelectContent')} position={position}>
            <SelectPrimitive.ScrollUpButton
              className={clsx('SelectScrollButton')}
            >
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className={clsx('SelectViewport')}>
              {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton
              className={clsx('SelectScrollButton')}
            >
              <ChevronDownIcon width={12} height={12} />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
});

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      className={clsx('SelectItem', className)}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="SelectItemIndicator">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

export const SelectGroup = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectGroupProps & {
  label?: string | React.ReactNode;
}
>(({ children, label, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Group
      className={clsx('SelectGroup', className)}
      {...props}
      ref={forwardedRef}
    >
      {label && (
        <SelectPrimitive.Label className="SelectLabel">
          {label}
        </SelectPrimitive.Label>
      )}
      {children}
    </SelectPrimitive.Group>
  );
});

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectSeparatorProps
>(({ className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Separator
      className={clsx('SelectSeparator', className)}
      {...props}
      ref={forwardedRef}
    />
  );
});

export type SelectParamOption<K extends string | number = string> = {
  key: K;
  title: string | React.ReactNode;
  [key: string]: any;
};

export function useSimpleSelect<T extends number | string = string> (
  options: Array<SelectParamOption<T>>, // TODO support inheritance options, such as [[SelectParamOption<T>, SelectParamOption<T>], SelectParamOption<T>]
  defaultVal: SelectParamOption<T>,
  id?: string,
) {
  const [value, setValue] = React.useState<string>(defaultVal.key.toString());

  const onChange = React.useCallback((v: string) => {
    setValue(v);
  }, []);

  const El = React.useMemo(() => {
    return (
      <>
        <Select
          id={id}
          defaultValue={defaultVal.key.toString()}
          onValueChange={onChange}
        >
          {options.map((option) => (
            <SelectItem key={option.key} value={option.key.toString()}>
              {option.title}
            </SelectItem>
          ))}
        </Select>
      </>
    );
  }, [options, value]);

  return {
    select: El,
    value,
  };
}
