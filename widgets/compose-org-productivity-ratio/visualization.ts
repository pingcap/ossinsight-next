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

type Input = [DataPoint[]];

const handleInputData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'issues/closed':
      const { selfClosed, othersClosed, unClosed } = (
        data as IssueClosedDataPoint[]
      ).reduce((acc, cur) => {
        if (cur.type === 'self-closed') {
          acc.selfClosed = { ...cur };
        }
        if (cur.type === 'others-closed') {
          acc.othersClosed = { ...cur };
        }
        if (cur.type === 'un-closed') {
          acc.unClosed = { ...cur };
        }
        return acc;
      }, {} as Record<'selfClosed' | 'othersClosed' | 'unClosed', IssueClosedDataPoint>);
      const issueCurrent =
        selfClosed.current_period_percentage +
        othersClosed.current_period_percentage;
      const issuePast =
        selfClosed.past_period_percentage + othersClosed.past_period_percentage;
      const issueDiff = (issueCurrent - issuePast) / issuePast;
      return {
        title: 'Issues Closed Ratio',
        label: `${issueCurrent.toFixed(2)}%`,
        value: `${issueDiff >= 0 ? '↑' : '↓'}${Math.abs(issueDiff).toFixed(
          2
        )}%`,
        isIncrease: issueDiff >= 0,
      };
    case 'reviews/reviewed':
      const { reviewed, unReviewed } = (data as ReviewedDataPoint[]).reduce(
        (acc, cur) => {
          if (cur.type === 'reviewed') {
            acc.reviewed = { ...cur };
          }
          if (cur.type === 'un-reviewed') {
            acc.unReviewed = { ...cur };
          }
          return acc;
        },
        {} as Record<'reviewed' | 'unReviewed', ReviewedDataPoint>
      );
      const reviewCurrent = reviewed.current_period_percentage;
      const reviewPast = reviewed.past_period_percentage;
      const reviewDiff = (reviewCurrent - reviewPast) / reviewPast;
      return {
        title: 'PR Reviewed Ratio',
        label: `${reviewCurrent.toFixed(2)}%`,
        value: `${reviewDiff >= 0 ? '↑' : '↓'}${Math.abs(reviewDiff).toFixed(
          2
        )}%`,
        isIncrease: reviewDiff >= 0,
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
      const prCurrent =
        selfMerged.current_period_percentage +
        othersMerged.current_period_percentage;
      const prPast =
        selfMerged.past_period_percentage + othersMerged.past_period_percentage;
      const prDiff = (prCurrent - prPast) / prPast;
      return {
        title: 'PRs Merged Ratio',
        label: `${prCurrent.toFixed(2)}%`,
        value: `${prDiff >= 0 ? '↑' : '↓'}${Math.abs(prDiff).toFixed(2)}%`,
        isIncrease: prDiff >= 0,
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
  const activity = ctx.parameters?.activity;

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

export const type = 'compose';

export const width = 216;
export const height = 216;
