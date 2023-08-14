import type { ComposeVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { autoSize, computeLayout, grid, vertical, widget } from '@ossinsight/widgets-utils/src/compose';
import _ from 'lodash';
import { DateTime } from 'luxon';

type Params = {
  repo_id: string;
};

type DataPoint = {
  contribution_date: string;
  contributor: string;
  total_contributions: number;
};

type Input = [DataPoint[]];

const CHUNK_SIZE = 5;

const MOCK_INPUT: DataPoint[] = [
  {
    contribution_date: '2023-08-14',
    contributor: 'hawkingrei',
    total_contributions: 16,
  },
  {
    contribution_date: '2023-08-14',
    contributor: 'lance6716',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-08-14',
    contributor: 'Defined2014',
    total_contributions: 5,
  },
  {
    contribution_date: '2023-08-14',
    contributor: 'hi-rustin',
    total_contributions: 4,
  },
  {
    contribution_date: '2023-08-14',
    contributor: 'tangenta',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-08-13',
    contributor: 'hawkingrei',
    total_contributions: 20,
  },
  {
    contribution_date: '2023-08-13',
    contributor: 'lance6716',
    total_contributions: 4,
  },
  {
    contribution_date: '2023-08-13',
    contributor: 'pingyu',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-08-13',
    contributor: 'jackysp',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-08-13',
    contributor: 'jiyfhust',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-08-12',
    contributor: 'hawkingrei',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-08-12',
    contributor: 'jackysp',
    total_contributions: 7,
  },
  {
    contribution_date: '2023-08-12',
    contributor: 'jiyfhust',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-08-12',
    contributor: 'nolouch',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-08-11',
    contributor: 'hawkingrei',
    total_contributions: 43,
  },
  {
    contribution_date: '2023-08-11',
    contributor: 'hi-rustin',
    total_contributions: 25,
  },
  {
    contribution_date: '2023-08-11',
    contributor: 'ywqzzy',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-08-11',
    contributor: 'windtalker',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-08-11',
    contributor: 'xzhangxian1008',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-08-10',
    contributor: 'hawkingrei',
    total_contributions: 35,
  },
  {
    contribution_date: '2023-08-10',
    contributor: 'D3Hunter',
    total_contributions: 19,
  },
  {
    contribution_date: '2023-08-10',
    contributor: 'lance6716',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-08-10',
    contributor: 'qw4990',
    total_contributions: 15,
  },
  {
    contribution_date: '2023-08-10',
    contributor: 'time-and-fate',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-09',
    contributor: 'hawkingrei',
    total_contributions: 44,
  },
  {
    contribution_date: '2023-08-09',
    contributor: 'qw4990',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-09',
    contributor: 'tangenta',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-08-09',
    contributor: 'jackysp',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-08-09',
    contributor: 'lance6716',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-08-08',
    contributor: 'hawkingrei',
    total_contributions: 63,
  },
  {
    contribution_date: '2023-08-08',
    contributor: 'bb7133',
    total_contributions: 14,
  },
  {
    contribution_date: '2023-08-08',
    contributor: 'qw4990',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-08-08',
    contributor: 'mjonss',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-08-08',
    contributor: 'lance6716',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-07',
    contributor: 'hawkingrei',
    total_contributions: 29,
  },
  {
    contribution_date: '2023-08-07',
    contributor: 'tangenta',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-08-07',
    contributor: 'wjhuang2016',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-08-07',
    contributor: 'Leavrth',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-07',
    contributor: '3pointer',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-08-06',
    contributor: 'hawkingrei',
    total_contributions: 5,
  },
  {
    contribution_date: '2023-08-06',
    contributor: 'jiyfhust',
    total_contributions: 4,
  },
  {
    contribution_date: '2023-08-06',
    contributor: 'CbcWestwolf',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-08-06',
    contributor: 'lance6716',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-08-06',
    contributor: 'SteveLeungYL',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-08-05',
    contributor: 'hawkingrei',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-05',
    contributor: 'highpon',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-08-05',
    contributor: 'lance6716',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-08-05',
    contributor: 'xhebox',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-08-05',
    contributor: 'JasonWu0506',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-08-04',
    contributor: 'lance6716',
    total_contributions: 31,
  },
  {
    contribution_date: '2023-08-04',
    contributor: 'hawkingrei',
    total_contributions: 28,
  },
  {
    contribution_date: '2023-08-04',
    contributor: 'tangenta',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-08-04',
    contributor: 'you06',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-08-04',
    contributor: 'wjhuang2016',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-08-03',
    contributor: 'hawkingrei',
    total_contributions: 26,
  },
  {
    contribution_date: '2023-08-03',
    contributor: 'lance6716',
    total_contributions: 18,
  },
  {
    contribution_date: '2023-08-03',
    contributor: 'AilinKid',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-08-03',
    contributor: 'Defined2014',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-08-03',
    contributor: 'tangenta',
    total_contributions: 6,
  },
  {
    contribution_date: '2023-08-02',
    contributor: 'lance6716',
    total_contributions: 28,
  },
  {
    contribution_date: '2023-08-02',
    contributor: 'hawkingrei',
    total_contributions: 24,
  },
  {
    contribution_date: '2023-08-02',
    contributor: 'dveeden',
    total_contributions: 14,
  },
  {
    contribution_date: '2023-08-02',
    contributor: 'lichunzhu',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-08-02',
    contributor: 'lyzx2001',
    total_contributions: 5,
  },
  {
    contribution_date: '2023-08-01',
    contributor: 'hawkingrei',
    total_contributions: 39,
  },
  {
    contribution_date: '2023-08-01',
    contributor: 'lance6716',
    total_contributions: 24,
  },
  {
    contribution_date: '2023-08-01',
    contributor: 'tangenta',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-08-01',
    contributor: 'lichunzhu',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-08-01',
    contributor: 'mjonss',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-31',
    contributor: 'CabinfeverB',
    total_contributions: 32,
  },
  {
    contribution_date: '2023-07-31',
    contributor: 'hawkingrei',
    total_contributions: 18,
  },
  {
    contribution_date: '2023-07-31',
    contributor: 'glorv',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-07-31',
    contributor: 'D3Hunter',
    total_contributions: 16,
  },
  {
    contribution_date: '2023-07-31',
    contributor: 'mjonss',
    total_contributions: 13,
  },
  {
    contribution_date: '2023-07-30',
    contributor: 'CabinfeverB',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-07-30',
    contributor: 'pingyu',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-07-30',
    contributor: 'jiyfhust',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-07-29',
    contributor: 'pingyu',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-07-29',
    contributor: 'ljluestc',
    total_contributions: 6,
  },
  {
    contribution_date: '2023-07-29',
    contributor: 'hawkingrei',
    total_contributions: 4,
  },
  {
    contribution_date: '2023-07-29',
    contributor: 'xhebox',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-07-29',
    contributor: 'CabinfeverB',
    total_contributions: 2,
  },
  {
    contribution_date: '2023-07-28',
    contributor: 'hawkingrei',
    total_contributions: 43,
  },
  {
    contribution_date: '2023-07-28',
    contributor: 'GMHDBJD',
    total_contributions: 20,
  },
  {
    contribution_date: '2023-07-28',
    contributor: 'glorv',
    total_contributions: 14,
  },
  {
    contribution_date: '2023-07-28',
    contributor: '3pointer',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-07-28',
    contributor: 'Defined2014',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-07-27',
    contributor: 'hawkingrei',
    total_contributions: 34,
  },
  {
    contribution_date: '2023-07-27',
    contributor: 'lance6716',
    total_contributions: 15,
  },
  {
    contribution_date: '2023-07-27',
    contributor: 'qw4990',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-07-27',
    contributor: 'Connor1996',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-27',
    contributor: 'HuSharp',
    total_contributions: 7,
  },
  {
    contribution_date: '2023-07-26',
    contributor: 'hawkingrei',
    total_contributions: 35,
  },
  {
    contribution_date: '2023-07-26',
    contributor: 'qw4990',
    total_contributions: 19,
  },
  {
    contribution_date: '2023-07-26',
    contributor: 'Defined2014',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-26',
    contributor: 'time-and-fate',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-07-26',
    contributor: 'CabinfeverB',
    total_contributions: 7,
  },
  {
    contribution_date: '2023-07-25',
    contributor: 'hawkingrei',
    total_contributions: 31,
  },
  {
    contribution_date: '2023-07-25',
    contributor: 'lyzx2001',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-25',
    contributor: 'crazycs520',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-25',
    contributor: 'gengliqi',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-07-25',
    contributor: 'glorv',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-07-24',
    contributor: 'hawkingrei',
    total_contributions: 63,
  },
  {
    contribution_date: '2023-07-24',
    contributor: 'qw4990',
    total_contributions: 28,
  },
  {
    contribution_date: '2023-07-24',
    contributor: 'Defined2014',
    total_contributions: 20,
  },
  {
    contribution_date: '2023-07-24',
    contributor: 'lance6716',
    total_contributions: 18,
  },
  {
    contribution_date: '2023-07-24',
    contributor: 'mjonss',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-23',
    contributor: 'ljluestc',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-07-23',
    contributor: 'hawkingrei',
    total_contributions: 6,
  },
  {
    contribution_date: '2023-07-23',
    contributor: 'f756692193',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-23',
    contributor: 'NayanPatidar',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-23',
    contributor: 'liubo802',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-22',
    contributor: 'hawkingrei',
    total_contributions: 3,
  },
  {
    contribution_date: '2023-07-22',
    contributor: 'CbcWestwolf',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-22',
    contributor: 'chrysan',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-22',
    contributor: 'AilinKid',
    total_contributions: 1,
  },
  {
    contribution_date: '2023-07-21',
    contributor: 'hawkingrei',
    total_contributions: 27,
  },
  {
    contribution_date: '2023-07-21',
    contributor: 'time-and-fate',
    total_contributions: 12,
  },
  {
    contribution_date: '2023-07-21',
    contributor: 'Defined2014',
    total_contributions: 10,
  },
  {
    contribution_date: '2023-07-21',
    contributor: 'D3Hunter',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-21',
    contributor: 'chrysan',
    total_contributions: 5,
  },
  {
    contribution_date: '2023-07-20',
    contributor: 'lance6716',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-07-20',
    contributor: 'hawkingrei',
    total_contributions: 16,
  },
  {
    contribution_date: '2023-07-20',
    contributor: 'purelind',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-20',
    contributor: 'Defined2014',
    total_contributions: 7,
  },
  {
    contribution_date: '2023-07-20',
    contributor: 'zimulala',
    total_contributions: 6,
  },
  {
    contribution_date: '2023-07-19',
    contributor: 'hawkingrei',
    total_contributions: 21,
  },
  {
    contribution_date: '2023-07-19',
    contributor: 'winoros',
    total_contributions: 16,
  },
  {
    contribution_date: '2023-07-19',
    contributor: 'chrysan',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-19',
    contributor: 'Defined2014',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-19',
    contributor: 'elsa0520',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-18',
    contributor: 'hawkingrei',
    total_contributions: 45,
  },
  {
    contribution_date: '2023-07-18',
    contributor: 'qw4990',
    total_contributions: 17,
  },
  {
    contribution_date: '2023-07-18',
    contributor: 'lance6716',
    total_contributions: 11,
  },
  {
    contribution_date: '2023-07-18',
    contributor: '3pointer',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-07-18',
    contributor: 'bb7133',
    total_contributions: 8,
  },
  {
    contribution_date: '2023-07-17',
    contributor: 'hawkingrei',
    total_contributions: 25,
  },
  {
    contribution_date: '2023-07-17',
    contributor: 'zimulala',
    total_contributions: 22,
  },
  {
    contribution_date: '2023-07-17',
    contributor: 'qw4990',
    total_contributions: 16,
  },
  {
    contribution_date: '2023-07-17',
    contributor: 'wuhuizuo',
    total_contributions: 9,
  },
  {
    contribution_date: '2023-07-17',
    contributor: 'lance6716',
    total_contributions: 8,
  },
];

export default function (
  [contributors]: Input,
  ctx: WidgetVisualizerContext<Params>,
): ComposeVisualizationConfig {
  // TODO - update this to use the input data
  const inputItems = MOCK_INPUT;
  const end = DateTime.fromISO(inputItems[0].contribution_date);
  const start = DateTime.fromISO(
    inputItems[inputItems.length - 1].contribution_date,
  );
  const subtitle = `${start.toFormat('MM-dd')} - ${end.toFormat('MM-dd')}`;

  const WIDTH = ctx.width;
  const HEIGHT = ctx.height;
  const SPACING = autoSize(ctx, 16);
  const PADDING = autoSize(ctx, 36);
  const HEADER_HEIGHT = autoSize(ctx, 48);
  const HORIZONTAL_SPACING = autoSize(ctx, 28);

  const uniqueContributors = _.uniqBy(inputItems, 'contributor');
  const sortedContributors = _.orderBy(
    uniqueContributors,
    'contribution_date',
    'desc',
  );

  return computeLayout(
    vertical(
      widget('builtin:card-heading', undefined, {
        title: 'Active Contributors',
        subtitle: `Date: ${subtitle}`,
      }).fix(HEADER_HEIGHT),
      grid(5, 15,
        ...sortedContributors
          .map(item => widget('builtin:avatar-label', undefined, {
            label: '', imgSrc: item.contributor
              ? `https://github.com/${item.contributor}.png`
              : '',
          }))).gap(autoSize(ctx, 4)),
    ).padding([0, PADDING, PADDING / 2, PADDING]),
    0,
    0,
    WIDTH,
    HEIGHT,
  );
}

export const type = 'compose';

export const width = 436 * 1.5;
export const height = 132 * 1.5;
