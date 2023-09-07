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
  owner_id: string;
  activity: string;
};

type DataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type Input = [DataPoint[]];

export default function (
  [data]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 16;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;
  const HORIZONTAL_SPACING = 64;

  const [currentSum, lastSum] = data.reduce(
    (acc, cur) => {
      acc[0] += cur.current_period_day_total;
      acc[1] += cur.past_period_day_total;
      return acc;
    },
    [0, 0]
  );

  const diff = currentSum - lastSum;

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: `${ctx.parameters?.activity} overtime`,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: currentSum,
            value: diff >= 0 ? `↑${diff}%` : `↓${diff}%`,
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
                color:
                  diff >= 0
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
          '@ossinsight/widget-analyze-org-recent-stars',
          [data],
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

export const width = 726;
export const height = 259 * 1.5;
