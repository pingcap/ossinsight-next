import { cloneElement, ForwardedRef, forwardRef, lazy, ReactElement } from 'react';
import { WidgetReactVisualizationProps } from '../../types';
import Svg from './react-svg';

const ECharts = lazy(() => import('./echarts'));
const Compose = lazy(() => import('./compose'));



export default forwardRef(function WidgetVisualization ({ dynamicHeight, ...props }: WidgetReactVisualizationProps, ref: ForwardedRef<any>) {
  let el;
  switch (props.type) {
    case 'echarts':
      el = <ECharts ref={ref} {...props} />;
      break;
    case 'react-svg':
      el = <Svg ref={ref} {...props} />;
      break;
    case 'compose':
      el = <Compose ref={ref} {...props} />;
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
})
