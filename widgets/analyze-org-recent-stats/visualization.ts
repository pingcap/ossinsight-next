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
  activity?: 'stars' | 'participants' | 'commits';
};

type StarDataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type ParticipantDataPoint = {
  day: string;
  active_participants: number;
  new_participants: number;
};

type CommitDataPoint = {
  idx: number;
  day: string;
  pushes: number;
  commits: number;
};

type DataPoint = StarDataPoint | ParticipantDataPoint | CommitDataPoint;

type Input = [DataPoint[], DataPoint[] | undefined];

const handleData = (
  data: DataPoint[],
  activity: 'stars' | 'participants' | 'commits'
) => {
  switch (activity) {
    case 'participants':
      const source2 = data as ParticipantDataPoint[];
      const mainSeries2 = {
        encode: {
          x: 'day',
          y: 'active_participants',
        },
      };
      const vsSeries2 = {
        encode: {
          x: 'day',
          y: 'new_participants',
        },
      };
      return {
        source: source2,
        mainSeries: mainSeries2,
        vsSeries: vsSeries2,
      };
    case 'commits':
      const source3 = (data as CommitDataPoint[]).reverse();
      const mainSeries3 = {
        encode: {
          x: 'day',
          y: 'commits',
        },
      };
      const vsSeries3 = {
        encode: {
          x: 'day',
          y: 'pushes',
        },
      };
      return {
        source: source3,
        mainSeries: mainSeries3,
        vsSeries: vsSeries3,
      };
    case 'stars':
    default:
      const source1 = [
        ...(data as StarDataPoint[]).sort((a, b) => b.idx - a.idx),
      ];
      const mainSeries1 = {
        encode: {
          x: 'idx',
          y: 'current_period_day_total',
        },
      };
      const vsSeries1 = {
        encode: {
          x: 'idx',
          y: 'past_period_day_total',
        },
      };
      return {
        source: source1,
        mainSeries: mainSeries1,
        vsSeries: vsSeries1,
      };
  }
};

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;
  const { activity = 'stars' } = ctx.parameters;

  const { source, mainSeries, vsSeries } = handleData(main, activity);

  return {
    dataset: {
      source,
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
          // x: 'idx',
          // y: 'current_period_day_total',
          ...mainSeries.encode,
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
          // x: 'idx',
          // y: 'past_period_day_total',
          ...vsSeries.encode,
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
