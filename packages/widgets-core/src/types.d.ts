import { CSSProperties } from 'react';
import { LinkedData } from './parameters/resolver';

export type ParserConfig = {
  type: 'json'
  extract: string // https://www.npmjs.com/package/jsonpath
}

export interface WidgetVisualizationProps {
  type: string;
  visualizer: any;
  data: any;
  parameters: any;
  linkedData: LinkedData;
}

export interface WidgetReactVisualizationProps extends WidgetVisualizationProps {
  className?: string;
  style?: CSSProperties;
}
