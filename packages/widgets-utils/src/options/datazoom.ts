import type { EChartsOption } from 'echarts';
// import { isSmall } from './sizes';
import { template } from './utils';

// TODO
function isSmall() {
  return false;
}

export function dataZoom(
  option: EChartsOption['dataZoom'] = undefined,
  vs?: boolean
): EChartsOption['dataZoom'] {
  if (isSmall()) {
    return { show: false };
  }

  return {
    show: true,
    left: 8,
    right: 8,
    realtime: true,
    xAxisId: template(({ id }) => id, vs),
    ...option,
  };
}
