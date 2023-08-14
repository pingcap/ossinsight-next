'use client';

import { visualizers } from '@ossinsight/widgets';
import { ComposeVisualizationConfig, VisualizerModule } from '@ossinsight/widgets-types';
import { cloneElement, use, useEffect, useMemo, useRef, useState } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createWidgetContext } from '../../utils/context';
import { CardHeading, Label, LabelValue, AvatarLabel } from './builtin';
import render from './index';

interface ComposeComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'compose', ComposeVisualizationConfig, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

const dpr = typeof devicePixelRatio === 'number' ? devicePixelRatio : 2;

export default function ComposeComponent ({ className, style, data, visualizer, parameters, linkedData }: ComposeComponentProps) {
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
    const { width, height } = size;
    return visualizer.default(data, {
      ...createWidgetContext('client', parameters, linkedData),
      width,
      height,
      dpr,
    });
  }, [size.width, size.height, dpr]);

  const itemNames = useMemo(() => {
    return items.map(i => i.widget).join(',');
  }, []);

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
      ref={containerRef}
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
        background: 'rgb(31, 30, 40)',
        boxShadow: '0px 4px 4px 0px rgba(36, 39, 56, 0.25)',
      }}
    >
      {items.map(({ parameters, widget, data, ...props }, i) => {
        switch (widget) {
          case 'builtin:label-value':
            return <LabelValue key={i} className="absolute" style={{ ...props, zIndex: 1 }} label={parameters.label} value={parameters.value} />;
          case 'builtin:card-heading':
            return <CardHeading key={i} className="absolute" style={props} title={parameters.title} subtitle={parameters.subtitle} />;
          case 'builtin:label':
            return <Label key={i} className="absolute" style={props} label={parameters.label} />;
          case 'builtin:avatar-label':
            return (
              <AvatarLabel
                key={i}
                className='absolute'
                style={props}
                label={parameters.label}
                imgSrc={parameters.imgSrc}
              />
            );
          default: {
            const el = render({
              dynamicHeight: undefined,
              className: undefined,
              style: props,
              parameters,
              linkedData,
              type: resolvedVisualizers[i]!.type,
              visualizer: resolvedVisualizers[i]!,
              data,
            });

            return cloneElement(el, {
              ...el.props,
              key: i,
              style: {
                position: 'absolute',
                ...el.props.style,
              },
            });
          }
        }
      })}
    </div>
  );
}
