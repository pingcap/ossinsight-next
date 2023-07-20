import { WidgetVisualizationProps } from '../../types';

export interface NodeWidgetVisualizationProps extends WidgetVisualizationProps {
  width: number;
  height: number;
}

export default async function render ({ type, width, height, visualizer, parameters, data }: NodeWidgetVisualizationProps) {
  switch (type) {
    case 'echarts': {
      return await import('./echarts').then(module => module.default(width, height, visualizer, data, parameters));
    }
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }
}