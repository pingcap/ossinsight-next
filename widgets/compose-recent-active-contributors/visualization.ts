import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  autoSize,
  computeLayout,
  grid,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import _ from 'lodash';
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

export default function (
  [contributors]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const today = new Date();
  const prior30 = new Date(new Date().setDate(today.getDate() - 30));
  const end = DateTime.fromISO(today.toISOString());
  const start = DateTime.fromISO(prior30.toISOString());
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  const uniqueContributors = _.uniqBy(contributors, 'actor_login');
  const sortedContributors = _.orderBy(uniqueContributors, 'events', 'desc');

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Active Contributors',
        subtitle: `Date: ${subtitle}`,
      }).fix(HEADER_HEIGHT),
      grid(
        5,
        20,
        ...sortedContributors.map((item) =>
          widget('builtin:avatar-label', undefined, {
            label: '',
            imgSrc: item.actor_login
              ? `https://github.com/${item.actor_login}.png`
              : '',
          })
        )
      ).gap(autoSize(ctx, 4))
    ).padding([0, PADDING, PADDING / 2, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 436 * 1.5;
export const height = 132 * 1.5;
