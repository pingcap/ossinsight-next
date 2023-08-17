import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { DateTime } from 'luxon';
import {
  autoSize,
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';

type Params = {
  repo_id: string;
  activity?: string;
};

type DataPoint = {
  issue_closed_ratio: number;
  pr_merged_ratio: number;
  pr_reviewed_ratio: number;
};

type Input = [DataPoint[]];

export default function (
  [input]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const today = new Date();
  const prior30 = new Date(new Date().setDate(today.getDate() - 30));
  const end = DateTime.fromISO(today.toISOString());
  const start = DateTime.fromISO(prior30.toISOString());
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 16);

  const item = (name: string, label: string, params: Params, data: any) =>
    vertical(
      widget('builtin:label', undefined, { label: label }).flex(0.1),
      widget(name, [data], params).flex(0.9)
    ).gap(SPACING);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Collaborative Productivity',
        subtitle: `Date: ${subtitle}`,
      }).fix(HEADER_HEIGHT),
      horizontal(
        item(
          '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
          'PR Merged Ratio',
          { ...ctx.parameters, activity: 'pr-merged-ratio' },
          input
        ),
        item(
          '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
          'Issue Closed Ratio',
          { ...ctx.parameters, activity: 'issue-closed-ratio' },
          input
        ),
        item(
          '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
          'PR Reviewed Ratio',
          { ...ctx.parameters, activity: 'pr-reviewed-ratio' },
          input
        )
      )
        .gap(HORIZONTAL_SPACING)
        .flex()
    )
      .padding([0, PADDING, PADDING])
      .gap(SPACING),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';
export const width = 325 * 1.5;
export const height = 130 * 1.5;
