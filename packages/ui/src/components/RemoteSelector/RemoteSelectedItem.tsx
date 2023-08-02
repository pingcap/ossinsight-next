import ClearIcon from 'bootstrap-icons/icons/x-circle-fill.svg';
import { ReactNode } from 'react';

export interface RemoteSelectedItemProps {
  id?: string;
  onClear?: () => void;
  children: ReactNode;
}

export function RemoteSelectedItem ({ id, onClear, children }: RemoteSelectedItemProps) {
  // TODO: Set id for button will trigger onClick when click the referencing label
  //       Find a way to focus but not click.
  return (
    <span className="flex items-center gap-4 py-1 px-2 border border-transparent">
      <span className="flex text-sm gap-2 items-center text-subtitle select-none">
        {children}
      </span>
       <button type="button" onClick={onClear} className="rounded-full opacity-50 hover:opacity-100 focus:opacity-100 shadow-gray-600 focus:shadow-control outline-none transition">
        <ClearIcon className="w-4 h-4 pointer-events-none" />
      </button>
    </span>
  );
}
