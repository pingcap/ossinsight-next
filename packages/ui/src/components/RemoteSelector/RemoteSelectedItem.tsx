import ClearIcon from 'bootstrap-icons/icons/x-circle-fill.svg';
import { ReactNode } from 'react';

export interface RemoteSelectedItemProps {
  onClear?: () => void;
  children: ReactNode;
}

export function RemoteSelectedItem ({ onClear, children }: RemoteSelectedItemProps) {
  return (
    <span className="flex items-center gap-4">
      <span className="flex text-xs gap-2 p-1 items-center text-subtitle select-none">
        {children}
      </span>
       <button onClick={onClear} className='opacity-50 hover:opacity-100 transition-opacity'>
        <ClearIcon className="w-4 h-4" />
      </button>
    </span>
  );
}