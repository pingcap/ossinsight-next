import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  autoSize,
  computeLayout,
  grid,
  nonEmptyDataWidget,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string;
  limit: number;
};

type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [DataPoint[]];

const calcGridCfg = (limit: number) => {
  switch (limit) {
    case 50:
    case 100:
      return {
        rows: 5,
        cols: 20,
        size: 20,
      };
    case 5:
    case 10:
    case 30:
    default:
      return {
        rows: 3,
        cols: 10,
        size: 40,
      };
  }
};

export default function (
  [contributors]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const today = new Date();
  const prior30 = new Date(new Date().setDate(today.getDate() - 30));
  const end = DateTime.fromISO(today.toISOString());
  const start = DateTime.fromISO(prior30.toISOString());
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const limit = ctx.parameters.limit || '5';
  const { rows, cols, size } = {
    rows: 1,
    cols: 5,
    size: 40,
  };

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Active Contributors',
      }).fix(HEADER_HEIGHT),
      widget('builtin:label-value', undefined, {
        label: '000',
        value: '↑000%',
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
      }),
      nonEmptyDataWidget(contributors, () =>
        grid(
          rows,
          cols,
          ...contributors.map((item) =>
            widget('builtin:avatar-label', undefined, {
              label: '',
              size: size,
              imgSrc: item.actor_login
                ? `https://github.com/${item.actor_login}.png`
                : '',
            })
          )
        ).gap(autoSize(ctx, 4))
      )
    ).padding([0, PADDING, PADDING / 2, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 200 * 1.5;
export const height = 124 * 1.5;
