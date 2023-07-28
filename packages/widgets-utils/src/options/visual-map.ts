import type { VisualMapComponentOption } from 'echarts';
// import { isSmall } from './sizes';

export function visualMap (min: number, max: number): VisualMapComponentOption {
  return {
    // show: !isSmall(), // TODO
    min: 0,
    max,
    orient: 'horizontal',
    left: 'center',
    bottom: 8,
  };
}
