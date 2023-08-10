import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { axisTooltip, simpleGrid } from '@ossinsight/widgets-utils/src/options';
import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';

type Params = {
  repo_id: string;
};

type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;

  const rich = main.reduce((acc, cur) => {
    acc[cur.actor_login] = {
      height: 40,
      // align: 'left',
      backgroundColor: {
        image: `https://github.com/${cur.actor_login}.png`,
      },
    };
    return acc;
  }, {} as Record<string, any>);

  return {
    dataset: compare(data, (data, name) => ({
      id: name,
      source: data.sort((a, b) => a.events - b.events),
    })),
    grid: simpleGrid(2),
    xAxis: {
      type: 'value',
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
    },
    series: [
      {
        type: 'bar',
        itemStyle: {
          borderRadius: 10,
        },
        encode: {
          x: 'events',
          y: 'actor_login',
        },
        color: {
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0.25,
              color: '#DE631E',
            },
            {
              offset: 1,
              color: '#FFB186',
            },
          ],
        },
      },
    ],
    tooltip: axisTooltip('none'),
  };
}

export const type = 'echarts';
