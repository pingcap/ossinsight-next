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

type Params = {
  owner_id: string;
};

type DataPoint = {
  repos: number;
  engagements: number;
  participants: number;
  participant_logins: string;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;

  const activity = ctx.parameters.activity ?? 'stars';

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: `Who's the Most Engaged in This GitHub Organization?`,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      widget(
        '@ossinsight/widget-analyze-org-engagement-scatter',
        input,
        ctx.parameters
      )
    ).padding([0, PADDING, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 864 + 16;
export const height = 518;
