'use client';

import { Code, CodeLoading, CodePending } from '@/components/Widget/Code';
import { useWidgetShareInfo } from '@/components/Widget/hooks';
import { MockMarkdown } from '@/components/Widget/MockMarkdown';
import { WidgetName } from '@/components/Widget/WidgetName';
import { filteredWidgetsNames } from '@/utils/widgets';
import { Select, SelectItem } from '@ossinsight/ui';
import { AnalyzeSelector, AnalyzeTuple } from '@ossinsight/ui/src/components/AnalyzeSelector';
import LazyImg from '@ossinsight/ui/src/components/LazyImg/LazyImg';

import '@ossinsight/widget-compose-recent-active-contributors/metadata';
import '@ossinsight/widget-compose-recent-active-contributors/params.json';

import CheckCircleFillIcon from 'bootstrap-icons/icons/check-circle-fill.svg';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

const defaultTuple: AnalyzeTuple = {
  type: 'repo',
  value: { id: 41986369, fullName: 'pingcap/tidb', defaultBranch: 'master' },
};

export function WidgetCreator ({ className }: { className?: string }) {
  const [tuple, setTuple] = useState<AnalyzeTuple>(defaultTuple);
  const [widget, setWidget] = useState<string | undefined>('@ossinsight/widget-compose-recent-active-contributors');
  const lastType = useRef(tuple.type);

  const { shareInfo, params, loading, editReadmeUrl } = useWidgetShareInfo(widget, tuple);

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
    <div className={className}>
      <div className="max-w-screen-md mx-auto flex flex-col sm:items-end sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-1">
          <label className="text-xs flex gap-1" htmlFor="analyze-selector">
            <CheckCircleFillIcon width={10} heigit={10} className="text-[#4A65C6]" />
            Input your repository/user name
          </label>
          <AnalyzeSelector id="analyze-selector" tuple={tuple} onTupleChange={setTuple} />
        </div>
        <div className="flex flex-col flex-1 gap-1 p-1 -m-1 overflow-hidden">
          <label className="text-xs flex gap-1" htmlFor="widget-selector">
            <CheckCircleFillIcon width={10} heigit={10} className="text-[#4A65C6]" />
            Select a widget type
          </label>
          <Select
            id="widget-selector"
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
      </div>
      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 rounded border p-4 bg-toolbar border-dimmed">
          <MockMarkdown className="skeleton-paused">
            <div>
              {shareInfo
                ? (
                  <LazyImg
                    className="block"
                    alt={shareInfo.title}
                    src={shareInfo.thumbnailUrl}
                    width={shareInfo.imageWidth}
                    height="auto"
                    fallback={<ImagePendingShell>Loading Widget Image...</ImagePendingShell>}
                  />
                )
                : loading
                  ? <ImagePendingShell>Loading Widget Image...</ImagePendingShell>
                  : <ImagePendingShell>Please select a {tuple.type}</ImagePendingShell>
              }
            </div>
          </MockMarkdown>
        </div>
        <div className="flex-1 overflow-auto">
          {shareInfo
            ? <Code shareInfo={shareInfo} editReadmeUrl={editReadmeUrl} />
            : loading
              ? <CodeLoading />
              : <CodePending type={tuple.type} />}
        </div>
      </div>
    </div>
  );
}

function ImagePendingShell ({ children, height }: { children: ReactNode, height?: number }) {
  return (
    <div className="h-48 my-2 rounded-lg border bg-toolbar flex items-center justify-center text-sm text-disabled" style={{ height }}>
      {children}
    </div>
  );
}
