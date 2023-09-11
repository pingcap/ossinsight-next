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
  org_id: string;
  activity: string;
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

type ReviewedDataPoint = {
  current_period_opened_prs: number;
  current_period_reviewed_prs: number;
  current_period_reviewed_ratio: number;
  past_period_opened_prs: number;
  past_period_reviewed_prs: number;
  past_period_reviewed_ratio: number;
  reviewed_ratio_change: number;
};

type DataPoint = PRMergedDataPoint | IssueClosedDataPoint | ReviewedDataPoint;

type Input = [DataPoint[]];

const handleInputData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'issues/closed':
      const { current_period_closed_ratio, closed_ratio_change } = (
        data as IssueClosedDataPoint[]
      )[0];
      return {
        title: 'Issues Closed Ratio',
        label: `${(current_period_closed_ratio * 100).toFixed(0)}%`,
        value: `${closed_ratio_change >= 0 ? '↑' : '↓'}${(
          closed_ratio_change * 100
        ).toFixed(0)}%`,
        isIncrease: closed_ratio_change >= 0,
      };
    case 'reviews/reviewed':
      const { current_period_reviewed_ratio, reviewed_ratio_change } = (
        data as ReviewedDataPoint[]
      )[0];
      return {
        title: 'PR Reviewed Ratio',
        label: `${(current_period_reviewed_ratio * 100).toFixed(0)}%`,
        value: `${reviewed_ratio_change >= 0 ? '↑' : '↓'}${(
          reviewed_ratio_change * 100
        ).toFixed(0)}%`,
        isIncrease: reviewed_ratio_change >= 0,
      };
    case 'pull-requests/merged':
    default:
      const { selfMerged, othersMerged, unMerged } = (
        data as PRMergedDataPoint[]
      ).reduce((acc, cur) => {
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
      }, {} as Record<'selfMerged' | 'othersMerged' | 'unMerged', PRMergedDataPoint>);
      const current = 100 - unMerged.current_period_percentage;
      const past = 100 - unMerged.past_period_percentage;
      const diff = current - past;
      return {
        title: 'Pull Requests Merged Ratio',
        label: `${current.toFixed(2)}%`,
        value: `${diff >= 0 ? '↑' : '↓'}${Math.abs(diff).toFixed(2)}%`,
        isIncrease: diff >= 0,
      };
  }
};

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 16;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;
  const HORIZONTAL_SPACING = 64;

  const data = input[0];
  const activity = ctx.parameters?.activity || 'pull-requests/merged';

  const { title, label, value, isIncrease } = handleInputData(data, activity);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title,
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
                color: isIncrease
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
          '@ossinsight/widget-analyze-org-activity-action-ratio',
          input,
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

const calcPercentage = (current: number, past: number) => {
  if (past === 0) {
    return 0;
  }
  return ((current - past) / past) * 100;
};

export const type = 'compose';

export const width = 272;
export const height = 272;
