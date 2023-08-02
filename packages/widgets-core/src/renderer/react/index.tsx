import { cloneElement, lazy } from 'react';
import { WidgetReactVisualizationProps } from '../../types';
import Svg from './react-svg';

const ECharts = lazy(() => import('./echarts'));
export default function WidgetVisualization ({ dynamicHeight, ...props }: WidgetReactVisualizationProps) {
  let el;
  switch (props.type) {
    case 'echarts':
      el = <ECharts {...props} />;
      break;
    case 'react-svg':
      el = <Svg {...props} />;
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
