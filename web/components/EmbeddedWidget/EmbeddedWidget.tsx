import { usePerformanceOptimizedNetworkRequest } from '@/components/Analyze/Table/utils';
import { LinkedDataContext } from '@/components/Context/LinkedData';
import { createWidget } from '@/components/EmbeddedWidget/createWidget';
import Loading from '@/components/Widget/loading';
import { fetchWidgetData } from '@/utils/widgets';
import { Scale } from '@ossinsight/ui/src/components/transitions';
import { CSSProperties, lazy, Suspense, useContext, useMemo } from 'react';

export function EmbeddedWidget ({
  className, style, name, params,
}: {
  className?: string;
  style?: CSSProperties;
  name: string;
  params: Record<string, string | string[]>;
}) {

  const linkedData = useContext(LinkedDataContext);
  const {
    result: wd,
    ref,
  } = usePerformanceOptimizedNetworkRequest(
    fetchWidgetData,
    name, params, linkedData,
  );

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