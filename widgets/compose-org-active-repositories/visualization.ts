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

type ParticipantDataPoint = {
  login: string;
  engagements: number;
};

type ActivityDataPoint = {
  repo_id: number;
  repo_name: string;
  stars: number;
};

type DataPoint = ParticipantDataPoint | ActivityDataPoint;

type Input = [DataPoint[], DataPoint[] | undefined];

const handleInputData = (data: DataPoint[], activity: string) => {
  switch (activity) {
    case 'repos':
      return {
        data: (data as ActivityDataPoint[])
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 5),
        title: 'Active Repositories',
        subtitle: ' ',
        label: 'Top Repositories',
        value: 'Star earned',
        maxVal: (data as ActivityDataPoint[]).reduce(
          (acc, cur) => acc + cur.stars,
          0
        ),
      };
    case 'stars':
      return {
        data: (data as ActivityDataPoint[])
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 5),
        title: 'Top Repositories by Stars',
        subtitle: ' ',
        label: 'Repositories',
        value: 'Star earned',
        maxVal: (data as ActivityDataPoint[]).reduce(
          (acc, cur) => acc + cur.stars,
          0
        ),
      };
    case 'participants':
    default:
      return {
        data: (data as ParticipantDataPoint[]).slice(0, 5),
        title: 'Top Participants',
        subtitle: ' ',
        label: 'Name',
        value: 'Activity Count',
        maxVal: (data as ParticipantDataPoint[]).reduce(
          (acc, cur) => acc + cur.engagements,
          0
        ),
      };
  }
};

const getLogin = (item: DataPoint) => {
  if (item.hasOwnProperty('login')) {
    return (item as ParticipantDataPoint).login;
  }
  return (item as ActivityDataPoint).repo_name.split('/')[0];
};

const getLabel = (item: DataPoint) => {
  if (item.hasOwnProperty('login')) {
    return (item as ParticipantDataPoint).login;
  }
  return (item as ActivityDataPoint).repo_name;
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
                label: getLabel(item),
                imgSrc: `https://github.com/${getLogin(item)}.png`,
                size: 24,
                value: item?.stars || item?.engagements,
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
