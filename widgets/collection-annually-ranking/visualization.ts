import type { EChartsVisualizationConfig, WidgetVisualizerContext } from '@ossinsight/widgets-types';

type Params = { activity: string, collection_id: string }
type Input = { event_year: string, rank: number, repo_id: number, repo_name: string, total: number }[]

export default function (input: Input, ctx: WidgetVisualizerContext<Params>): EChartsVisualizationConfig {
  const repos = getAllRepos(input);
  const collection = ctx.getCollection(Number(ctx.parameters.collection_id));

  return {
    grid: {
      containLabel: true,
      top: 72,
      left: 24,
      right: 108,
    },
    yAxis: {
      type: 'value',
      interval: 1,
      min: 1,
      inverse: true,
      axisPointer: { show: true, type: 'shadow', snap: true, label: { precision: 0 }, triggerTooltip: false },
    },
    xAxis: {
      type: 'time',
      axisLabel: { formatter: (p: string | number) => String(p), showMaxLabel: true },
      minInterval: 1,
      position: 'top',
      splitLine: { show: true },
      offset: 28,
      axisLine: { show: false },
      axisTick: { show: false },
      axisPointer: { show: true, type: 'line', snap: true, label: { formatter: ({ value }) => String(value) }, triggerTooltip: false },
    },
    tooltip: {
      trigger: 'item',
    },
    dataset: [
      { id: 'original', source: input },
      ...repos.map(repo => ({
        id: repo,
        fromDatasetId: 'original',
        transform: [
          { type: 'filter', config: { value: repo, dimension: 'repo_name' } },
          { type: 'sort', config: { dimension: 'event_year', order: 'asc' } },
        ],
      })),
    ],
    series: repos.map(repo => ({
      type: 'line',
      id: repo,
      name: repo,
      datasetId: repo,
      encode: { x: 'event_year', y: 'rank' },
      smooth: true,
      lineStyle: {
        width: 3,
      },
      symbolSize: 8,
      symbol: 'circle',
      endLabel: {
        show: true,
        offset: [12, 0],
        width: 96,
        fontSize: 14,
        overflow: 'truncate',
        formatter: (param) => {
          const fullName = param.seriesName as string;
          const [owner, name] = fullName.split('/');
          if (owner === name) {
            return name;
          } else {
            return `{owner|${owner}/}\n${name}`;
          }
        },
        rich: {
          owner: {
            fontSize: 12,
            color: 'gray',
          },
        },
      },
      emphasis: { focus: 'series', label: { fontSize: 10 } },
      tooltip: {
        formatter: '{a}',
      },

    })),
    title: {
      id: 'title',
      text: `${collection?.name ?? 'undefined'} - ${ctx.parameters.activity}`,
    },
  };
}

export const type = 'echarts';

function getAllRepos (input: Input) {
  const set = new Set<string>();
  input.forEach((item) => {
    set.add(item.repo_name);
  });
  return [...set];
}

export function computeDynamicHeight (input: Input, ctx: WidgetVisualizerContext<Params>) {
  return getAllRepos(input).length * 36 + 128;
}
