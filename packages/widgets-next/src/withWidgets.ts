import type { NextConfig } from 'next';
import { generateModule } from './generateModule';

export function withWidgets (config: NextConfig): NextConfig {

  generateModule();

  return config;
}
