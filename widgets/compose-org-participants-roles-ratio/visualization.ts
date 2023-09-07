import type {
  ComposeVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { DateTime } from 'luxon';
import {
  autoSize,
  computeLayout,
  horizontal,
  vertical,
  widget,
} from '@ossinsight/widgets-utils/src/compose';

type Params = {
  owner_id: string;
  period?: string;
};

// type DataPoint = {
//   issue_closed_ratio: number;
//   pr_merged_ratio: number;
//   pr_reviewed_ratio: number;
// };

type DataPoint = {
  issue_commenters: number;
  issue_creators: number;
  participants: number;
  pr_commenters: number;
  pr_creators: number;
  pr_reviewers: number;
};

type Input = [DataPoint[]];

const getRatio = (numerator: number, denominator: number) => {
  if (denominator === 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
};

const handleData = (data: DataPoint) => {
  const sum =
    data.issue_commenters +
    data.issue_creators +
    data.participants +
    data.pr_commenters +
    data.pr_creators +
    data.pr_reviewers;
  return {
    issue_commenters_ratio: getRatio(data.issue_commenters, sum),
    issue_creators_ratio: getRatio(data.issue_creators, sum),
    participants_ratio: getRatio(data.participants, sum),
    pr_commenters_ratio: getRatio(data.pr_commenters, sum),
    pr_creators_ratio: getRatio(data.pr_creators, sum),
    pr_reviewers_ratio: getRatio(data.pr_reviewers, sum),
  };
};

export default function (
  [input]: Input,
  ctx: WidgetVisualizerContext<Params>
): ComposeVisualizationConfig {
  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = 16;
  const PADDING = 24;
  const HEADER_HEIGHT = 48;
  const HORIZONTAL_SPACING = 16;

  const data = input[0];

  const handledData = handleData(data);

  const item = (name: string, label: string, params: any, data: any) =>
    vertical(
      widget(name, [data], params).flex(0.9),
      widget('builtin:label', undefined, { label: label }).flex(0.1)
    ).gap(SPACING);

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title:
          'Which Roles Dominate Participation in This GitHub Organization?',
        subtitle: ` `,
      }).fix(HEADER_HEIGHT),
      vertical(
        widget('builtin:label', undefined, {
          label:
            'Please note: Individuals within an organization often hold multiple roles',
        }).flex(0.1),
        horizontal(
          item(
            '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
            'PR Creator',
            { ...ctx.parameters, activity: 'pr_creators_ratio' },
            [handledData]
          ),
          item(
            '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
            'PR Commenter',
            { ...ctx.parameters, activity: 'pr_commenters_ratio' },
            [handledData]
          ),
          item(
            '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
            'Issue Creator',
            { ...ctx.parameters, activity: 'issue_creators_ratio' },
            [handledData]
          ),
          item(
            '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
            'Issue commenter',
            { ...ctx.parameters, activity: 'issue_commenters_ratio' },
            [handledData]
          ),
          item(
            '@ossinsight/widget-analyze-repo-recent-collaborative-productivity-metrics',
            'Reviewer',
            { ...ctx.parameters, activity: 'pr_reviewers_ratio' },
            [handledData]
          )
        )
          .gap(HORIZONTAL_SPACING)
          .flex()
      ).gap(HORIZONTAL_SPACING)
    )
      .padding([0, PADDING, PADDING])
      .gap(SPACING),
    0,
    0,
    WIDTH,
    HEIGHT
  );
}

export const type = 'compose';

export const width = 726;
export const height = 259;
