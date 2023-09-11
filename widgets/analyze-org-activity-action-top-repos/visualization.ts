import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

import { simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  owner_id: string;
  activity?: string;
};

type IssueCommentsDataPoint = {
  repo_id: number;
  repo_name: string;
  issues: number;
  comments: number;
  comments_per_issue: number;
};

type DataPoint = IssueCommentsDataPoint;

type Input = [DataPoint[], undefined];

const handleInputData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'issues/issue-comments':
    default:
      return data.slice(0, 5).map((d) => ({
        ...d,
        x: d.repo_name.split('/')[1],
      }));
  }
};

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main] = data;
  const activity = ctx.parameters.activity ?? 'issues/issue-comments';

  return {
    dataset: {
      id: 'main',
      source: handleInputData(main, activity),
    },
    grid: simpleGrid(2, true),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'Issues',
        type: 'bar',
        encode: {
          x: 'x',
          y: 'issues',
        },
      },
      {
        name: 'Comments',
        type: 'bar',
        encode: {
          x: 'x',
          y: 'comments',
        },
      },
      {
        name: 'Comments per Issue',
        type: 'line',
        encode: {
          x: 'x',
          y: 'comments_per_issue',
        },
      },
    ],
  };
}

export const type = 'echarts';
