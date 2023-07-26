import { GridOption } from 'echarts/types/dist/shared';
import { OptionId } from 'echarts/types/src/util/types';

export function grid(id: OptionId, option: GridOption = {}): GridOption {
  return {
    top: 32,
    left: 8,
    right: 16,
    containLabel: true,
    ...option,
    id,
  };
}

export function topBottomLayoutGrid(vs?: boolean) {
  if (!vs) return grid('main');
  return [
    {
      ...grid('main'),
      bottom: '55%',
    },
    {
      ...grid('vs'),
      top: '55%',
    },
  ];
}
