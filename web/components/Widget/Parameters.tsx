'use client';

import { parameterDefinitions } from '@ossinsight/widgets';
import parsers from '@ossinsight/widgets-core/src/parameters/parser';
import { ParamInput } from '@ossinsight/widgets-core/src/parameters/react';
import { ParametersContext } from '@ossinsight/widgets-core/src/parameters/react/context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cache, use, useRef, useState } from 'react';

export function WidgetParameters ({ widgetName }: { widgetName: string }) {
  const getParameters = parameterDefinitions[widgetName];
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const reposCache = useRef({});

  if (!getParameters) {
    throw new Error('bad widget');
  }

  const parameters = use(cache(getParameters)());

  const [values, setValues] = useState(() => {
    const values: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  });

  return (
    <ParametersContext.Provider value={{ reposCache: reposCache.current }}>
      <div className="flex items-start gap-4 mt-4">
        {Object.entries(parameters).map(([key, config]) => {
          const rawValue = values[key];
          const value = rawValue == null ? null : parsers[config.type](values[key]);
          return (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-sm text-gray-400">
                {config.title ?? key}
              </span>
              <ParamInput
                config={config}
                value={value}
                onValueChange={(nv) => {
                  setValues(values => ({ ...values, [key]: String(nv) }));
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        <button className="rounded bg-gray-200 hover:bg-gray-400 text-gray-700 transition-colors px-2 py-1 text-sm" onClick={() => {
          const usp = new URLSearchParams(values);
          push(`${pathname}?${usp.toString()}`);
        }}>
          Update
        </button>
      </div>
    </ParametersContext.Provider>
  );
}