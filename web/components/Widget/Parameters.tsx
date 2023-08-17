'use client';

import { isWidget, widgetParameterDefinitions } from '@/utils/widgets';
import { Button } from '@ossinsight/ui/src/components/Button';
import parsers from '@ossinsight/widgets-core/src/parameters/parser';
import { ParamInput } from '@ossinsight/widgets-core/src/parameters/react';
import { ParametersContext } from '@ossinsight/widgets-core/src/parameters/react/context';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { ParameterDefinition } from '@ossinsight/widgets-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useId, useMemo, useState } from 'react';

export function WidgetParameters ({ widgetName, linkedData }: { widgetName: string, linkedData: LinkedData }) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = useId();

  if (!isWidget(widgetName)) {
    throw new Error('bad widget');
  }

  const parameters = use(widgetParameterDefinitions(widgetName));

  const [values, setValues] = useState(() => {
    const values: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key != null) {
        values[key] = value;
      }
    });
    return values;
  });

  const validated = useMemo(() => {
    for (let [k, p] of Object.entries(parameters)) {
      if (p.required) {
        if (values[k] == null) {
          return false;
        }
      }
    }
    return true;
  }, [parameters, values]);

  return (
    <ParametersContext.Provider value={{ linkedData }}>
      <div className="flex flex-col items-start gap-4 mt-4">
        {Object.entries(parameters).map(([key, config]) => {
          const pId = `${key}-${id}`;
          const rawValue = values[key];
          const value = rawValue == parseValue(rawValue, config);
          const showRequiredMessage = config.required && value == null;
          return (
            <div key={key} className="flex flex-col gap-2">
              <label className={`text-sm${showRequiredMessage ? ' text-red-400' : ''}`} htmlFor={pId}>
                {config.title ?? key}
              </label>
              <ParamInput
                id={pId}
                config={config}
                value={value}
                onValueChange={(nv) => {
                  setValues(values => ({ ...values, [key]: nv == null ? nv : String(nv) }));
                }}
              />
              {showRequiredMessage && <p className="text-xs text-red-400">{config.title} is required.</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Button
          variant="primary"
          className="w-full"
          disabled={!validated}
          onClick={() => {
            const usp = new URLSearchParams(values);
            push(`${pathname}?${usp.toString()}`);
          }}>
          Update
        </Button>
      </div>
    </ParametersContext.Provider>
  );
}

function parseValue (rawValue: any, config: ParameterDefinition) {
  if (rawValue == null) {
    if (!('expression' in config)) {
      return rawValue;
    }
  }
  return parsers[config.type](rawValue, config as any);
}
