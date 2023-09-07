import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';
import {
  worldMapGeo,
  scatters,
  itemTooltip,
} from '@ossinsight/widgets-utils/src/options';
import { alpha2ToGeo, alpha2ToTitle } from '@ossinsight/widgets-utils/src/geo';

type Params = {
  owner_id: string;
};

type DataPoint = {
  country_code: string;
  stars: number;
};

type Input = [DataPoint[], DataPoint[] | undefined];

export type LocationData = {
  country_or_area: string;
  count: number;
};

const dataPointToLocationData = (data: DataPoint[]): LocationData[] => {
  return data.map((item) => ({
    country_or_area: item.country_code,
    count: item.stars,
  }));
};

function transformData(
  data: LocationData[]
): Array<[string, number, number, number]> {
  return data
    .map((item) => {
      const title = alpha2ToTitle(item.country_or_area);
      const { long, lat } = alpha2ToGeo(item.country_or_area) ?? {};
      return [title, long, lat, item.count] as [string, number, number, number];
    })
    .sort((a, b) => Math.sign(b[3] - a[3]));
}

function datasets(idPrefix: string, topN: number, data: LocationData[]): any[] {
  const transformedData = transformData(data);
  return [
    {
      id: `${idPrefix}_top_${topN}`,
      source: transformedData.slice(0, topN),
    },
    {
      id: `${idPrefix}_rest`,
      source: transformedData.slice(topN),
    },
  ];
}

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.parameters.owner_id;
  const vs = ctx.parameters.owner_id;

  const max = input
    .flat()
    .reduce((prev, current) => Math.max(prev, current?.stars || 0), 1);

  const option = {
    dataset: compare(input, (data, name) =>
      datasets(name, 1, dataPointToLocationData(data))
    ).flat(),
    geo: worldMapGeo(),
    series: compare([main, vs], (data, name) => [
      ...scatters(name, 1, max, {
        name: data,
      }),
    ]).flat(),
    tooltip: itemTooltip(),
    legend: {
      show: true,
      top: '6%',
    },
  };

  return option;
}

export const type = 'echarts';