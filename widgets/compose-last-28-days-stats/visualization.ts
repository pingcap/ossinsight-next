import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { autoSize, computeLayout, horizontal, vertical, widget } from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string
}

type Input = [[any[]], [any[]], [any[]], [any[]]]

export default function ([[issues], [prs], [contributors], [stars]]: Input, ctx: WidgetVisualizerContext<Params>): ComposeVisualizationConfig {
  const end = DateTime.fromISO(issues[0].current_period_day);
  const start = DateTime.fromISO(issues[issues.length - 1].current_period_day);
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 64);

  const item = (name: string, label: string, valueKey: string, data: any) => (
    horizontal(
      widget('builtin:label-value', undefined, { label: label, value: data[0][valueKey] })
        .flex(0.3),
      widget(name, [data], ctx.parameters)
        .flex(0.7),
    ).gap(SPACING)
  );

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, { title: 'Last 28 Days Stats', subtitle: `Date: ${subtitle}` })
        .fix(HEADER_HEIGHT),
      horizontal(
        item('@ossinsight/widget-analyze-repo-recent-stars', 'Stars earned', 'current_period_stars', stars),
        item('@ossinsight/widget-analyze-repo-recent-pull-requests', 'PRs created', 'current_period_opened_prs', prs),
      ).gap(HORIZONTAL_SPACING).flex(),
      horizontal(
        item('@ossinsight/widget-analyze-repo-recent-contributors', 'Active Contributors', 'current_period_contributors', contributors),
        item('@ossinsight/widget-analyze-repo-recent-issues', 'Issues Opened', 'current_period_opened_issues', issues),
      ).gap(HORIZONTAL_SPACING).flex(),
    ).padding([0, PADDING, PADDING]).gap(SPACING),
    0,
    0,
    WIDTH,
    HEIGHT,
  );

}

export const type = 'compose';

export const width = 436 * 1.5;
export const height = 132 * 1.5;
