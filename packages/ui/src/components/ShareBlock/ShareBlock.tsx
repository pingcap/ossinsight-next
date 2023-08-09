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
}

export function ShareBlock ({
  title: blockTitle,
  url,
  thumbnailUrl,
  keywords,
  imageWidth,
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
          <CodeBlock language="markdown" code={`[![${blockTitle}](${thumbnailUrl})](${url})`} />
        </Tab>
        <Tab value="HTML" title="HTML" icon={<HTMLIcon />}>
          <CodeBlock code={`<a href="${url}" target="_blank">
  <img src="${thumbnailUrl}" style="border-radius: 12px; box-shadow: 0px 4px 4px 0px rgba(36, 39, 56, 0.25)" width="${imageWidth}" height="auto" alt="${blockTitle}">
</a>`} language="html" />
        </Tab>
        <Tab value="image" title="Thumbnail" icon={<ImageIcon />}>
          <CodeBlock code={`${thumbnailUrl}`} />
        </Tab>
      </Tabs>
    </div>
  );
}

