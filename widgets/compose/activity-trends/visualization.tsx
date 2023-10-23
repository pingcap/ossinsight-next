/** @jsxRuntime classic */
/** @jsx Compose */

import Compose from '@ossinsight/compose';

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

  const layout = (
    <flex direction='vertical' padding={[0, PADDING, PADDING / 2, PADDING]}>
      <builtin-card-heading title='Repository Activity Trends' subtitle={`Date: ${subtitle}`} size={HEADER_HEIGHT} />
      <widget widget='@ossinsight/widget-analyze-repo-activity-trends' ifEmpty='indicator' data={input} parameters={ctx.parameters} padding={[0, 8]} />
    </flex>
  )

  return computeLayout(
    layout,
    0,
    0,
    WIDTH,
    HEIGHT,
  );
}

export const type = 'compose';

export const width = 814;
export const height = 216;
