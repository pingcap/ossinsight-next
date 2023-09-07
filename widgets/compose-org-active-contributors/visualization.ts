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
  owner_id: string;
  period?: string;
  activity?: string;
};

type DataPoint = {
  login: string;
  engagements: number;
};

type Input = [DataPoint[]];

export default function (
  [contributors]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {

  const sum = contributors.length;

  const { rows, cols, size } = {
    rows: 1,
    cols: 5,
    size: 40,
  };
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: `${ctx.parameters?.activity} Participants`,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      widget('builtin:label-value', undefined, {
        label: sum,
        // value: '↑000%',
        value: ' ',
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
              imgSrc: item.login ? `https://github.com/${item.login}.png` : '',
            })
          )
        ).gap(4)
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
