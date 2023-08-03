import { SiteBannerConfig } from '../../types/ui-config';
import { renderMarkdown } from './utils';
import './style.scss';

export interface SiteBannerProps {
  banner: SiteBannerConfig;
}

export function SiteBanner ({ banner: { content, closable, style } }: SiteBannerProps) {
  return (
    <div
      className="Banner py-2 text-xs border-b-indigo-950 bg-indigo-700 text-subtitle flex items-center justify-center"
      style={style}
    >
      {renderMarkdown(content)}
    </div>
  );
}
