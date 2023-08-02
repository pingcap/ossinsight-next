import { VisualizerModule } from '@ossinsight/widgets-types';
import { ImageResponse } from 'next/server';
import { createElement } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';

export default function renderReactHTML (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData) {
  const vdom = visualizer.default(data, {
    width,
    height,
    ...createWidgetContext('server', parameters, linkedData),
  });

  return new ImageResponse((
    createElement('div', {
      style: {
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        fontSize: 12,
        padding: 8,
        backgroundColor: 'rgb(27, 27, 29)',
        color: 'rgb(124, 124, 124)',
      },
      children: vdom,
    })
  ), {
    width,
    height,
  });
}
