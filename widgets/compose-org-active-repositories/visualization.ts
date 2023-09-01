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
  repo_id: string;
  activity?: string;
};

type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [[DataPoint[]]];

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
        value: 'Activities',
      };
  }
};

export default function (
  [[contributors]]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  // This range is not returned by api https://github.com/pingcap/ossinsight/blob/main/configs/queries/analyze-recent-top-contributors/template.sql
  const today = new Date();
  const prior30 = new Date(new Date().setDate(today.getDate() - 30));
  const end = DateTime.fromISO(today.toISOString());
  const start = DateTime.fromISO(prior30.toISOString());
  // const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const { activity = 'activity' } = ctx.parameters;
  const { title, subtitle, label, value } = getActivity(activity);

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  const sortedContributors = contributors.sort((a, b) => b.events - a.events);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title,
        subtitle,
      }).fix(HEADER_HEIGHT),
      widget('builtin:label-value', undefined, {
        label: 'repo',
        value: '↑repo%',
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
      nonEmptyDataWidget(sortedContributors, () =>
        horizontal(
          vertical(
            ...sortedContributors.map((contributor) =>
              widget('builtin:avatar-progress', undefined, {
                label: contributor.actor_login,
                imgSrc: `https://github.com/${contributor.actor_login}.png`,
                size: 24,
                value: 10,
                maxVal: 100,
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
