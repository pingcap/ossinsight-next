import { ReactElement } from 'react';
import * as prod from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { Plugin, unified } from 'unified';

export function renderMarkdown (value: string): ReactElement {
  const result = processor.processSync({ value });
  return result.result;
}

const validate: Plugin<[], import('mdast').Root, import('mdast').Root> = function () {
  return (node: any) => {
    if (node.children.length !== 1 || node.children[0].type !== 'paragraph') {
      throw new Error('Banner markdown support only one toplevel paragraph block');
    }
    return node;
  };
};

const processor = unified()
  .use(remarkParse)
  .use(validate)
  .use(remarkRehype)
  .use(rehypeReact, {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
  } as any)
  .freeze();
