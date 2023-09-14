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
  current_period_issues: number;
  current_period_percentage: number;
  past_period_issues: number;
  past_period_percentage: number;
  percentage_change: number;
  type: 'un-closed' | 'self-closed' | 'others-closed';
};

type ReviewedDataPoint = {
  type: 'reviewed' | 'un-reviewed';
  current_period_prs: number;
  current_period_percentage: number;
  past_period_prs: number;
  past_period_percentage: number;
  percentage_change: number;
};

type DataPoint = PRMergedDataPoint | IssueClosedDataPoint | ReviewedDataPoint;

type Input = [DataPoint[], undefined];

const handleData = (items: DataPoint[], activity: string) => {
  switch (activity) {
    case 'issues/closed':
      return items.map((item, idx) => {
        const issueClosedData = item as IssueClosedDataPoint;
        return {
          name: issueClosedData.type,
          value: issueClosedData.current_period_issues,
          itemStyle: styleMap[idx].itemStyle,
        };
      });
    case 'reviews/reviewed':
      return items.map((item, idx) => {
        const reviewedData = item as ReviewedDataPoint;
        return {
          name: reviewedData.type,
          value: reviewedData.current_period_prs,
          itemStyle: styleMap[idx].itemStyle,
        };
      });
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
    grid: simpleGrid(2),
    legend: {
      left: 'center',
      bottom: '0%',
      itemWidth: 5,
      itemHeight: 5,
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
