import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
// import { compare } from '@ossinsight/widgets-utils/src/visualizer/analyze';
import {
  itemTooltip,
  dataset,
  legend,
} from '@ossinsight/widgets-utils/src/options';
import {
  d3Hierarchy,
  D3HierarchyItem,
} from '@ossinsight/widgets-utils/src/options/custom/d3-hierarchy';
// import xss from 'xss';

type Params = {
  repo_id: string;
  vs_repo_id?: string;
  activity: string;
};

type DataPoint = {
  company_name: string;
  proportion: number;
  stargazers: number;
};

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
    name: item.company_name,
    depth: 1,
    value: item[valueIndex],
    index: 0,
    parentId: 'root',
  }));
}

const companyValueIndices = {
  'analyze-stars-company': 'stargazers',
  'analyze-issue-creators-company': 'issue_creators',
  'analyze-pull-request-creators-company': 'code_contributors',
};

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.getRepo(parseInt(ctx.parameters.repo_id));
  const vs = ctx.getRepo(parseInt(ctx.parameters.vs_repo_id));

  const companyType = `analyze-${ctx.parameters.activity || 'stars'}-company`;
  const valueIndex = companyValueIndices[companyType];

  const generateData = () => {
    let index = 0;
    const shrinkedInput = input.map((i) => (!!vs ? i?.slice(0, 25) : i));
    const res = shrinkedInput
      .flatMap((data, i) =>
        transformCompanyData(data ?? [], valueIndex).map((item) => {
          item.id = `${i}-${item.name}`;
          item.index = index++;
          item.color = ctx.theme.echartsColorPalette[i];
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
    series: [
      // ...compare([main, vs], (data, name) => ({
      //   type: 'custom',
      //   name: data.fullName,
      //   color: [],
      //   coordinateSystem: 'none',
      // })),
      series,
    ],
  };

  return option;
}

export const type = 'echarts';
