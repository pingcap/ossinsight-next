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

function calcPercentage(data: DataPoint[], activity: string): number {
  let current = 0,
    last = 0;
  if (activity === 'pull-requests-merged') {
    const { current_period_merged_prs, current_period_opened_prs } =
      data[0] as PRItemType;
    current = current_period_merged_prs;
    last = current_period_opened_prs + current_period_merged_prs;
  } else if (activity === 'issues') {
    const { current_period_closed_issues, current_period_opened_issues } =
      data[0] as IssueItemType;
    current = current_period_closed_issues;
    last = current_period_closed_issues + current_period_opened_issues;
  } else {
    throw new Error(`Unknown activity: ${activity}`);
  }
  return (current / last) * 100;
}

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;

  const { current_period_merged_prs, current_period_opened_prs } = main[0];
  const percentage =
    (current_period_merged_prs /
      (current_period_merged_prs + current_period_opened_prs)) *
    100;

  const progressSize = Math.min(ctx.width || 100, ctx.height || 100) * 0.1;

  return {
    series: [
      {
        type: 'gauge',
        startAngle: 120,
        endAngle: -270,
        min: 0,
        max: 100,
        itemStyle: {
          color: '#5972F8',
          // shadowColor: 'rgba(139, 163, 248, 1)',
          // shadowBlur: 10,
          // shadowOffsetX: 2,
          // shadowOffsetY: 2,
        },
        progress: {
          show: true,
          roundCap: true,
          width: progressSize,
        },
        pointer: { show: false },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: progressSize,
            color: [[1, '#CDD8F5']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: {
          show: false,
        },
        detail: {
          offsetCenter: [0, 0],
          color: '#fff',
          fontSize: 16,
          lineHeight: 21,
          formatter: function (value) {
            return '' + value.toFixed(0) + '%';
          },
        },
        data: [
          {
            value: percentage,
          },
        ],
      },
    ],
  };
}

export const type = 'echarts';
