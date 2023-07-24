import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

type Params = {
  repo_id: string;
};

type DataPoint = {
  idx: number;
  current_period_day: string;
  current_period_merged_day_prs: number;
  current_period_merged_prs: number;
  current_period_opened_day_prs: number;
  current_period_opened_prs: number;
  last_period_day: string;
  last_period_merged_day_prs: number;
  last_period_merged_prs: number;
  last_period_opened_day_prs: number;
  last_period_opened_prs: number;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;

  return {
    dataset: {
      source: [...main.sort((a, b) => a.idx - b.idx)],
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        encode: {
          x: 'current_period_day',
          y: 'current_period_opened_day_prs',
        },
        smooth: true,
        color: ctx.theme.colors.green['400'],
        name: 'Opened',
      },
      {
        type: 'line',
        showSymbol: false,
        encode: {
          x: 'current_period_day',
          y: 'current_period_merged_day_prs',
        },
        smooth: true,
        color: ctx.theme.colors.indigo['400'],
        name: 'Merged',
      },
    ],
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
  };
}

export const type = 'echarts';

export function onSizeChange(
  instance: any,
  result: any,
  width: number,
  height: number
) {
  instance.resize({ width, height });
}
