import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { autoSize, computeLayout, horizontal, nonEmptyDataWidget, vertical, widget } from '@ossinsight/widgets-utils/src/compose';
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
  ctx: WidgetVisualizerContext<Params>,
): ComposeVisualizationConfig {
  // This range is not returned by api https://github.com/pingcap/ossinsight/blob/main/configs/queries/analyze-recent-top-contributors/template.sql
  const today = new Date();
  const prior30 = new Date(new Date().setDate(today.getDate() - 30));
  const end = DateTime.fromISO(today.toISOString());
  const start = DateTime.fromISO(prior30.toISOString());
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  const sortedContributors = contributors.sort((a, b) => b.events - a.events);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Top Active Contributors',
        subtitle: `Date: ${subtitle}`,
      }).fix(HEADER_HEIGHT),
      nonEmptyDataWidget(sortedContributors, () =>
        horizontal(
          vertical(
            ...sortedContributors.map((contributor =>
              widget('builtin:avatar-label', undefined, {
                label: contributor.actor_login,
                imgSrc: `https://github.com/${contributor.actor_login}.png`,
              }))),
          ).flex(0.7),
          widget('@ossinsight/widget-analyze-repo-recent-top-contributors', [sortedContributors], ctx.parameters),
        ),
      ),
    ).padding([0, PADDING, PADDING - autoSize(ctx, 4) /* the bar chart have small padding vertically */]),
    0,
    0,
    WIDTH,
    HEIGHT,
  );
}

export const type = 'compose';

export const width = 248 * 1.5;
export const height = 132 * 1.5;
