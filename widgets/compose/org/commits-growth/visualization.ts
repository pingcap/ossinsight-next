import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

type Params = {
  owner_id: string;
  activity?: string;
  period?: string;
};

type StarDataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type ParticipantDataPoint = StarDataPoint;

type CommitDataPoint = {
  idx: number;
  day: string;
  pushes: number;
  commits: number;
};

type PRReviewDataPoint = StarDataPoint;

type DataPoint =
  | StarDataPoint
  | ParticipantDataPoint
  | CommitDataPoint
  | PRReviewDataPoint;

type Input = [DataPoint[]];

const handleData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'commits':
      const [pushesSum, commitsSum] = (data as CommitDataPoint[]).reduce(
        (acc, cur) => {
          acc[0] += cur.pushes;
          acc[1] += cur.commits;
          return acc;
        },
        [0, 0]
      );
      const diff2 = (commitsSum / pushesSum) * 100;
      return {
        title: 'Code Submission Count Over Time',
        data: data.sort((a, b) => b.idx - a.idx),
        label: commitsSum,
        // value: `↑${diff2.toFixed(2)}%`,
        value: ' ',
        increase: true,
      };
    case 'reviews/review-prs':
      return {
        title: 'Pull Request Review Over Time',
        data,
        label: ' ',
        value: ' ',
        increase: true,
      };
    case 'stars':
    default:
      const [currentSum, lastSum] = (data as StarDataPoint[]).reduce(
        (acc, cur) => {
          acc[0] += cur.current_period_day_total;
          acc[1] += cur.past_period_day_total;
          return acc;
        },
        [0, 0]
      );
      let tmpTitle = 'Star earned over time';
      if (activity === 'participants') {
        tmpTitle = 'Participants Over Time';
      } else if (activity === 'pull-requests') {
        tmpTitle = 'Pull Requests Over Time';
      }
      const diff = currentSum - lastSum;
      return {
        title: tmpTitle,
        data,
        label: currentSum,
        value: diff >= 0 ? `↑${diff}%` : `↓${diff}%`,
        increase: diff >= 0,
      };
  }
};

export default function (
  [data]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 16;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;
  const HORIZONTAL_SPACING = 64;

  const { activity = 'stars' } = ctx.parameters || {};

  const {
    data: handledData,
    label,
    value,
    increase,
    title,
  } = handleData(data, activity);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: title,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label,
            value,
            labelProps: {
              style: {
                fontSize: 24,
                fontWeight: 'bold',
              },
            },
            valueProps: {
              style: {
                fontSize: 12,
                lineHeight: 2,
                color: increase
                  ? ctx.theme.colors.green['400']
                  : ctx.theme.colors.red['400'],
              },
            },
            column: false,
          })
        )
          .gap(SPACING)
          .flex(0.1),
        widget(
          '@ossinsight/widget-analyze-org-recent-stats',
          [handledData],
          ctx.parameters
        ).flex(0.8)
      )
    ).padding([0, PADDING, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const grid = {
  cols: 12,
  rows: 4,
}