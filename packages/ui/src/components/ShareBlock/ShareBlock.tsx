'use client';

import HTMLIcon from 'bootstrap-icons/icons/code-slash.svg';
import ImageIcon from 'bootstrap-icons/icons/image.svg';
import MarkdownIcon from 'bootstrap-icons/icons/markdown.svg';
import SocialMediaIcon from 'bootstrap-icons/icons/send.svg';
import { CodeBlock } from '../CodeBlock';
import { Tab, Tabs } from '../Tabs';
import { TwitterButton } from './TwitterButton';

export interface ShareBlockProps {
  title: string;
  url: string;
  thumbnailUrl: string;
  keywords?: string[];
  imageWidth: number;
  themedImage?: boolean;
}

export function ShareBlock ({
  title: blockTitle,
  url,
  thumbnailUrl,
  keywords,
  imageWidth,
  themedImage = false,
}: ShareBlockProps) {
  return (
    <div>
      <Tabs className="mt-2">
        <Tab value="Social media" title="Social media" icon={<SocialMediaIcon />}>
          <div className="flex items-center justify-center gap-4">
            <TwitterButton text={blockTitle} tags={keywords} url={url} />
          </div>
        </Tab>
        <Tab value="Markdown" title="markdown" icon={<MarkdownIcon />}>
          <CodeBlock language={themedImage ? 'html' : 'markdown'} code={markdownCode(themedImage, blockTitle, url, thumbnailUrl, imageWidth)} />
        </Tab>
        <Tab value="HTML" title="HTML" icon={<HTMLIcon />}>
          <CodeBlock code={htmlCode(themedImage, blockTitle, url, thumbnailUrl, imageWidth)} language="html" />
        </Tab>
        <Tab value="image" title="Thumbnail" icon={<ImageIcon />}>
          <CodeBlock code={`${thumbnailUrl}`} />
        </Tab>
      </Tabs>
    </div>
  );
}


function markdownCode (themed: boolean, title: string, url: string, thumbnailUrl: string, width: number) {
  if (!themed) {
    return `[![${title}](${thumbnailUrl})](${url})`;
  }
  return `<a href="${url}" target="_blank" style="display: block" align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${thumbnailUrl}&color_scheme=light" width="${width + 8}" height="auto">
    <img alt=${JSON.stringify(title)} src="${thumbnailUrl}&color_scheme=light" width="${width + 8}" height="auto">
  </picture>
</a>`
}

function htmlCode (themed: boolean, title: string, url: string, thumbnailUrl: string, width: number) {
  if (!themed) {
    return `<a href="${url}" target="_blank">
  <img src="${thumbnailUrl}" style="border-radius: 12px; box-shadow: 0px 4px 4px 0px rgba(36, 39, 56, 0.25)" width="${width}" height="auto" alt="${title}">
</a>`
  }
  return markdownCode(themed, title, url, thumbnailUrl, width);
}
