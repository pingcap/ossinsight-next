import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string;
};

type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [[DataPoint[]]];

export default function (
  [[contributors]]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  // const end = DateTime.fromISO(issues[0].current_period_day);
  // const start = DateTime.fromISO(issues[issues.length - 1].current_period_day);
  // const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;
  // TODO use real date
  const subtitle = 'xxxx-xx-01 - xxxx-xx-31';

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 8 * ctx.dpr;
  const PADDING = 18 * ctx.dpr;
  const HEADER_HEIGHT = 24 * ctx.dpr;
  const HORIZONTAL_SPACING = 32 * ctx.dpr;

  const CHILD_HEIGHT = HEIGHT - HEADER_HEIGHT - SPACING - PADDING;
  const CHILD_WIDTH = WIDTH - PADDING - HORIZONTAL_SPACING;

  const LABEL_WIDTH = (CHILD_WIDTH - SPACING) * 0.3;
  const CHART_WIDTH = CHILD_WIDTH - SPACING - LABEL_WIDTH;

  const CHART_0_LEFT = PADDING + LABEL_WIDTH + SPACING;

  const sortedContributors = contributors.sort((a, b) => b.events - a.events);

  const option = [
    {
      widget: 'builtin:card-heading',
      data: undefined,
      parameters: {
        title: 'Top Active Contributors',
        subtitle: `Date: ${subtitle}`,
      },
      left: PADDING,
      top: 0,
      width: WIDTH - 2 * PADDING,
      height: HEADER_HEIGHT,
    },
    ...sortedContributors.map((contributor, index) => ({
      widget: 'builtin:avatar-label',
      data: undefined,
      parameters: {
        label: contributor.actor_login,
        imgSrc: `https://github.com/${contributor.actor_login}.png`,
      },
      left: PADDING,
      top:
        HEADER_HEIGHT +
        SPACING +
        ((CHILD_HEIGHT + SPACING) / sortedContributors.length) * index,
      width: CHILD_WIDTH,
      height: CHILD_HEIGHT / (sortedContributors.length + 1),
    })),
    {
      widget: '@ossinsight/widget-analyze-repo-recent-top-contributors',
      data: [sortedContributors],
      parameters: ctx.parameters,
      left: CHART_0_LEFT,
      top: HEADER_HEIGHT + SPACING,
      width: CHART_WIDTH,
      height: CHILD_HEIGHT,
    },
  ];
  return option;
}

export const type = 'compose';

export const width = 436 * 1.5;
export const height = 132 * 1.5;
