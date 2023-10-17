import { VisualizerModule } from '@ossinsight/widgets-types';
import clsx from 'clsx';
import mergeRefs from 'merge-refs';
import { cloneElement, forwardRef, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createVisualizationContext, createWidgetContext } from '../../utils/context';

type StandardSvgVisualizerModule = {
  asyncComponent?: false
} & VisualizerModule<'svg', ReactElement, any, any>;

// Do not support hooks in async renderer
type AsyncSvgVisualizerModule = {
  asyncComponent: true
} & VisualizerModule<'svg', Promise<ReactElement>, any, any>;

type SvgVisualizerModule = AsyncSvgVisualizerModule | StandardSvgVisualizerModule;

interface SvgComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: SvgVisualizerModule;
  parameters: any;
  linkedData: LinkedData;
}

export default forwardRef(function Svg ({ visualizer, data, parameters, linkedData, className, style, colorScheme }: SvgComponentProps, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => ({
    width: 0,
    height: 0,
    dpr: typeof devicePixelRatio === 'number' ? devicePixelRatio : 2,
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

  let el: ReactElement;

  if (visualizer.asyncComponent) {
    const [promiseEl, setPromiseEl] = useState<any>(null);

    const memoEl = useMemo(() => {
      return visualizer.default(data, {
        ...createVisualizationContext({ ...size, colorScheme }),
        ...createWidgetContext('client', parameters, linkedData),
      }) as Promise<ReactElement>;
    }, [data, size]);

    useEffect(() => {
      let aborted = false;

      memoEl.then(res => {
        if (!aborted) {
          setPromiseEl(res);
        }
      });
      return () => {
        aborted = true;
      };
    }, [memoEl]);

    if (!promiseEl) {
      return <svg className={className} style={style} ref={mergeRefs(containerRef, ref) as any} />;
    }

    el = promiseEl;
  } else {
    el = visualizer.default(data, {
      ...createVisualizationContext({ ...size, colorScheme }),
      ...createWidgetContext('client', parameters, linkedData),
    }) as any;
  }

  return cloneElement(el, {
    className: clsx(el.props.className, className),
    style: {
      ...el.props.style,
      ...style,
    },
    ref: mergeRefs(containerRef, ref),
  });
});
