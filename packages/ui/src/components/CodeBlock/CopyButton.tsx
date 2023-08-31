import ClipboardCheckIcon from 'bootstrap-icons/icons/clipboard-check.svg';
import ClipboardIcon from 'bootstrap-icons/icons/clipboard.svg';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';

export function CopyButton ({ className, ...props }: { className?: string, content: string, children?: ReactNode }) {
  return <NoStyleCopyButton className={twJoin('border bg-toolbar rounded hover:text-active transition-colors px-2 py-1 text-content flex gap-2 items-center text-sm', className)} {...props} />;
}

export function NoStyleCopyButton ({ className, content, children }: { className?: string, content: string, children?: ReactNode }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setChecked(true);
    });
  }, [content]);

  return (
    <button className={className} onClick={handleCopy} type="button">
      {checked ? <ClipboardCheckIcon width={14} height={14} /> : <ClipboardIcon width={14} height={14} />}
      {children ? children : checked ? 'Copied!' : 'Copy'}
    </button>
  );
}
