import { Meta, StoryObj } from '@storybook/react';
import { BadgeSvg } from './BadgeSvg';

export default {
  title: 'Components/BadgeSvg',
  component: BadgeSvg,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta;

export const Default = {
  args: {
    fontFamily: "sans-serif",
    fontSize: 12,
    fontWeight: 400,
    parts: [
      { text: 'Open Source Database', color: 'rgb(187,187,187)', backgroundColor: 'rgb(67,67,69)' },
      { text: 'No. 3', color: 'rgb(77,77,77)', backgroundColor: 'rgb(255,232,149)' },
    ],
    partPadding: [6, 2],
  },
} satisfies StoryObj<typeof BadgeSvg>;
