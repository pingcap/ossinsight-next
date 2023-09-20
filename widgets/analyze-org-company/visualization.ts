import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import {
  itemTooltip,
  dataset,
  legend,
} from '@ossinsight/widgets-utils/src/options';
import {
  d3Hierarchy,
  D3HierarchyItem,
} from '@ossinsight/widgets-utils/src/options/custom/d3-hierarchy';

type Params = {
  owner_id: string;
  activity?: string;
  period?: string;
};

type ParticipantDataPoint = {
  organization_name: string;
  participants: number;
};

type StarDataPoint = {
  organization_name: string;
  stars: number;
};

type DataPoint = ParticipantDataPoint | StarDataPoint;

type Input = [DataPoint[], DataPoint[] | undefined];

function transformCompanyData(
  data: DataPoint[],
  valueIndex: string | undefined
): D3HierarchyItem[] {
  if (!valueIndex) {
    return [];
  }
  return data.flatMap((item, index) => ({
    id: '',
    group: '',
    // name: xss(item.company_name),
    name: item.organization_name,
    depth: 1,
    value: item[valueIndex],
    index: 0,
    parentId: 'root',
  }));
}

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = {
    id: ctx.parameters.owner_id,
    fullName: ctx.parameters.owner_id,
  };

  const valueIndex = ctx.parameters?.activity || 'participants';

  const generateData = () => {
    let index = 0;
    const res = input
      .flatMap((data, i) =>
        transformCompanyData(data ?? [], valueIndex).map((item) => {
          item.id = `${i}-${item.name}`;
          item.index = index++;
          item.color = ['#dd6b66', '#759aa0'][i];
          return item;
        })
      )
      .concat([
        {
          id: 'root',
          name: '',
          depth: 0,
          value: 0,
          index: -1,
          parentId: '',
        },
      ]);
    // TEMP FIX: https://github.com/pingcap/ossinsight/issues/237
    if (res.length < 51) {
      res.push(
        ...new Array(51 - res.length).fill(0).map((_, i) => ({
          id: `ph-${i}`,
          name: '',
          depth: 1,
          value: 0,
          index: -1,
          parentId: 'root',
        }))
      );
    }
    const series = d3Hierarchy(res, 1);
    return {
      dataset: dataset(undefined, res),
      series,
    };
  };

  const { dataset: ds, series } = generateData();

  const option = {
    dataset: ds,
    legend: legend({
      icon: 'circle',
      selectedMode: false,
    }),
    tooltip: itemTooltip({
      formatter: (params) =>
        `${params.value.name as string}: ${params.value.value as string}`,
    }),
    hoverLayerThreshold: Infinity,
    series: [series],
  };

  return option;
}

export const type = 'echarts';