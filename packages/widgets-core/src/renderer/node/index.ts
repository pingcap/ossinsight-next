import { WidgetVisualizationProps } from '../../types';

export interface NodeWidgetVisualizationProps extends WidgetVisualizationProps {
  width: number;
  height: number;
  dpr: number;
}

export default async function render ({ type, width, height, dpr, visualizer, parameters, data }: NodeWidgetVisualizationProps) {
  switch (type) {
    case 'echarts': {
      return await import('./echarts').then(module => module.default(width, height, dpr, visualizer, data, parameters));
    }
    default:
      throw new Error(`visualize type '${type}' not supported.`);
  }
}