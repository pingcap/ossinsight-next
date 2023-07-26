import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';
import {
  topBottomLayoutGrid,
  utils,
  timeAxis,
  valueAxis,
  axisTooltip,
  bar as barSeries,
  dataZoom,
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
    yAxis: utils.template(({ id }) =>
      valueAxis<'y'>(id, { name: 'Count', gridId: id })
    ),
    series: compare([main, vs], (data, name) => [
      barSeries('event_month', 'pushes', {
        xAxisId: name,
        yAxisId: name,
        emphasis: { focus: 'series' },
        datasetId: name,
        barMaxWidth: 4,
      }),
      barSeries('event_month', 'commits', {
        xAxisId: name,
        yAxisId: name,
        emphasis: { focus: 'series' },
        datasetId: name,
        barMaxWidth: 4,
      }),
    ]).flatMap((x) => [x[0], x[1]] as const),
    dataZoom: dataZoom(),
    tooltip: axisTooltip('cross'),
    legend: {
      show: true,
    },
  };
}

export const type = 'echarts';