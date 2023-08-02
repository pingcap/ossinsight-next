import { VisualizerModule } from '@ossinsight/widgets-types';
import { ReactElement, useMemo, useRef } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createWidgetContext } from '../../utils/context';

export interface ReactHtmlComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'react-html', ReactElement, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

function ReactHtml ({ className, style, data, visualizer, parameters, linkedData }: ReactHtmlComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const vdom = useMemo(() => {
    return visualizer.default(data, {
      width: 0,
      height: 0,
      ...createWidgetContext('client', parameters, linkedData),
    });
  }, [data, visualizer, parameters]);

  return (
    <div ref={containerRef}>
      {vdom}
    </div>
  );
}

export default ReactHtml;
