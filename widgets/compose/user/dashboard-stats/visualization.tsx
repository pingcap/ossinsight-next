/** @jsxRuntime classic */
/** @jsx Compose */

import Compose, { Card } from '@ossinsight/compose';
import type { WidgetVisualizerContext } from '@ossinsight/widgets-types';

type Params = {
  user_id: string;
};

// todo: update it
type DataPoint = {
  actor_login: string;
  events: number;
};

type Input = [DataPoint[]];

const mockItems = [
  {
    icon: 'gh-star',
    label: 'Starred Repos',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
  {
    icon: 'gh-star',
    label: 'Starred Earned',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
  {
    icon: 'gh-repo',
    label: 'Contributed to',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
  {
    icon: 'gh-pr',
    label: 'Pull Requests',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
  {
    icon: 'gh-pr',
    label: 'PR Code Changes',
    type: 'avatar-label',
  },
  {
    type: 'label-value',
    label: `+123,456`,
    value: `-123,456`,
  },
  ,
  {
    icon: 'gh-issue',
    label: 'Issues',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
  {
    icon: 'gh-code-review',
    label: 'Code Reviews',
    type: 'avatar-label',
  },
  {
    type: 'text',
    label: `123,456`,
  },
  ,
];

const mockLanguages = [
  {
    name: 'JavaScript',
    percent: 0.3,
  },
  {
    name: 'TypeScript',
    percent: 0.2,
  },
  {
    name: 'Python',
    percent: 0.2,
  },
  {
    name: 'Go',
    percent: 0.1,
  },
  {
    name: 'C++',
    percent: 0.1,
  },
  {
    name: 'Java',
    percent: 0.05,
  },
  {
    name: 'Rust',
    percent: 0.05,
  },
];

const mock12Langs = [
  {
    name: 'JavaScript',
    percent: 0.3,
  },
  {
    name: 'TypeScript',
    percent: 0.2,
  },
  {
    name: 'Python',
    percent: 0.2,
  },
  {
    name: 'Go',
    percent: 0.1,
  },
  {
    name: 'C++',
    percent: 0.1,
  },
  {
    name: 'Java',
    percent: 0.05,
  },
  {
    name: 'Rust',
    percent: 0.05,
  },
  {
    name: 'Ruby',
    percent: 0.05,
  },
  {
    name: 'PHP',
    percent: 0.05,
  },
  {
    name: 'C#',
    percent: 0.05,
  },
  {
    name: 'C',
    percent: 0.05,
  },
  {
    name: 'Shell',
    percent: 0.05,
  },
];

const languangeColors = [
  '#f1e05a',
  '#2b7489',
  '#3572A5',
  '#e34c26',
  '#563d7c',
  '#b07219',
  '#4F5D95',
  '#f1e05a',
  '#178600',
  '#0052cc',
  '#701516',
  '#c22d40',
  '#f1e05a',
  '#e34c26',
  '#b07219',
  '#563d7c',
  '#4F5D95',
  '#178600',
  '#0052cc',
  '#701516',
  '#c22d40',
];

const handleLangs = (langs: typeof mockLanguages, maxLangs = 7) => { 
  const sortedLangs = langs.sort((a, b) => b.percent - a.percent);
  if (sortedLangs.length <= maxLangs) return sortedLangs;
  const top7Langs = sortedLangs.slice(0, maxLangs);
  const otherLangs = sortedLangs.slice(maxLangs);
  const otherLangsPercent = otherLangs.reduce((acc, cur) => acc + cur.percent, 0);
  return [...top7Langs, { name: 'Others', percent: otherLangsPercent }];
}

export default function (
  input: Input,
  ctx: WidgetVisualizerContext<Params>
): Compose.JSX.Element {

  const handledLangs = handleLangs(mock12Langs);

  return (
    <Card title={`vitalovevitamin's GitHub Dashboard`} subtitle=' '>
      <grid rows={1} cols={2} gap={4} data={mockItems} ifEmpty='indicator'>
        <flex direction='vertical' gap={4}>
          <grid
            grow={0.7}
            rows={7}
            cols={2}
            gap={4}
            data={mockItems}
            ifEmpty='indicator'
          >
            {...mockItems.map((item) => {
              if (item.type === 'text') {
                return <builtin-label label={`123,456`} />;
              }
              if (item.type === 'label-value') {
                if (ctx.runtime === 'server') {
                  return (
                    <flex direction='horizontal'>
                      <builtin-label labelColor="#6CA963" label={`+123,456`} />
                      <builtin-label label={`/`} grow={0.3} />
                      <builtin-label labelColor="#D45D52" label={`-123,456`} />
                    </flex>
                  )
                }
                return (
                  <builtin-label-value
                    column={false}
                    label={item.label}
                    value={item.value}
                    labelProps={{
                      style: {
                        color: 'green',
                        lineHeight: 1,
                      },
                    }}
                    valueProps={{
                      style: { color: 'red', fontSize: 12 },
                    }}
                    spliter='/'
                  />
                );
              }
              return (
                <builtin-avatar-label
                  label={item.label}
                  imgSize={20}
                  imgSrc={item.icon}
                />
              );
            })}
          </grid>
          <flex direction='vertical' grow={0.3}>
            {/* <builtin-label label={'bar'} /> */}
            <builtin-progress-bar
              items={handledLangs.map((lang, idx) => ({
                label: lang.name,
                percentage: lang.percent,
                color: languangeColors[idx],
              }))}
            />
            <flex direction='vertical' gap={2}>
              {handledLangs
                .reduce((acc, cur, idx) => {
                  if (idx % 4 === 0) {
                    acc.push([]);
                  }
                  acc[acc.length - 1].push(cur);
                  return acc;
                }, [] as (typeof handledLangs)[])
                .map((langs, idx1) => (
                  <flex direction='horizontal' gap={2}>
                    {langs.map((lang, idx2) => (
                      <builtin-avatar-label
                        label={lang.name}
                        imgSrc='filled-circle'
                        imgProps={{
                          style: {
                            fill: languangeColors[idx1*4 + idx2],
                            height: 12,
                            width: 12,
                          },
                        }}
                      />
                    ))}
                    {
                      langs.length < 4 && new Array(4 - langs.length).fill(0).map(() => (
                        <builtin-avatar-label
                          label={''}
                          imgSrc=''
                        />
                      ))
                    }
                  </flex>
                ))}
            </flex>
          </flex>
        </flex>
        <flex direction='vertical' gap={4}>
          <builtin-label label={'chart'} />
        </flex>
      </grid>
    </Card>
  );
}

export const type = 'compose';

export const width = 770;
export const height = 366;
