import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

import { simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  repo_id: string;
  activity?: string;
};

type DataPoint = {
  current_period_percentage: number;
  current_period_prs: number;
  past_period_percentage: number;
  past_period_prs: number;
  percentage_change: number;
  type: 'others-merged' | 'un-merged' | 'self-merged';
};

type Input = [DataPoint[], undefined];

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;

  const { selfMerged, othersMerged, unMerged } = main.reduce((acc, cur) => {
    if (cur.type === 'self-merged') {
      acc.selfMerged = { ...cur };
    }
    if (cur.type === 'others-merged') {
      acc.othersMerged = { ...cur };
    }
    if (cur.type === 'un-merged') {
      acc.unMerged = { ...cur };
    }
    return acc;
  }, {} as Record<'selfMerged' | 'othersMerged' | 'unMerged', DataPoint>);

  const current = 100 - unMerged.current_period_percentage;
  const past = 100 - unMerged.past_period_percentage;
  const diff = current - past;

  return {
    tooltip: {
      trigger: 'item',
      position: 'top',
      formatter: (params) => { 
        const { name, value } = params;
        return `${name}: ${value}`;
      },
    },
    legend: {
      left: 'center',
      bottom: '5%',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: main.map((item, idx) => ({
          name: item.type,
          value: item.current_period_prs,
          itemStyle: styleMap[idx].itemStyle,
        })),
      },
    ],
  };
}

const styleMap = [
  {
    itemStyle: {
      color: '#5D5BCC',
    },
  },
  {
    itemStyle: {
      color: '#252371',
    },
  },
  {
    itemStyle: {
      color: '#ADACFA',
    },
  },
];

export const type = 'echarts';
