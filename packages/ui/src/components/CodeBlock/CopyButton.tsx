import ClipboardCheckIcon from 'bootstrap-icons/icons/clipboard-check.svg';
import ClipboardIcon from 'bootstrap-icons/icons/clipboard.svg';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

export function CopyButton ({ className, content }: { className: string, content: string }) {
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
    <button className={clsx('border bg-toolbar rounded opacity-40 hover:opacity-100 transition-opacity p-0.5 text-active', className)} onClick={handleCopy} type="button">
      {checked ? <ClipboardCheckIcon width={12} height={12} /> : <ClipboardIcon width={12} height={12} />}
    </button>
  );
}