import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { axisTooltip, simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  owner_id: string;
};

type DataPoint = {
  repos: number;
  engagements: number;
  participants: number;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.parameters.owner_id;
  const vs = ctx.parameters.owner_id;

  const [data] = input;

  // const { maxRpos, maxEngagements, maxParticipants } = input.flat().reduce(
  //   (prev, current) => {
  //     return {
  //       maxRpos: Math.max(prev.maxRpos, current?.repos || 0),
  //       maxEngagements: Math.max(
  //         prev.maxEngagements,
  //         current?.engagements || 0
  //       ),
  //       maxParticipants: Math.max(
  //         prev.maxParticipants,
  //         current?.participants || 0
  //       ),
  //     };
  //   },
  //   { maxRpos: 0, maxEngagements: 0, maxParticipants: 0 }
  // );

  return {
    dataset: [
      {
        id: 'main',
        source: data,
      },
    ],
    xAxis: {
      name: 'engagements',
      splitLine: { show: false },
    },
    yAxis: {
      name: 'repos',
      splitLine: { show: false },
    },
    grid: simpleGrid(8, true),
    series: {
      type: 'scatter',
      encode: {
        x: 'engagements',
        y: 'repos',
      },
      symbolSize: 15,
      itemStyle: {
        borderColor: '#555',
      },
      id: 'main',
    },
    tooltip: {
      show: false,
    },
    legend: {
      show: true,
      top: '6%',
    },
  };
}

export const type = 'echarts';
