import React from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { twMerge } from 'tailwind-merge';

export interface ToggleGroupSingleProps
  extends Omit<ToggleGroup.ToggleGroupSingleProps, 'type'> {
  className?: string;
  items: ToggleGroupSingleItemProps[];
}

export interface ToggleGroupSingleItemProps
  extends ToggleGroup.ToggleGroupItemProps {
  id: string;
  value: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const toggleGroupItemClasses =
  'hover:bg-primary-highlighted data-[state=on]:bg-primary-reverse flex min-h-[35px] w-auto min-w-[35px] px-2 items-center justify-center bg-primary text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none';

export const SingleToggleButtonGroup = (props: ToggleGroupSingleProps) => {
  const { className, items, ...rest } = props;

  return (
    <ToggleGroup.Root
      className={twMerge(
        'inline-flex rounded space-x-px',
        className
      )}
      type='single'
      {...rest}
    >
      {items.map((item) => {
        const { id, value, label, className, icon, children, ...itemRest } =
          item;
        return (
          <ToggleGroup.Item
            key={item.id}
            className={twMerge(toggleGroupItemClasses, item.className)}
            value={item.value}
            aria-label={item.label}
            {...itemRest}
          >
            {item.icon}
            {item.children}
            {!item.icon && !item.children && item.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
};
