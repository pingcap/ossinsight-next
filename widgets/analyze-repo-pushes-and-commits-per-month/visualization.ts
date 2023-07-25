import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';
import {
  topBottomLayoutGrid,
  utils,
  timeAxis,
} from '@ossinsight/widgets-utils/src/options';

type Params = {
  repo_id: string;
  vs_repo_id?: string;
};

type DataPoint = {
  commits: number;
  pushes: number;
  event_month: string;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.getRepo(parseInt(ctx.parameters.repo_id));
  const vs = ctx.getRepo(parseInt(ctx.parameters.vs_repo_id));

  const defaultCompareInput: [any, any] = [
    main && {
      id: 'main',
    },
    vs && {
      id: 'vs',
    },
  ];

  const dataset = compare(input, (data, name) => ({
    id: name,
    source: data,
  }));

  return {
    dataset,
    grid: topBottomLayoutGrid(!!vs),
    xAxis: utils.template(
      ({ id }) => timeAxis<'x'>(id, { gridId: id }, undefined, input),
      !!vs
    ),
    yAxis: utils.template(({ id }) => ({
      id,
      gridId: id,
      type: 'value',
      axisLabel: {
        formatter: format,
      },
    }), !!vs),
    series: compare([main, vs], (data, name) => [
      {
        datasetId: name,
        type: 'bar',
        name: data.fullName,
        encode: {
          x: 'event_month',
          y: 'pushes',
        },
        xAxisId: name,
        yAxisId: name,
        showSymbol: false,
        barMaxWidth: 4,
        emphasis: { focus: 'series' },
      },
      {
        datasetId: name,
        type: 'bar',
        name: data.fullName,
        encode: {
          x: 'event_month',
          y: 'commits',
        },
        xAxisId: name,
        yAxisId: name,
        showSymbol: false,
        barMaxWidth: 4,
        emphasis: { focus: 'series' },
      },
    ]).flatMap((x) => [x[0], x[1]] as const),
    dataZoom: {
      show: true,
      left: 8,
      right: 8,
      realtime: true,
      xAxisId: compare(defaultCompareInput, ({ id }) => id),
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      show: true,
    },
  };
}

const units = ['', 'k', 'm', 'b'];

function format(value: number) {
  if (value === 0) {
    return '0';
  }
  let i = 0;
  while (value % 1000 === 0 && i < units.length) {
    value = value / 1000;
    i++;
  }

  return `${value}${units[i]}`;
}

export const type = 'echarts';
