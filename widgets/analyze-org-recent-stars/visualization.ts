import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  recentStatsChartXAxis,
  recentStatsLineSeries,
  simpleGrid,
} from '@ossinsight/widgets-utils/src/options';

type Params = {
  owner_id: string;
};

type DataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;

  return {
    dataset: {
      source: [...main.sort((a, b) => b.idx - a.idx)],
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    grid: simpleGrid(2),
    aria: {
      enabled: true,
      decal: {
        show: true,
      },
    },
    series: [
      {
        type: 'bar',
        name: 'Current period',
        encode: {
          x: 'idx',
          y: 'current_period_day_total',
        },
        itemStyle: {
          decal: {
            symbol: 'none',
          },
          borderRadius: [2, 2, 0, 0],
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0.75,
                color: '#ED5C53', // color at 75%
              },
              {
                offset: 1,
                color: '#CE7974', // color at 100%
              },
            ],
          },
        },
      },
      {
        type: 'bar',
        name: 'Last period',
        encode: {
          x: 'idx',
          y: 'past_period_day_total',
        },
        itemStyle: {
          color: '#ED5C53',
          opacity: 0.5,
          borderRadius: [2, 2, 0, 0],
          decal: {
            color: 'rgba(0, 0, 0, 0.8)',
            dashArrayX: [1, 0],
            dashArrayY: [2, 5],
            symbolSize: 1,
            rotation: Math.PI / 6,
          },
        },
      },
    ],
    tooltip: {
      show: false,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
  };
}

export const type = 'echarts';
