import { cloneElement, lazy } from 'react';
import { WidgetReactVisualizationProps } from '../../types';

const ReactHtml = lazy(() => import('./react-html'));
const ECharts = lazy(() => import('./echarts'));

export default function WidgetVisualization ({ dynamicHeight, ...props }: WidgetReactVisualizationProps) {
  let el;
  switch (props.type) {
    case 'echarts':
      el = <ECharts {...props} />;
      break;
    case 'react-html':
      el = <ReactHtml {...props} />;
      break;
    default:
      throw new Error(`visualize type '${props.type}' not supported.`);
  }

  if (dynamicHeight) {
    el = (
      <div className="overflow-x-hidden overflow-y-auto h-full w-full">
        {cloneElement(el, { ...props, style: { ...props.style, height: dynamicHeight } })}
      </div>
    );
  }

  return el;
}
