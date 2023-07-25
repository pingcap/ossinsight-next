'use client';

import { isWidget, widgetParameterDefinitions } from '@/utils/widgets';
import { Button } from '@ossinsight/ui/src/components/Button';
import parsers from '@ossinsight/widgets-core/src/parameters/parser';
import { ParamInput } from '@ossinsight/widgets-core/src/parameters/react';
import { ParametersContext } from '@ossinsight/widgets-core/src/parameters/react/context';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useRef, useState } from 'react';

export function WidgetParameters ({ widgetName, linkedData }: { widgetName: string, linkedData: LinkedData }) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (!isWidget(widgetName)) {
    throw new Error('bad widget');
  }

  const parameters = use(widgetParameterDefinitions(widgetName));

  const [values, setValues] = useState(() => {
    const values: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  });

  return (
    <ParametersContext.Provider value={{ linkedData }}>
      <div className="flex items-start gap-4 mt-4">
        {Object.entries(parameters).map(([key, config]) => {
          const rawValue = values[key];
          const value = rawValue == null ? null : parsers[config.type](values[key]);
          return (
            <div key={key} className="flex flex-col gap-2">
              <span className="text-sm">
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
        <Button variant='primary' onClick={() => {
          const usp = new URLSearchParams(values);
          push(`${pathname}?${usp.toString()}`);
        }}>
          Update
        </Button>
      </div>
    </ParametersContext.Provider>
  );
}
