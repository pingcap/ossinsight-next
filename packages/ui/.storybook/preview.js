import {themes} from "@storybook/theming";
import './global.scss'

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'ossinsight dark',
      values: [
        {
          name: 'ossinsight dark',
          value: 'var(--background-color-body)',
        },
      ]
    },
    docs: {
      theme: themes.dark,
    },
  }
};

export default preview;
