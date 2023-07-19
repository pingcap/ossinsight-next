import type { EChartsVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';

type Params = {
  repo_id: string
  vs_repo_id?: string
}

type  DataPoint = {
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
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
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
      }
    }
  };
}

export const type = 'echarts';
