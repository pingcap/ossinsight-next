import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

type Params = {
  owner_id: string;
  activity?: string;
  period?: string;
};

type DataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type Input = [DataPoint[]];

const handleData = (data: DataPoint[], activity: string) => {
  const [currentSum, lastSum] = data.reduce(
    (acc, cur) => {
      acc[0] += cur.current_period_day_total;
      acc[1] += cur.past_period_day_total;
      return acc;
    },
    [0, 0]
  );
  let tmpTitle = 'Participants Over Time';
  if (activity === 'new') {
    tmpTitle = 'New participants Over Time';
  }
  const diff = currentSum - lastSum;
  return {
    title: tmpTitle,
    data,
    label: currentSum,
    value: diff >= 0 ? `↑${diff}%` : `↓${diff}%`,
    increase: diff >= 0,
  };
};

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

  const { activity = 'active' } = ctx.parameters || {};

  const {
    data: handledData,
    label,
    value,
    increase,
    title,
  } = handleData(data, activity);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: title,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label,
            value,
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
                color: increase
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
          '@ossinsight/widget-analyze-org-recent-stats',
          [handledData],
          ctx.parameters
        ).flex(0.8)
      )
    ).padding([0, PADDING, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = getWidgetSize().widgetWidth(9);
export const height = getWidgetSize().widgetWidth(4);
