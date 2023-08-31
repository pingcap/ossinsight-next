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

type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [any[]];

export default function (
  [data]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 64);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Star Earned Over Time',
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: 'star',
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
          })
        )
          .gap(SPACING)
          .flex(0.3),
        widget(
          '@ossinsight/widget-analyze-org-recent-stars',
          data,
          ctx.parameters
        )
      )
        .gap(HORIZONTAL_SPACING)
        .flex(0.7)
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

export const width = 726 * 1.5;
export const height = 272 * 1.5;
