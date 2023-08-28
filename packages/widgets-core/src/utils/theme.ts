type Theme = {
  CardHeader: {
    titleColor: string
    subtitleColor: string
  }
  Label: {
    color: string
  }
  Value: {
    color: string
  }
  Avatar: {
    fallbackColor: string;
  }
}

type ColorSchemes = Record<string, Theme>

const light: Theme = {
  CardHeader: {
    titleColor: 'rgb(62, 62, 63)',
    subtitleColor: 'rgb(121, 121, 121)',
  },
  Label: {
    color: 'black',
  },
  Value: {
    color: 'black',
  },
  Avatar: {
    fallbackColor: '#f7f8f9'
  }
};

const dark: Theme = {
  CardHeader: {
    titleColor: 'rgb(193, 193, 193)',
    subtitleColor: 'rgb(124, 124, 124)',
  },
  Label: {
    color: 'white',
  },
  Value: {
    color: 'white',
  },
  Avatar: {
    fallbackColor: 'rgb(37, 37, 39)'
  }
};

const COLOR_SCHEMES: ColorSchemes = {
  light,
  dark,
};

export function themed<T> (colorScheme: string, getter: (theme: Theme) => T) {
  const theme = getTheme(colorScheme);

  return getter(theme);
}

export function getTheme (colorScheme: string): Theme {
  return COLOR_SCHEMES[colorScheme] ?? dark;
}
