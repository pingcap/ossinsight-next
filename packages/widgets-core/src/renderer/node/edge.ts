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
    case 'react-html': {
      return await import('./react-html').then(module => module.default(width, height, dpr, visualizer, data, parameters, linkedData));
    }
    default:
      throw new Error(`visualize type '${type}' not supported by edge runtime.`);
  }
}
