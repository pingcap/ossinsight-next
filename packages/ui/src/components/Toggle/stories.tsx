import { Meta, StoryObj } from '@storybook/react';
import { SingleToggleButtonGroup } from './ToggleButton';

export default {
  title: 'Components/Toggle',
  component: SingleToggleButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story: any) => {
      return (
        <div className='max-w-[400px]'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof SingleToggleButtonGroup>;

export const Default = {
  args: {
    defaultValue: 'a',
    items: [
      {
        id: 'a',
        value: 'a',
        label: 'A',
      },
      {
        id: 'b',
        value: 'b',
        label: 'BBBBB',
      },
      {
        id: 'c',
        value: 'c',
        label: 'CCCCCCCCC',
      }
    ],
  },
} satisfies StoryObj<typeof SingleToggleButtonGroup>;
