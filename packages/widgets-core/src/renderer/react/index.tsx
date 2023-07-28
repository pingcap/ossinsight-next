import { lazy } from 'react';
import { WidgetReactVisualizationProps } from '../../types';

const ECharts = lazy(() => import('./echarts'));

export default function WidgetVisualization ({ ...props }: WidgetReactVisualizationProps) {
  let el;
  switch (props.type) {
    case 'echarts':
      el = <ECharts {...props} />;
      break;
    default:
      throw new Error(`visualize type '${props.type}' not supported.`);
  }

  return el;
}
