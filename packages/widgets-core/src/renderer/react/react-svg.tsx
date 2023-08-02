import { VisualizerModule } from '@ossinsight/widgets-types';
import clsx from 'clsx';
import { cloneElement, ReactElement } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createWidgetContext } from '../../utils/context';

interface SvgComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'svg', ReactElement, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

export default function Svg ({ visualizer, data, parameters, linkedData, className, style }: SvgComponentProps) {
  const el = visualizer.default(data, {
    width: 0,
    height: 0,
    ...createWidgetContext('client', parameters, linkedData),
  });

  return (
    <div className='w-full h-full flex items-center justify-center'>
      {cloneElement(el, {
        className: clsx(el.props.className, className),
        style: {
          ...el.props.style,
          ...style,
        },
      })}
    </div>
  );
}
