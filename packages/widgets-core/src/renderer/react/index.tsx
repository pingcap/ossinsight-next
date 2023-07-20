import { lazy } from 'react';
import { WidgetVisualizationProps } from '../../types';

const ECharts = lazy(() => import('./echarts'));


export default function WidgetVisualization ({ type, visualizer, parameters, data }: WidgetVisualizationProps) {
  let el;
  switch (type) {
    case 'echarts':
      el = <ECharts data={data} visualizer={visualizer} parameters={parameters} />;
      break;
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }

  return el;
}
