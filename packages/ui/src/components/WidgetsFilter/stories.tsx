import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WidgetsFilter } from './WidgetsFilter';

export default {
  title: 'Components/WidgetsFilter',
  component: WidgetsFilter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story: any) => {
      return <div><Story /></div>;
    },
  ],
} satisfies Meta<typeof WidgetsFilter>;

export const Default = {
  args: {
    availableTags: ['foo', 'bar', 'Repository', 'PRs', 'Stars'],
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
} satisfies StoryObj<typeof WidgetsFilter>;

function Wrapper (args: any) {
  const [config, setConfig] = useState({ tag: 'Featured', search: '' });

  return (
    <>
      <WidgetsFilter {...args} config={config} onConfigChange={setConfig} />
      <pre>{JSON.stringify(config, undefined, 2)}</pre>
    </>
  );
}
