import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  autoSize,
  computeLayout,
  horizontal,
  nonEmptyDataWidget,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  owner_id: string;
  activity?: string;
  period?: string;
};

type StarDataPoint = {
  repo_id: number;
  repo_name: string;
  stars: number;
};

type DataPoint = StarDataPoint;

type Input = [DataPoint[], DataPoint[] | undefined];

const handleInputData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'stars':
    default:
      return {
        data: data.slice(0, 5),
        title: 'Top Repos',
        subtitle: ' ',
        label: 'Repo',
        value: 'Star earned',
        maxVal: data.reduce((acc, cur) => acc + cur.stars, 0),
      };
  }
};

export default function (
  [inputData]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const { activity = 'activities' } = ctx.parameters;

  const { title, subtitle, label, value, data, maxVal } = handleInputData(
    inputData,
    activity
  );

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title,
        subtitle,
      }).fix(HEADER_HEIGHT),
      widget('builtin:label-value', undefined, {
        label: data.length.toString(),
        // value: '↑repo%',
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
      }).flex(0.2),
      widget('builtin:label-value', undefined, {
        label,
        value,
        labelProps: {
          style: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
        valueProps: {
          style: {
            fontSize: 12,
            fontWeight: 'normal',
            // color: ctx.theme.colors.green['400'],
            marginLeft: 'auto',
          },
        },
        column: false,
      }).flex(0.1),
      nonEmptyDataWidget(data, () =>
        horizontal(
          vertical(
            ...data.map((item) =>
              widget('builtin:avatar-progress', undefined, {
                label: item.repo_name.split('/')[1],
                imgSrc: `https://github.com/${item.repo_name.split('/')[0]}.png`,
                size: 24,
                value: item?.stars,
                maxVal,
              })
            )
          ).flex(0.7)
          // widget('@ossinsight/widget-analyze-repo-recent-top-contributors', [sortedContributors], ctx.parameters),
        )
      )
    ).padding([
      0,
      PADDING,
      PADDING -
        autoSize(ctx, 4) /* the bar chart have small padding vertically */,
    ]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 300;
export const height = 389;
