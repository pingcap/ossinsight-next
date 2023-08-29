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
  [[prs]]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const end = DateTime.fromISO(prs[0].current_period_day);
  const start = DateTime.fromISO(prs[prs.length - 1].current_period_day);
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 64);

  const item = (name: string, label: string, valueKey: string, data: any) =>
    horizontal(
      widget('builtin:label-value', undefined, {
        label: label,
        value: data[0][valueKey],
      }).flex(0.3),
      widget(name, [data], ctx.parameters).flex(0.7)
    ).gap(SPACING);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Pull requests',
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: 'pr',
            value: '↑pr%',
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
          '@ossinsight/widget-analyze-repo-recent-pull-requests',
          [prs],
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

export const width = 148 * 1.5;
export const height = 148 * 1.5;
