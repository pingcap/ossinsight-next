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
};

type DataPoint = {
  repo_id: number;
  repo_name: string;
  stars: number;
};

type Input = [DataPoint[], DataPoint[]];

const getActivity = (activity: string) => {
  switch (activity) {
    case 'star':
      return {
        title: 'Top Repositories by Stars',
        subtitle: ' ',
        label: 'Repositories',
        value: 'Star earned',
      };
    default:
      return {
        title: 'Active Repositories',
        subtitle: ' ',
        label: 'Top Repositories',
        value: 'Star earned',
      };
  }
};

export default function (
  [starsData, activitiesData]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const { activity = 'stars' } = ctx.parameters;

  const data = activity === 'stars' ? starsData : activitiesData;

  const { title, subtitle, label, value } = getActivity(activity);

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;

  const sortedData = data.sort((a, b) => b.stars - a.stars).slice(0, 5);
  const sum = sortedData.reduce((acc, cur) => acc + cur.stars, 0);

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
      nonEmptyDataWidget(sortedData, () =>
        horizontal(
          vertical(
            ...sortedData.map((item) =>
              widget('builtin:avatar-progress', undefined, {
                label: item.repo_name,
                imgSrc: `https://github.com/${
                  item.repo_name.split('/')[0]
                }.png`,
                size: 24,
                value: item.stars,
                maxVal: sum,
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

export const width = 200 * 1.5;
export const height = 259 * 1.5;
