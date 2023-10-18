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
  let participantsMin = Infinity;
  let participantsMax = -Infinity;
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
    if (d.participants < participantsMin) {
      participantsMin = d.participants;
    }
    if (d.participants > participantsMax) {
      participantsMax = d.participants;
    }
  }
  return [
    repoMin,
    repoMax,
    engagementsMin,
    engagementsMax,
    participantsMin,
    participantsMax,
  ];
};

const handleData = (
  data: DataPoint[],
  option?: {
    xIntervals?: number;
    yIntervals?: number;
  }
): DataPoint[] => {
  const { xIntervals = 5, yIntervals = 5 } = option ?? {};
  const [repoMin, repoMax, engagementsMin, engagementsMax] = calcMinMax(data);
  const xInterval = Math.ceil((engagementsMax - engagementsMin) / xIntervals);
  const yInterval = Math.ceil((repoMax - repoMin) / yIntervals);

  const matrix = Array.from({ length: xIntervals }, () =>
    Array.from({ length: yIntervals }, () => [])
  );
  for (const d of data) {
    const xIdx = Math.floor((d.engagements - engagementsMin) / xInterval);
    const yIdx = Math.floor((d.repos - repoMin) / yInterval);
    matrix[xIdx][yIdx].push(d);
  }

  const result: DataPoint[] = [];
  for (let i = 0; i < xIntervals; i++) {
    for (let j = 0; j < yIntervals; j++) {
      const d = matrix[i][j];
      if (d.length) {
        result.push({
          repos: repoMin + (j + 1) * yInterval,
          engagements: engagementsMin + (i + 1) * xInterval,
          participants: d.reduce((acc, cur) => acc + cur.participants, 0),
          participant_logins: d.map((d) => d.participant_logins).join(','),
        });
      }
    }
  }
  return result;
};

const getIntervalMinMax = (option: {
  min: number;
  max: number;
  intervals: number;
  value: number;
}) => {
  const { min, max, intervals, value } = option;
  const interval = (max - min) / intervals;
  const idx = Math.floor((value - min) / interval);
  return {
    min: Math.floor(min + idx * interval),
    max: Math.ceil(min + (idx + 1) * interval),
  };
};

const MAX_SYMBOL_SIZE = 50;
const MIN_SYMBOL_SIZE = 10;
const X_INTERVALS = 5;
const Y_INTERVALS = 5;

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): EChartsVisualizationConfig {
  const main = ctx.parameters.owner_id;
  const vs = ctx.parameters.owner_id;
  const hideData = !!ctx.parameters.hideData;

  const [data] = input;

  const [
    repoMin,
    repoMax,
    engagementsMin,
    engagementsMax,
    participantsMin,
    participantsMax,
  ] = calcMinMax(data);
  const handledData = handleData(data, {
    xIntervals: X_INTERVALS,
    yIntervals: Y_INTERVALS,
  });

  return {
    dataset: [
      {
        id: 'main',
        source: hideData ? [] : handledData,
      },
    ],
    xAxis: {
      name: 'engagements',
      splitLine: { show: false },
      max: Math.floor(engagementsMax * ((X_INTERVALS + 1) / X_INTERVALS)),
    },
    yAxis: {
      name: 'repos',
      splitLine: { show: false },
      min: repoMin,
      max: Math.floor(repoMax * ((Y_INTERVALS + 1) / Y_INTERVALS)),
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
      symbolSize: (value, params) => {
        const { participants } = value;
        const size =
          Math.sqrt(participants / participantsMax) * MAX_SYMBOL_SIZE;
        return size < MIN_SYMBOL_SIZE ? MIN_SYMBOL_SIZE : size;
      },
      itemStyle: {
        color: '#4E9FFF',
      },
      id: 'main',
    },
    tooltip: {
      show: true,
      formatter: (params) => {
        const { data } = params;
        const repoMinMax = getIntervalMinMax({
          min: repoMin,
          max: repoMax,
          intervals: Y_INTERVALS,
          value: data?.repos,
        });
        const engagementMinMax = getIntervalMinMax({
          min: engagementsMin,
          max: engagementsMax,
          intervals: X_INTERVALS,
          value: data?.engagements,
        });
        return `<p>Involved in: <b>${repoMinMax.min}~${
          repoMinMax.max
        } repos</b></p>
        <p>Contribution count: <b>${engagementMinMax.min}~${
          engagementMinMax.max
        }</b></p>
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
