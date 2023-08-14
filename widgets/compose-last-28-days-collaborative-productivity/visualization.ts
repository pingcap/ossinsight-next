import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string
}

type Input = [[any[]], [any[]], [any[]]]

export default function ([[prs], [issues], [reviews]]: Input, ctx: WidgetVisualizerContext<Params>): ComposeVisualizationConfig {
  const end = DateTime.fromISO(issues[0].current_period_day);
  const start = DateTime.fromISO(issues[issues.length - 1].current_period_day);
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 8 * ctx.dpr;
  const HEADER_HEIGHT = 24 * ctx.dpr;
  const PADDING = 18 * ctx.dpr;

  const LABEL_HEIGHT = 16 * ctx.dpr;
  const CHILD_WIDTH = (WIDTH - (SPACING + LABEL_HEIGHT) * 2) / 3;
  const CHILD_HEIGHT = HEIGHT - HEADER_HEIGHT - LABEL_HEIGHT - PADDING;

  const H_OFFSET = WIDTH - (CHILD_WIDTH * 3 + (SPACING + LABEL_HEIGHT) * 2)

  return [
    {
      widget: 'builtin:card-heading',
      data: undefined,
      parameters: {
        title: 'Collaborative Productivity',
        subtitle: `Date: ${subtitle}`,
      },
      left: PADDING,
      top: 0,
      width: WIDTH - 2 * PADDING,
      height: HEADER_HEIGHT,
    },
    {
      widget: 'builtin:label',
      data: undefined,
      parameters: {
        label: 'PR Merged Ratio'
      },
      left: H_OFFSET + LABEL_HEIGHT,
      top: HEADER_HEIGHT,
      width: CHILD_WIDTH,
      height: LABEL_HEIGHT,
    },
    {
      widget: 'builtin:label',
      data: undefined,
      parameters: {
        label: 'Issue Closed Ratio'
      },
      left: H_OFFSET + LABEL_HEIGHT + CHILD_WIDTH + SPACING,
      top: HEADER_HEIGHT,
      width: CHILD_WIDTH,
      height: LABEL_HEIGHT,
    },
    {
      widget: 'builtin:label',
      data: undefined,
      parameters: {
        label: 'PR Reviewed Ratio'
      },
      left: H_OFFSET + LABEL_HEIGHT + (CHILD_WIDTH + SPACING) * 2,
      top: HEADER_HEIGHT,
      width: CHILD_WIDTH,
      height: LABEL_HEIGHT,
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-pull-requests-merged-ratio',
      data: [prs],
      parameters: ctx.parameters,
      left: H_OFFSET + LABEL_HEIGHT,
      top: HEADER_HEIGHT + LABEL_HEIGHT,
      width: CHILD_WIDTH,
      height: CHILD_HEIGHT
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-pull-requests-merged-ratio',
      data: [issues],
      parameters: ctx.parameters,
      left: H_OFFSET + LABEL_HEIGHT + CHILD_WIDTH + SPACING,
      top: HEADER_HEIGHT + LABEL_HEIGHT,
      width: CHILD_WIDTH,
      height: CHILD_HEIGHT
    },
    {
      widget: '@ossinsight/widget-analyze-repo-recent-pull-requests-merged-ratio',
      data: [reviews],
      parameters: ctx.parameters,
      left: H_OFFSET + LABEL_HEIGHT + (CHILD_WIDTH + SPACING) * 2,
      top: HEADER_HEIGHT + LABEL_HEIGHT,
      width: CHILD_WIDTH,
      height: CHILD_HEIGHT
    }
  ];
}
export const type = 'compose';
export const width = 325 * 1.5;
export const height = 130 * 1.5;