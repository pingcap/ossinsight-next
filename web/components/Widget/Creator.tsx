'use client';

import { Code } from '@/components/Widget/Code';
import { MockMarkdown } from '@/components/Widget/MockMarkdown';
import { WidgetName } from '@/components/Widget/WidgetName';
import { filteredWidgetsNames } from '@/utils/widgets';
import { Select, SelectItem } from '@ossinsight/ui';
import { AnalyzeSelector, AnalyzeTuple } from '@ossinsight/ui/src/components/AnalyzeSelector';
import { Button } from '@ossinsight/ui/src/components/Button';
import LazyImg from '@ossinsight/ui/src/components/LazyImg/LazyImg';
import { ShareOptions } from '@ossinsight/ui/src/components/ShareBlock';

import '@ossinsight/widget-compose-recent-active-contributors/metadata';
import '@ossinsight/widget-compose-recent-active-contributors/params.json';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const defaultTuple: AnalyzeTuple = {
  type: 'repo',
  value: { id: 41986369, fullName: 'pingcap/tidb' },
};

export function WidgetCreator () {
  const [tuple, setTuple] = useState<AnalyzeTuple>(defaultTuple);
  const [widget, setWidget] = useState<string | undefined>('@ossinsight/widget-compose-recent-active-contributors');
  const [shareInfo, setShareInfo] = useState<ShareOptions>();
  const lastType = useRef(tuple.type);
  const router = useRouter();

  const handleGotoWidget = useCallback(() => {
    if (!shareInfo) {
      return undefined;
    }
    router.push(shareInfo.url);
  }, [router, shareInfo]);

  const widgets = useMemo(() => {
    let tag: string | undefined;
    switch (tuple.type) {
      case 'repo':
        tag = 'Repository';
        break;
      case 'user':
        tag = 'Developer';
        break;
    }
    return filteredWidgetsNames({ search: '', tag: tag });
  }, [tuple.type]);

  useEffect(() => {
    if (lastType.current !== tuple.type) {
      setWidget(undefined);
    }
    lastType.current = tuple.type;
  }, [tuple.type]);

  return (
    <div>
      <div className="max-w-screen-md mx-auto flex flex-col sm:items-end sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-xs" htmlFor="analyze-selector">Select a repo or repository</label>
          <AnalyzeSelector id="analyze-selector" tuple={tuple} onTupleChange={setTuple} />
        </div>
        <div className="flex flex-col flex-1 gap-1 p-1 -m-1 overflow-hidden">
          <label className="text-xs" htmlFor="widget-selector">Select a repo or repository</label>
          <Select
            key={tuple.type}
            value={widget}
            onValueChange={setWidget}
            placeholder="Select a widget..."
            position="popper"
            renderValue={widget => (
              <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                <WidgetName widget={widget} />
              </span>
            )}
          >
            {widgets.map(widget => (
              <SelectItem value={widget} key={widget}>
                <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  <WidgetName widget={widget} />
                </span>
              </SelectItem>
            ))}
          </Select>
        </div>
        <Button className="Button Button-primary" disabled={!widget || !tuple.value} onClick={handleGotoWidget}>
          Generate Widget
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-8 skeleton-paused lg:flex-row">
        <div className="flex-1 rounded border p-4 bg-toolbar border-dimmed">
          <MockMarkdown>
            <div className="lg:min-h-[240px]">
              {shareInfo
                ? (
                  <LazyImg
                    className="block"
                    alt={shareInfo.title}
                    src={shareInfo.thumbnailUrl}
                    width={shareInfo.imageWidth}
                    height="auto"
                    fallback={<div className="my-2 p-4 rounded bg-toolbar">Loading Widget Image...</div>}
                  />
                )
                : tuple.value != null
                  ? <div className="my-2 p-4 rounded bg-toolbar">Loading Widget Image...</div>
                  : <div className="my-2 p-4 rounded bg-toolbar">Please select a {tuple.type}</div>
              }
            </div>
          </MockMarkdown>
        </div>
        <div className="flex-1 overflow-auto">
          <Code name={widget} tuple={tuple} onPrepared={setShareInfo} />
        </div>
      </div>
    </div>
  );
}
