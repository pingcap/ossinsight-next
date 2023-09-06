import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  autoSize,
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';
import { DateTime } from 'luxon';

type Params = {
  org_id: string;
  activity: string;
};

type DataPoint = {
  current_period_percentage: number;
  current_period_prs: number;
  past_period_percentage: number;
  past_period_prs: number;
  percentage_change: number;
  type: 'others-merged' | 'un-merged' | 'self-merged';
};

type Input = [DataPoint[]];

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 16;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;
  const HORIZONTAL_SPACING = 64;

  const data = input[0];

  console.log('input', data);

  const { selfMerged, othersMerged, unMerged } = data.reduce((acc, cur) => {
    if (cur.type === 'self-merged') {
      acc.selfMerged = { ...cur };
    }
    if (cur.type === 'others-merged') {
      acc.othersMerged = { ...cur };
    }
    if (cur.type === 'un-merged') {
      acc.unMerged = { ...cur };
    }
    return acc;
  }, {} as Record<'selfMerged' | 'othersMerged' | 'unMerged', DataPoint>);

  const current = 100 - unMerged.current_period_percentage;
  const past = 100 - unMerged.past_period_percentage;
  const diff = current - past;

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: `${ctx.parameters?.activity} Merged Ratio`,
        subtitle: ' ',
      }).fix(HEADER_HEIGHT),
      vertical(
        horizontal(
          widget('builtin:label-value', undefined, {
            label: `${current.toFixed(2)}%`,
            value: `${diff >= 0 ? '↑' : '↓'}${Math.abs(diff).toFixed(2)}%`,
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
                color:
                  diff >= 0
                    ? ctx.theme.colors.green['400']
                    : ctx.theme.colors.red['400'],
              },
            },
            column: false,
          })
        )
          .gap(SPACING)
          .flex(0.1),
        widget(
          '@ossinsight/widget-analyze-org-pull-requests-merged-ratio',
          input,
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

const calcPercentage = (current: number, past: number) => {
  if (past === 0) {
    return 0;
  }
  return ((current - past) / past) * 100;
};

export const type = 'compose';

export const width = 272;
export const height = 272;
