'use client';

import { visualizers } from '@ossinsight/widgets';
import { ComposeVisualizationConfig, VisualizerModule } from '@ossinsight/widgets-types';
import mergeRefs from 'merge-refs';
import { cloneElement, createElement, ForwardedRef, forwardRef, ReactElement, use, useEffect, useMemo, useRef, useState } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createVisualizationContext, createWidgetContext } from '../../utils/context';
import { Builtin } from './builtin';
import render from './index';

interface ComposeComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'compose', ComposeVisualizationConfig, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

const dpr = typeof devicePixelRatio === 'number' ? devicePixelRatio : 2;

export default forwardRef(function ComposeComponent ({ className, style, data, visualizer, parameters, linkedData, colorScheme }: ComposeComponentProps, ref: ForwardedRef<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => ({
    width: visualizer.width ?? 0,
    height: visualizer.height ?? 0,
  }));

  const fixedSize = !!(visualizer.width && visualizer.height);

  useEffect(() => {
    if (visualizer.width && visualizer.height) {
      return;
    }
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({
        width,
        height,
      });
    });
    ro.observe(containerRef.current!);
    return () => {
      ro.disconnect();
    };
  }, []);

  const items = useMemo(() => {
    return visualizer.default(data, {
      ...createVisualizationContext({ ...size, dpr, colorScheme }),
      ...createWidgetContext('client', parameters, linkedData),
    });
  }, [size, dpr, data, colorScheme]);

  const itemNames = useMemo(() => {
    return items.map(i => i.widget).join(',');
  }, [items]);

  const visualizerPromise = useMemo(() => {
    return Promise.all(items.map(item => {
      if (item.widget.startsWith('builtin:')) {
        return undefined;
      }
      return visualizers[item.widget]();
    }));
  }, [itemNames]);

  const resolvedVisualizers = use(visualizerPromise);

  return (
    <div
      ref={mergeRefs(containerRef, ref)}
      className={className}
      style={{
        ...style,
        position: 'relative',
        ...(fixedSize && {
          width: visualizer.width,
          height: visualizer.height,
        }),
        borderRadius: 18,
        overflow: 'hidden',
        background: colorScheme === 'light' ? 'white' : 'rgb(36, 35, 49)',
        boxShadow: '0px 4px 4px 0px rgba(36, 39, 56, 0.25)',
      }}
    >
      {items.map(({ parameters, widget, data, ...props }, i) => {
        if (widget.startsWith('builtin:')) {
          return <Builtin key={i} className="absolute" style={props} name={widget as any} colorScheme={colorScheme}  {...parameters} />;
        } else {
          const el = createElement(render, {
            dynamicHeight: undefined,
            className: undefined,
            style: props,
            parameters,
            linkedData,
            type: resolvedVisualizers[i]!.type,
            visualizer: resolvedVisualizers[i]!,
            data,
            colorScheme,
          });

          return cloneElement(el, {
            ...el.props,
            key: i,
            style: {
              ...el.props.style,
              position: 'absolute',
            },
          });
        }
      })}
    </div>
  );
})
