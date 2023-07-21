import { lazy } from 'react';
import { WidgetVisualizationProps } from '../../types';

const ECharts = lazy(() => import('./echarts'));


export default function WidgetVisualization ({ type, visualizer, parameters, data, onSizeChange }: WidgetVisualizationProps) {
  let el;
  switch (type) {
    case 'echarts':
      el = (
        <ECharts
          data={data}
          visualizer={visualizer}
          parameters={parameters}
          onSizeChange={onSizeChange}
        />
      );
      break;
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }

  return el;
}
