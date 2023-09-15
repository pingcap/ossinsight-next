import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  recentStatsChartXAxis,
  recentStatsLineSeries,
  simpleGrid,
  timeAxis,
} from '@ossinsight/widgets-utils/src/options';
import { DateTime } from 'luxon';

type Params = {
  owner_id: string;
  activity?: string;
  period?: string;
};

type PRDataPoint = {
  action_type: 'closed' | 'opened' | 'merged';
  date: string;
  prs: number;
};

type IssueDataPoint = {
  action_type: 'closed' | 'opened';
  date: string;
  issues: number;
};

type DataPoint = PRDataPoint | IssueDataPoint;

type Input = [DataPoint[], DataPoint[] | undefined];

const handleDataset = (data: DataPoint[], activity: string) => {
  const issueInitData = {
    closed: 0,
    opened: 0,
  };
  const prInitData = {
    ...issueInitData,
    merged: 0,
  };
  switch (activity) {
    case 'issues':
      const issueMergedData = (data as IssueDataPoint[]).reduce(
        (acc, cur) => {
          const { date, action_type, issues } = cur;
          if (acc.hasOwnProperty(date)) {
            acc[date][action_type] = issues;
          } else {
            acc[date] = {
              date,
              ...issueInitData,
              [action_type]: issues,
            };
          }
          return acc;
        },
        {} as {
          [key: string]: {
            date: string;
            closed?: number;
            opened?: number;
            merged?: number;
          };
        }
      );
      return Object.values(issueMergedData);
    case 'pull-requests':
    default:
      const mergedData = (data as PRDataPoint[]).reduce(
        (acc, cur) => {
          const { date, action_type, prs } = cur;
          if (acc.hasOwnProperty(date)) {
            acc[date][action_type] = prs;
          } else {
            acc[date] = {
              date,
              ...prInitData,
              [action_type]: prs,
            };
          }
          return acc;
        },
        {} as {
          [key: string]: {
            date: string;
            closed?: number;
            opened?: number;
            merged?: number;
          };
        }
      );
      return Object.values(mergedData);
  }
};

const getSeries = (activity: string): any => {
  switch (activity) {
    case 'issues':
      return ['closed', 'opened'].map((action_type, idx) => {
        return {
          type: 'line',
          encode: {
            x: 'date',
            y: action_type,
          },
          smooth: true,
          showSymbol: false,
          name: action_type,
        };
      });
    case 'pull-requests':
    default:
      return ['closed', 'opened', 'merged'].map((action_type, idx) => {
        return {
          type: 'line',
          encode: {
            x: 'date',
            y: action_type,
          },
          smooth: true,
          showSymbol: false,
          name: action_type,
        };
      });
  }
};

export default function (
  data: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const [main, vs] = data;
  const { activity = 'pull-requests' } = ctx.parameters ?? {};

  return {
    dataset: {
      id: 'main',
      source: handleDataset(main, activity),
    },
    xAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        formatter: (value: string) => {
          return `${DateTime.fromJSDate(new Date(value)).toFormat(
            'MM-dd-yyyy'
          )}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      show: true,
    },
    grid: {
      left: 2,
      top: 30,
      right: 2,
      bottom: 2,
      containLabel: true,
    },
    series: getSeries(activity),
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    legend: {
      show: true,
      type: 'scroll',
      orient: 'horizontal',
      top: 0,
      left: 0,
      textStyle: {
        color: ctx.theme.colorScheme === 'light' ? 'black' : 'white',
      },
    },
  };
}

export const type = 'echarts';

export const height = 216;
export const width = 648;
