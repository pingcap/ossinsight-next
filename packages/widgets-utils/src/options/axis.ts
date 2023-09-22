import merge from 'deepmerge';
import { DateTime } from 'luxon';
import _ from 'lodash';
import format from 'human-format';

import type { OptionId } from 'echarts/types/src/util/types';
import type { XAXisOption, YAXisOption } from 'echarts/types/dist/shared';
import type {
  AxisBaseOption,
  CategoryAxisBaseOption,
  LogAxisBaseOption,
  TimeAxisBaseOption,
  ValueAxisBaseOption,
} from 'echarts/types/src/coord/axisCommonTypes';

type AxisOption<
  T extends 'x' | 'y',
  Base extends AxisBaseOption = AxisBaseOption
> = (T extends 'x' ? XAXisOption : YAXisOption) & Base;

function filterEnum<T>(value: string | undefined, enums: T[]): T | undefined {
  return enums.includes(value as any) ? value : (undefined as any);
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatMonth = (value: number | string | Date) => {
  const date = new Date(value);
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const now = new Date();

export function timeAxis<T extends 'x' | 'y'>(
  id?: OptionId,
  option: AxisOption<T, TimeAxisBaseOption> = {},
  fromRecent: string | boolean | undefined = 'event_month',
  data?: any[] // ! Different from the original
): AxisOption<T> {
  return merge<AxisOption<T, TimeAxisBaseOption>>(option, {
    id,
    type: 'time',
    axisPointer: {
      label: {
        formatter: ({ value }) => {
          return formatMonth(value);
        },
      },
    },
    // TODO: prevent compute multi-times
    min: !_.isEmpty(fromRecent)
      ? fromRecent === true
        ? undefined
        : fromRecent &&
          data &&
          DateTime.fromISO(
            _.minBy(_.flatten(data), (i) => i && i[fromRecent])[fromRecent]
          )
            .minus({ month: 1 })
            .toJSDate() // ! Different from the original
      : new Date(2011, 0, 1, 0, 0, 0, 0),
    max: DateTime.fromJSDate(
      new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    )
      .plus({ month: 1 })
      .toJSDate(),
    minInterval: 3600 * 24 * 1000 * 28,
  });
}

export function valueAxis<T extends 'x' | 'y'>(
  id?: OptionId,
  option: AxisOption<T, ValueAxisBaseOption> = {}
): AxisOption<T> {
  const small = false; // ! Different from the original
  return merge<AxisOption<T>>(option, {
    id,
    type: 'value',
    axisLabel: {
      formatter: (value) => format(value),
      margin: 8,
    },
    splitNumber: small ? 3 : (undefined as any),
    axisPointer: {
      label: {
        precision: 0,
      },
    },
    nameTextStyle: {
      opacity: small ? 0 : 1,
      align: filterEnum(option.position ?? 'left', ['left', 'right']),
    },
  });
}

export function categoryAxis<T extends 'x' | 'y'>(
  id?: OptionId,
  option: AxisOption<T, CategoryAxisBaseOption> = {}
): AxisOption<T> {
  return merge<AxisOption<T>>(option, {
    id,
    type: 'category',
    nameTextStyle: {
      align: filterEnum(option.position ?? 'left', ['left', 'right']),
    },
  });
}

export function logAxis<T extends 'x' | 'y'>(
  id?: OptionId,
  option: AxisOption<T, LogAxisBaseOption> = {}
): AxisOption<T> {
  // TODO
  // const small = isSmall();
  return merge<AxisOption<T>>(option, {
    id,
    type: 'log',
    nameTextStyle: {
      // opacity: small ? 0 : 1,
      opacity: 1,
      align: filterEnum(option.position ?? 'left', ['left', 'right']),
    },
    // splitNumber: small ? 3 : undefined as any,
    axisLabel: {
      margin: 8,
    },
  });
}

export function recentStatsChartXAxis<T extends 'x'>(
  id?: OptionId,
  option: AxisOption<T, ValueAxisBaseOption> = {}
): AxisOption<T> {
  return merge<AxisOption<T>>(option, {
    type: 'category',
    inverse: true,
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid',
        // width: 4,
      },
      interval: 'auto',
    },
  });
}