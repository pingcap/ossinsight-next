import { LinkedData } from '../../parameters/resolver';
import { WidgetVisualizationProps } from '../../types';

export interface NodeWidgetVisualizationProps extends WidgetVisualizationProps {
  linkedData: LinkedData;
  width: number;
  height: number;
  dpr: number;
  colorScheme?: string;
  sizeName?: string;
}

export default async function render ({ type, width, height, dpr, visualizer, parameters, data, linkedData, colorScheme, sizeName }: NodeWidgetVisualizationProps) {
  switch (type) {
    case 'echarts':
      return await import('./echarts').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData, colorScheme));
    case 'react-svg':
      return await import('./react-svg').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData, colorScheme));
    case 'compose':
      return await import('./compose').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData, colorScheme, sizeName));
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }
}