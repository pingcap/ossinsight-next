import { LinkedDataContext } from '@/components/Context/LinkedData';
import { createWidget } from '@/components/EmbeddedWidget/createWidget';
import { useShouldLoadWidget } from '@/components/EmbeddedWidget/PerformanceWidgetsContext';
import Loading from '@/components/Widget/loading';
import { useVisible } from '@/utils/hooks';
import { fetchWidgetData, WidgetData } from '@/utils/widgets';
import { Scale } from '@ossinsight/ui/src/components/transitions';
import { CSSProperties, lazy, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeCallback } from './useSafeCallback';

export function EmbeddedWidget ({
  className, style, name, params,
}: {
  className?: string;
  style?: CSSProperties;
  name: string;
  params: Record<string, string | string[]>;
}) {
  const [err, setErr] = useState<unknown>();
  const [wd, setWd] = useState<WidgetData>();
  const linkedData = useContext(LinkedDataContext);

  const ref = useRef<HTMLDivElement>(null);
  const shouldLoadWidget = useShouldLoadWidget();
  const visible = useVisible(ref, false);

  const show = shouldLoadWidget && visible;

  const startedReloadAtRef = useRef(0);

  // trigger reload widget data
  const { callback: reload, abort } = useSafeCallback((signal) => {
    startedReloadAtRef.current = Date.now();
    fetchWidgetData(name, params, linkedData, signal).then(setWd, setErr);
  });

  // when `name` or `params` changed, data should reload next time.
  useEffect(() => {
    return () => {
      startedReloadAtRef.current = 0;
    };
  }, []);

  useEffect(() => {
    if (show) {
      if (startedReloadAtRef.current) {
        return;
      }
      reload();
    } else {
      if (Date.now() - startedReloadAtRef.current < 200) {
        abort('dismiss too fast');
        startedReloadAtRef.current = 0;
        return;
      }
    }
  }, [show]);

  const Widget = useMemo(() => {
    return lazy(() => createWidget(name));
  }, [name]);

  if (wd) {
    return (
      <Suspense fallback={<div className={className} style={style} ref={ref}><Loading /></div>}>
        <Scale>
          <Widget ref={ref} className={className} style={style} name={name} data={wd.data} linkedData={wd.linkedData} params={wd.parameters} />
        </Scale>
      </Suspense>
    );
  } else {
    return <div className={className} style={style} ref={ref}><Loading /></div>;
  }
}