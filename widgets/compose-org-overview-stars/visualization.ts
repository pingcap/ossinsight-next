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
  repo_id: string;
};

type Input = [[any[]]];

export default function (
  [[stars]]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const end = DateTime.fromISO(stars[0].current_period_day);
  const start = DateTime.fromISO(stars[stars.length - 1].current_period_day);
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 64);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Star earned',
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      horizontal(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: 'stars',
            value: '↑star%',
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
                color: ctx.theme.colors.green['400'],
              },
            },
            column: false,
          }).flex()
        ).gap(SPACING),
        widget(
          '@ossinsight/widget-analyze-repo-recent-stars',
          [stars],
          ctx.parameters
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

export const width = 465 * 1.5;
export const height = 100 * 1.5;
