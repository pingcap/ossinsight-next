import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { autoSize, computeLayout, nonEmptyDataWidget, vertical, widget } from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  repo_id: number
}

type DataPoint = {
  events: number;
  event_month: string;
}

export default function (input: DataPoint[], ctx: WidgetVisualizerContext<Params>): ComposeVisualizationConfig {
  const end = DateTime.now().startOf('month');
  const start = end.minus({ year: 2 }).startOf('month');
  const subtitle = `${start.toFormat('yyyy-MM')} - ${end.toFormat('yyyy-MM')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = autoSize(ctx, 24);
  const HEADER_HEIGHT = autoSize(ctx, 48);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined,
        {
          title: 'Repository Activity Trends',
          subtitle: `Date: ${subtitle}`,
        },
      ).fix(HEADER_HEIGHT),
      nonEmptyDataWidget(input, () =>
        widget('@ossinsight/widget-analyze-repo-activity-trends', input, ctx.parameters)
          .padding([0, -autoSize(ctx, 8)])),
    ).padding([0, PADDING, PADDING / 2, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT,
  );
}

export const type = 'compose';

export const width = 814;
export const height = 216;
