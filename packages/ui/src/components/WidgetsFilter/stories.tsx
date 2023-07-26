import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import './style.scss';
import { WidgetsFilter } from './WidgetsFilter';

export default {
  title: 'Components/WidgetsFilter',
  component: WidgetsFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story: any) => {
      return <div className="max-w-[400px]"><Story /></div>;
    },
  ],
} satisfies Meta<typeof WidgetsFilter>;

export const Default = {
  args: {
    availableTags: ['foo', 'bar', 'Repository', 'PRs', 'Stars'],
  },
  render: (args) => {
    const [config, setConfig] = useState({ tags: [], search: '' });

    return <WidgetsFilter availableTags={args.availableTags} config={config} onConfigChange={setConfig} />;
  },
} satisfies StoryObj<typeof WidgetsFilter>;
