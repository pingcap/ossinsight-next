import { CodeBlock, NoStyleCopyButton } from '@ossinsight/ui/src/components/CodeBlock';
import { htmlCode, ShareOptions } from '@ossinsight/ui/src/components/ShareBlock';
import { TextSkeleton } from '@ossinsight/ui/src/components/Skeleton';
import ArrowUpRightIcon from 'bootstrap-icons/icons/arrow-up-right.svg';
import { ReactNode } from 'react';
import { Pace, WindupChildren } from 'windups';

export function Code ({ shareInfo, editReadmeUrl }: { shareInfo: ShareOptions, editReadmeUrl: string | undefined }) {
  const { title, keywords, imageWidth, url, thumbnailUrl } = shareInfo;
  const code = htmlCode('auto', title, url, thumbnailUrl, imageWidth);
  const language = 'html';

  return (
    <div className="relative lg:h-full">
      <CodeBlock
        className="lg:h-full"
        code={code}
        language={language}
        wrap
        showCopyButton={false}
        heading="Code"
      />
      <div className="absolute bottom-8 flex items-center justify-center gap-4 w-full">
        <NoStyleCopyButton className="Button Button-primary px-4 w-[140px]" content={code}>
          Copy code
        </NoStyleCopyButton>
        <a className="inline-flex gap-1 items-center text-sm text-primary transition-opacity opacity-80 hover:opacity-100" target="_blank" href={editReadmeUrl}>
          Add to readme.md
          <ArrowUpRightIcon />
        </a>
      </div>
    </div>
  );
}

export function CodeLoading () {
  return (
    <CodeShell>
      <WindupChildren>
        <Pace ms={40}>
        <pre className="pt-14 px-4">
          <code>
            <p>
              <span className="text-emerald-600">
                <TextSkeleton characters={8} color="currentcolor">
                  {'\u2003'.repeat(8)}
                </TextSkeleton>
              </span>
              &nbsp;
              <span className="text-blue-900">
                <TextSkeleton characters={12} color="currentcolor">
                  {'\u2003'.repeat(12)}
                </TextSkeleton>
              </span>
              &nbsp;
              <span className="text-emerald-600">
                <TextSkeleton characters={8} color="currentcolor">
                  {'\u2003'.repeat(8)}
                </TextSkeleton>
              </span>
            </p>
            <p className="mt-2">
              <span className="text-yellow-600">
                <TextSkeleton characters={4} color="currentcolor">
                  {'\u2003'.repeat(4)}
                </TextSkeleton>
              </span>
              &nbsp;
              <span className="text-blue-900">
                <TextSkeleton characters={23} color="currentcolor">
                  {'\u2003'.repeat(23)}
                </TextSkeleton>
              </span>
            </p>
          </code>
        </pre>
        </Pace>
      </WindupChildren>
    </CodeShell>
  );
}

export function CodePending ({ type }: { type: string }) {
  return (
    <CodeShell>
      <div className="p-4 text-disabled flex items-center justify-center h-full text-sm">
        <span>No code yet, please input your {type} name</span>
      </div>
    </CodeShell>
  );
}

function CodeShell ({ children }: { children: ReactNode }) {
  return (
    <div className="relative !bg-code rounded lg:h-full">
      <div className="pt-4 px-4 absolute text-disabled text-sm">
        Code
      </div>
      {children}
    </div>
  );
}
