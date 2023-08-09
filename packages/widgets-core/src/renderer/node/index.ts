import { LinkedData } from '../../parameters/resolver';
import { WidgetVisualizationProps } from '../../types';

export interface NodeWidgetVisualizationProps extends WidgetVisualizationProps {
  linkedData: LinkedData;
  width: number;
  height: number;
  dpr: number;
}

export default async function render ({ type, width, height, dpr, visualizer, parameters, data, linkedData }: NodeWidgetVisualizationProps) {
  switch (type) {
    case 'echarts':
      return await import('./echarts').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData));
    case 'react-svg':
      return await import('./react-svg').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData));
    case 'compose':
      return await import('./compose').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData));
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }
}