import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

import { simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  repo_id: string;
  activity?: string;
};

type PRMergedDataPoint = {
  current_period_percentage: number;
  current_period_prs: number;
  past_period_percentage: number;
  past_period_prs: number;
  percentage_change: number;
  type: 'others-merged' | 'un-merged' | 'self-merged';
};

type IssueClosedDataPoint = {
  current_period_opened_issues: number;
  current_period_closed_issues: number;
  current_period_closed_ratio: number;
  past_period_opened_issues: number;
  past_period_closed_issues: number;
  past_period_closed_ratio: number;
  closed_ratio_change: number;
};

type DataPoint = PRMergedDataPoint | IssueClosedDataPoint;

type Input = [DataPoint[], undefined];

const handleData = (items: DataPoint[], activity: string) => {
  switch (activity) {
    case 'issues/closed':
      return [
        {
          name: 'Closed Issues',
          value: (items as IssueClosedDataPoint[])[0]
            .current_period_closed_issues,
          itemStyle: styleMap[0].itemStyle,
        },
        {
          name: 'Opened Issues',
          value: (items as IssueClosedDataPoint[])[0]
            .current_period_opened_issues,
          itemStyle: styleMap[1].itemStyle,
        },
      ];
    case 'pull-requests/merged':
    default:
      return items.map((item, idx) => {
        const prMergedData = item as PRMergedDataPoint;
        return {
          name: prMergedData.type,
          value: prMergedData.current_period_prs,
          itemStyle: styleMap[idx].itemStyle,
        };
      });
  }
};

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;
  const activity = ctx.parameters.activity ?? 'pull-requests/merged';

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
        data: handleData(main, activity),
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
