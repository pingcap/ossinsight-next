import type { EChartsVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';

type Params = {
  repo_id: string
  vs_repo_id?: string
}

type DataPoint = {
  count: number
  event_month: string
}

type Input = [DataPoint[], (DataPoint[]) | undefined]

export default function (data: Input, ctx: WidgetVisualizerContext<Params>): EChartsVisualizationConfig {
  const [main, vs] = data;

  return {
    dataset: {
      source: main,
    },
    grid: {
      top: 16,
      bottom: 16,
      left: 8,
      right: 16,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: format,
      },
    },
    series: {
      type: 'line',
      encode: {
        x: 'event_month',
        y: 'total',
      },
      color: ctx.theme.colors.red['400'],
      lineStyle: {},
      showSymbol: false,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
  };
}

const units = ['', 'k', 'm', 'b'];

function format (value: number) {
  if (value === 0) {
    return '0';
  }
  let i = 0;
  while (value % 1000 === 0 && i < units.length) {
    value = value / 1000;
    i++;
  }

  return `${value}${units[i]}`;
}

export const type = 'echarts';
