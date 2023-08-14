import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';
import { simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  repo_id: string;
  vs_repo_id?: string;
};

type DataPoint = {
  count: number;
  event_month: string;
};

type Input = [DataPoint[], DataPoint[] | undefined];

// TODO: This is a copy of the widget from widgets/analyze-repo-stars-history
// TODO: We should update after APIs are updated
export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.getRepo(parseInt(ctx.parameters.repo_id));
  const vs = ctx.getRepo(parseInt(ctx.parameters.vs_repo_id));

  return {
    dataset: compare(input, (data, name) => ({
      id: name,
      source: data,
    })),
    grid: { ...simpleGrid(2), containLabel: true },
    xAxis: {
      type: 'time',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
        },
        interval: 'auto',
      },
    },
    yAxis: {
      show: false,
      type: 'value',
      axisLabel: {
        formatter: format,
      },
    },
    series: compare([main, vs], (data, name) => ({
      datasetId: name,
      type: 'line',
      name: data.fullName,
      encode: {
        x: 'event_month',
        y: 'total',
      },
      lineStyle: {
        color: '#E47C42',
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#CA7342', // color at 0%
            },
            {
              offset: 1,
              color: 'rgba(173, 108, 71, 0.00)', // color at 100%
            },
          ],
          global: false, // default is false
        },
      },
    })),
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    legend: {
      show: true,
      left: 0,
      icon: 'circle',
      itemStyle: {
        color: '#E47C42',
      },
      formatter: (name) => `Count all different types of events triggered by activity(pull a request,etc.) on GitHub in ${name}`
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
