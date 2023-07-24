'use client';

import HTMLIcon from 'bootstrap-icons/icons/code-slash.svg';
import ImageIcon from 'bootstrap-icons/icons/image.svg';
import MarkdownIcon from 'bootstrap-icons/icons/markdown.svg';
import { CodeBlock } from '../CodeBlock';
import { Tab, Tabs } from '../Tabs';

export interface ShareBlockProps {
  title: string;
  url: string;
  thumbnailUrl: string;
}

export function ShareBlock ({
  title: blockTitle,
  url,
  thumbnailUrl,
}: ShareBlockProps) {
  return (
    <div>
      <Tabs>
        <Tab value="Markdown" title="markdown" icon={<MarkdownIcon />}>
          <CodeBlock language="markdown" code={`[![${blockTitle}](${thumbnailUrl})](${url})`} />
        </Tab>
        <Tab value="HTML" title="HTML" icon={<HTMLIcon />}>
          <CodeBlock code={`<a href="${url}" target="_blank">
  <img src="${thumbnailUrl}" width="640" height="480" alt="${blockTitle}">
</a>`} language="html" />
        </Tab>
        <Tab value="image" title="Thumbnail" icon={<ImageIcon />}>
          <CodeBlock code={`${thumbnailUrl}`} />
        </Tab>
      </Tabs>
    </div>
  );
}

