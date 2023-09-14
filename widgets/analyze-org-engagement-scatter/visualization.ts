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
  participant_logins: string;
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
      symbol: (value, params) => {
        return `image://https://github.com/${
          value?.participant_logins?.split(',')[0]
        }.png?size=30`;
      },
    },
    tooltip: {
      show: true,
      formatter: (params) => {
        const { data } = params;
        return `<p>Involved in: <b>${data?.repos} repos</b></p>
        <p>Contribution count: <b>${data?.engagements}</b></p>
        <p>Participants: <b>${data?.participant_logins}</b></p>`;
      },
    },
    legend: {
      show: true,
      top: '6%',
    },
  };
}

export const type = 'echarts';

export const width = 1042;
export const height = 259;
