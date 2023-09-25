import type {
  EChartsVisualizationConfig,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';
import { axisTooltip, simpleGrid } from '@ossinsight/widgets-utils/src/options';

type Params = {
  owner_id: string;
  hideData?: boolean;
};

type DataPoint = {
  repos: number;
  engagements: number;
  participants: number;
  participant_logins: string;
};

type Input = [DataPoint[], DataPoint[] | undefined];

const calcMinMax = (data: DataPoint[]) => {
  let repoMin = Infinity;
  let repoMax = -Infinity;
  let engagementsMin = Infinity;
  let engagementsMax = -Infinity;
  for (const d of data) {
    if (d.repos < repoMin) {
      repoMin = d.repos;
    }
    if (d.repos > repoMax) {
      repoMax = d.repos;
    }
    if (d.engagements < engagementsMin) {
      engagementsMin = d.engagements;
    }
    if (d.engagements > engagementsMax) {
      engagementsMax = d.engagements;
    }
  }
  return [repoMin, repoMax, engagementsMin, engagementsMax];
};

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.parameters.owner_id;
  const vs = ctx.parameters.owner_id;
  const hideData = !!ctx.parameters.hideData;

  const [data] = input;

  const [repoMin, repoMax, engagementsMin, engagementsMax] = calcMinMax(data);

  return {
    dataset: [
      {
        id: 'main',
        source: hideData ? [] : data,
      },
    ],
    xAxis: {
      name: 'engagements',
      splitLine: { show: false },
      max: engagementsMax,
    },
    yAxis: {
      name: 'repos',
      splitLine: { show: false },
      max: repoMax,
    },
    grid: {
      left: 8,
      top: 40,
      right: 90,
      bottom: 8,
      containLabel: true,
    },
    series: {
      type: 'scatter',
      encode: {
        x: 'engagements',
        y: 'repos',
      },
      symbolSize: 30,
      itemStyle: {
        color: '#4E9FFF',
      },
      id: 'main',
      // symbol: (value, params) => {
      //   return `image://https://github.com/${
      //     value?.participant_logins?.split(',')[0]
      //   }.png`;
      // },
    },
    tooltip: {
      show: true,
      formatter: (params) => {
        const { data } = params;
        return `<p>Involved in: <b>${data?.repos} repos</b></p>
        <p>Contribution count: <b>${data?.engagements}</b></p>
        <p><hr style="margin-bottom: .5rem;" /></p>
        ${generateHtmlFromLogins(data?.participant_logins)}`;
      },
    },
    legend: {
      show: true,
      top: '6%',
    },
  };
}

function generateHtmlFromLogins(loginStr: string, max = 4) {
  const logins = loginStr.split(',');
  const innerHtml = logins
    .slice(0, max)
    .map(
      (login) =>
        `<img alt="${login}" src="https://github.com/${login}.png" style="width:1rem;height:1rem;" />`
    )
    .join('');
  const moreHtml = logins.length > max ? `+${logins.length - max}` : '';
  return `<p style="display:inline-flex; gap:0.25rem;">${innerHtml}${moreHtml}</p>`;
}

export const type = 'echarts';
