import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  autoSize,
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

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

type ParticipantDataPoint = {
  day: string;
  active_participants: number;
  new_participants: number;
};

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
    case 'participants':
      const [activeParticipantsSum, newParticipantsSum] = (
        data as ParticipantDataPoint[]
      ).reduce(
        (acc, cur) => {
          acc[0] += cur.active_participants;
          acc[1] += cur.new_participants;
          return acc;
        },
        [0, 0]
      );
      const diff1 = (newParticipantsSum / activeParticipantsSum) * 100;
      return {
        data,
        label: activeParticipantsSum,
        value: `↑${diff1.toFixed(2)}%`,
        increase: true,
      };
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
        data,
        label: commitsSum,
        // value: `↑${diff2.toFixed(2)}%`,
        value: ' ',
        increase: true,
      };
    case 'reviews/review-prs':
      return {
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
      const diff = currentSum - lastSum;
      return {
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
  } = handleData(data, activity);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: `${ctx.parameters?.activity} overtime`,
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
        )
      )
    ).padding([0, PADDING, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 988;
export const height = 389;
