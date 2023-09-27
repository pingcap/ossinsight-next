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
import { upperFirst, getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

type Params = {
  owner_id: string;
  activity?: string;
};

type DataPoint = {
  idx: number;
  current_period_day: string;
  current_period_day_total: number;
  past_period_day: string;
  past_period_day_total: number;
};

type Input = [DataPoint[]];

const parseTitle = (activity: string) => {
  switch (activity) {
    case 'issues':
      return 'Issues';
    case 'pull-requests':
      return 'Pull Requests';
    case 'reviews':
      return 'Code Reviews';
    default:
      return upperFirst(activity);
  }
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

  const [currentSum, pastSum] = data.reduce(
    ([current, past], { current_period_day_total, past_period_day_total }) => {
      return [current + current_period_day_total, past + past_period_day_total];
    },
    [0, 0]
  );

  const diff = currentSum - pastSum;
  const diffPercentage = ((Math.abs(diff) / pastSum) * 100).toFixed(2);

  const stars = transferData2Star(data);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: parseTitle(ctx.parameters?.activity),
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: currentSum,
            labelProps: {
              style: {
                fontSize: 24,
                fontWeight: 'bold',
              },
            },
          }).flex(0.5),
          widget('builtin:label-value', undefined, {
            label: diff >= 0 ? `↑${diffPercentage}%` : `↓${diffPercentage}%`,
            labelProps: {
              style: {
                fontSize: 12,
                lineHeight: 2,
                color:
                  diff >= 0
                    ? ctx.theme.colors.green['400']
                    : ctx.theme.colors.red['400'],
              },
            },
          }).flex(0.3)
        ),
        widget(
          '@ossinsight/widget-analyze-repo-recent-stars',
          [stars],
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

const transferData2Star = (data: DataPoint[]) => {
  return data.map((d) => {
    return {
      idx: d.idx,
      current_period_day: d.current_period_day,
      current_period_day_stars: d.current_period_day_total,
      current_period_stars: d.current_period_day_total,
      last_period_day: d.past_period_day,
      last_period_day_stars: d.past_period_day_total,
      last_period_stars: d.past_period_day_total,
    };
  });
};

export const type = 'compose';
//
// export const width = getWidgetSize().widgetWidth(2);
// export const height = getWidgetSize().widgetWidth(2);
