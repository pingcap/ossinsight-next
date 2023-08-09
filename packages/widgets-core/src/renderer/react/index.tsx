import { cloneElement, lazy } from 'react';
import { WidgetReactVisualizationProps } from '../../types';
import Svg from './react-svg';

const ECharts = lazy(() => import('./echarts'));
const Compose = lazy(() => import('./compose'));
export default function WidgetVisualization ({ dynamicHeight, ...props }: WidgetReactVisualizationProps) {
  let el;
  switch (props.type) {
    case 'echarts':
      el = <ECharts {...props} />;
      break;
    case 'react-svg':
      el = <Svg {...props} />;
      break;
    case 'compose':
      el = <Compose {...props} />;
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
  } else if (props.visualizer.width && props.visualizer.height) {
    // put fixed size widget in center
    el = (
      <div
        className="w-full h-full flex items-center justify-center p-4 overflow-auto"
        style={{
          background: 'radial-gradient(50.4% 48.07% at 50.4% 51.93%, #6760A4 0%, #282734 100%)',
        }}
      >
        {el}
      </div>
    );
  }

  return el;
}
