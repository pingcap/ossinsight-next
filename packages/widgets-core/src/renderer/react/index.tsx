import clsx from 'clsx';
import { cloneElement, lazy } from 'react';
import { WidgetReactVisualizationProps } from '../../types';
import Svg from './react-svg';

const ECharts = lazy(() => import('./echarts'));
const Compose = lazy(() => import('./compose'));
export default function WidgetVisualization ({ dynamicHeight, width, height, ...props }: WidgetReactVisualizationProps & { width: number, height: number }) {
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

  const realWidth = props.visualizer.width ?? width;
  const realHeight = dynamicHeight ?? props.visualizer.height ?? height;

  el = (
    <div
      className={clsx('w-full h-full overflow-auto', !dynamicHeight && 'flex items-center justify-center' )}
      style={{
        background: 'radial-gradient(50.4% 48.07% at 50.4% 51.93%, #6760A4 0%, rgb(31,30,40) 100%)',
      }}
    >
      <div className='m-4 w-max h-max shadow-lg mx-auto max-w-full overflow-auto'>
        {cloneElement(el, {
          ...el.props,
          style: {
            ...el.props.style,
            width: realWidth,
            height: realHeight,
            borderRadius: 12,
          }
        })}
      </div>
    </div>
  );

  return el;
}
