import type { NextConfig } from 'next';
import { generateModule } from './generateModule';

export function withWidgets (config: NextConfig): NextConfig {

  const widgets = generateModule();

  const originalWebpack = config.webpack;

  config.webpack = (config, context) => {
    config = originalWebpack(config, context);

    Object.entries(widgets).forEach(([name, path]) => {
      config.resolve.alias[name] = path;
    }, {} as Record<string, string>);

    return config;
  };

  return config;
}
