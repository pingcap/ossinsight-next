import { VisualizerModule } from '@ossinsight/widgets-types';
import clsx from 'clsx';
import { cloneElement, CSSProperties, ReactElement, useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => ({
    width: 0,
    height: 0,
    dpr: typeof devicePixelRatio === 'number' ? devicePixelRatio : 1,
  }));

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({
        width,
        height,
        dpr: devicePixelRatio,
      });
    });
    ro.observe(containerRef.current!);
    return () => {
      ro.disconnect();
    };
  }, []);

  const el = visualizer.default(data, {
    ...size,
    ...createWidgetContext('client', parameters, linkedData),
  });

  return cloneElement(el, {
    className: clsx(el.props.className, className),
    style: {
      ...el.props.style,
      ...style,
    },
    ref: containerRef
  })
}
