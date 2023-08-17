import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { autoSize, computeLayout, vertical, widget } from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  user_id: number
  activity_type: string
}

type DataPoint = {
  cnt: number
  event_period: string
  repo_id: number
  repo_name: string
}

export default function (input: DataPoint[], ctx: WidgetVisualizerContext<Params>): ComposeVisualizationConfig {
  const end = DateTime.now().startOf('day');
  const start = end.minus({ day: 27 }).startOf('day');
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  const maxRepos = 5;

  const data = computeData(input, maxRepos);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, { title: 'Last 28 Days Stats', subtitle: `Date: ${subtitle}` })
        .fix(HEADER_HEIGHT),
      widget('@ossinsight/basic-bubbles-chart', data, {
        start,
        end,
        axis_field: 'event_period',
        value_field: 'cnt',
        label_field: 'repo_name',
      }),
    ).padding([0, PADDING, PADDING / 2, PADDING]).gap(SPACING),
    0,
    0,
    WIDTH,
    HEIGHT,
  );
}

export const type = 'compose';

export const width = 331 * 1.5;
export const height = 159 * 1.5;

function normalizeData (input: DataPoint[], names: string[]): any[] {
  const namesSet = new Map<string, number>(names.map((k, i) => [k, i]));

  return input
    .filter(dp => {
      return namesSet.has(dp.repo_name);
    })
    .sort((a, b) => {
      return namesSet!.get(b.repo_name) - namesSet!.get(a.repo_name);
    });
}

function computeData (input: DataPoint[], maxRepos: number) {
  const names: string[] = [];
  const reposSorted = input.sort((a, b) => {
    const diff = DateTime.fromSQL(b.event_period).toSeconds() - DateTime.fromSQL(a.event_period).toSeconds();
    if (diff) {
      return diff;
    }
    return b.cnt - a.cnt;
  });
  for (let dp of reposSorted) {
    if (names.includes(dp.repo_name)) {
      continue;
    }
    names.push(dp.repo_name);
    if (names.length >= maxRepos) {
      break;
    }
  }
  return normalizeData(reposSorted, names);
}
