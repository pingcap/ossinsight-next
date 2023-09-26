import { createWidget } from '@/components/EmbeddedWidget/createWidget';
import { useShouldLoadWidget } from '@/components/EmbeddedWidget/PerformanceWidgetsContext';
import Loading from '@/components/Widget/loading';
import { useVisible } from '@/utils/hooks';
import { fetchWidgetData, WidgetData } from '@/utils/widgets';
import dynamic from 'next/dynamic';
import { CSSProperties, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function EmbeddedWidget ({
  className, style, name, params,
}: {
  className?: string;
  style?: CSSProperties;
  name: string;
  params: Record<string, string | string[]>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState<unknown>();
  const [wd, setWd] = useState<WidgetData>();

  const shouldLoadWidget = useShouldLoadWidget();
  const visible = useVisible(ref, false);
  const started = useRef(false);

  // trigger reload widget data
  const reload = useCallback(() => {
    started.current = true;
    void fetchWidgetData(name, params).then(setWd, setErr);
  }, [name, params]);

  // when `name` or `params` changed, data should reload next time.
  useEffect(() => {
    return () => {
      started.current = false;
    };
  }, [reload]);

  useEffect(() => {
    if (started.current) {
      return;
    }
    if (visible && shouldLoadWidget) {
      reload();
    }
  }, [visible, shouldLoadWidget, reload]);

  const Widget = useMemo(() => {
    return dynamic(() => createWidget(name), { ssr: false, loading: Loading });
  }, [name]);

  let el: ReactElement;

  if (wd) {
    return <Widget ref={ref} className={className} style={style} name={name} data={wd.data} linkedData={wd.linkedData} params={wd.parameters} />;
  } else {
    return <Loading ref={ref} />;
  }
}