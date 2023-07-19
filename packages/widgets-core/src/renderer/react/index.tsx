import { lazy } from 'react';

const ECharts = lazy(() => import('./echarts'));

export interface WidgetVisualizationProps {
  type: string;
  visualizer: any;
  data: any;
  parameters: any;
}

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
