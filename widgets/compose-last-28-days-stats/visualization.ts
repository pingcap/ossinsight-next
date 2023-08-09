import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string
}

type Input = [[any[]], [any[]], [any[]], [any[]]]

export default function ([[issues], [prs], [commits], [stars]]: Input, ctx: WidgetVisualizerContext<Params>): ComposeVisualizationConfig {
  const end = DateTime.fromISO(issues[0].current_period_day);
  const start = DateTime.fromISO(issues[issues.length - 1].current_period_day);
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const MULTIPLIER = 1;

  const WIDTH = ctx.width || 436 * MULTIPLIER;
  const HEIGHT = ctx.height || 436 * MULTIPLIER;
  const SPACING = 8 * ctx.dpr;
  const PADDING = 18 * ctx.dpr;
  const HEADER_HEIGHT = HEIGHT * 0.27;
  const HORIZONTAL_SPACING = 32 * ctx.dpr;

  const CHILD_WIDTH = (WIDTH - 2 * PADDING - HORIZONTAL_SPACING) / 2;
  const CHILD_HEIGHT = (HEIGHT - HEADER_HEIGHT - SPACING * 3) / 2;

  const LABEL_WIDTH = CHILD_WIDTH * 0.3;
  const CHART_WIDTH = CHILD_WIDTH - LABEL_WIDTH;

  return [
    {
      widget: 'builtin:card-heading',
      data: undefined,
      parameters: {
        title: 'Last 28 Days Stats',
        subtitle: `Date: ${subtitle}`,
      },
      left: PADDING,
      top: 0,
      width: WIDTH - 2 * PADDING,
      height: HEADER_HEIGHT,
    },
    {
      widget: 'builtin:label-value',
      data: undefined,
      parameters: {
        label: 'Star earned',
        value: stars[0].current_period_stars,
      },
      left: PADDING,
      top: HEADER_HEIGHT + SPACING,
      width: LABEL_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: 'builtin:label-value',
      data: undefined,
      parameters: {
        label: 'PR Created',
        value: prs[0].current_period_opened_prs,
      },
      left: PADDING + CHILD_WIDTH + HORIZONTAL_SPACING,
      top: HEADER_HEIGHT + SPACING,
      width: LABEL_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: 'builtin:label-value',
      data: undefined,
      parameters: {
        label: 'Commits',
        value: commits[0].current_period_commits,
      },
      left: PADDING,
      top: HEADER_HEIGHT + SPACING + CHILD_HEIGHT + SPACING,
      width: LABEL_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: 'builtin:label-value',
      data: undefined,
      parameters: {
        label: 'Issues',
        value: issues[0].current_period_opened_issues,
      },
      left: PADDING + CHILD_WIDTH + HORIZONTAL_SPACING,
      top: HEADER_HEIGHT + SPACING + CHILD_HEIGHT + SPACING,
      width: LABEL_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-stars',
      data: [stars],
      parameters: ctx.parameters,
      left: SPACING + LABEL_WIDTH,
      top: HEADER_HEIGHT + SPACING,
      width: CHART_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-pull-requests',
      data: [prs],
      parameters: ctx.parameters,
      left: SPACING + CHILD_WIDTH + HORIZONTAL_SPACING + LABEL_WIDTH,
      top: HEADER_HEIGHT + SPACING,
      width: CHART_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-issues',
      data: [issues],
      parameters: ctx.parameters,
      left: SPACING + LABEL_WIDTH,
      top: HEADER_HEIGHT + SPACING + SPACING + CHILD_HEIGHT,
      width: CHART_WIDTH,
      height: CHILD_HEIGHT,
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-commits',
      data: [commits],
      parameters: ctx.parameters,
      left: SPACING + CHILD_WIDTH + HORIZONTAL_SPACING + LABEL_WIDTH,
      top: HEADER_HEIGHT + SPACING + SPACING + CHILD_HEIGHT,
      width: CHART_WIDTH,
      height: CHILD_HEIGHT,
    },
  ];
}

export const type = 'compose';

export const width = 436 * 1.5;
export const height = 132 * 1.5;
