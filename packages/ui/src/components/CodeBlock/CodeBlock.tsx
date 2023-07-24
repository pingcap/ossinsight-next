'use client';

import 'highlight.js/styles/github.css';
import { HTMLAttributes, useEffect, useId, useState } from 'react';
import { CopyButton } from './CopyButton';
import type { HighlightRequest, HighlightResponse } from './highlight.worker';

const worker = new Worker(new URL('./highlight.worker.ts', import.meta.url));

export interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock ({ code, language }: CodeBlockProps) {
  const id = useId();
  const [result, setResult] = useState<string | undefined>();

  useEffect(() => {
    setResult(undefined);
    if (language) {
      worker.postMessage({
        id,
        code,
        languageSubset: [language],
      } satisfies HighlightRequest);
    }
  }, [code, language]);

  useEffect(() => {
    const handler = (ev: MessageEvent<HighlightResponse>) => {
      if (ev.data.id !== id) {
        return;
      }
      if ('error' in ev.data) {
        console.error(ev.data.error);
      } else {
        setResult(ev.data.result);
      }
    };
    worker.addEventListener('message', handler);

    return () => {
      worker.removeEventListener('message', handler);
    };
  }, []);

  const codeProps: HTMLAttributes<HTMLDivElement> = {};

  if (result) {
    codeProps.dangerouslySetInnerHTML = { __html: result };
  } else {
    codeProps.children = code;
  }

  return (
    <div className="relative bg-gray-50 rounded">
      <pre className="text-xs">
        <code className="block overflow-x-auto p-4" {...codeProps} />
      </pre>
      <CopyButton className="top-2 right-2 absolute" content={code} />
    </div>
  );
}


