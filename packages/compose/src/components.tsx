/** @jsxRuntime classic */
/** @jsx Compose */

import { Spacing } from '@ossinsight/widgets-utils/src/compose';
import Compose from './factory';

export const CARD_COMMON_PADDING = 24;
export const CARD_COMMON_HEADING_HEIGHT = 48;

const CARD_COMMON_PADDING_SHAPE: Spacing = [0, CARD_COMMON_PADDING, CARD_COMMON_PADDING / 2, CARD_COMMON_PADDING];

export interface CardProps {
  padding?: Spacing;
  headerHeight?: number;
  title?: string;
  subtitle?: string;
  children?: Compose.ComposeNodes;
}

export function Card ({
  padding = CARD_COMMON_PADDING_SHAPE,
  headerHeight = CARD_COMMON_HEADING_HEIGHT,
  title,
  subtitle,
  children,
}: CardProps) {
  return (
    <flex direction="vertical" padding={padding}>
      <builtin-card-heading title={title} subtitle={subtitle} size={headerHeight} />
      {children}
    </flex>
  );
}
