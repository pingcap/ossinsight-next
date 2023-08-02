/// <reference types="next" />
import type { WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { Flex, Span } from '@ossinsight/widgets-utils/src/react-html';
import type { ReactElement, ReactNode } from 'react';
import type { Input } from './visualization';

export default function Component ({ input: [overview], ctx }: { input: Input, ctx: WidgetVisualizerContext<any> }) {
  const user = ctx.getUser(overview.user_id);
  const avatar = `https://github.com/${user.login}.png`;

  return (
    <Flex className="w-full h-full text-content flex-col px-4" gap={2}>
      <Flex items="stretch" gap={8}>
        <img src={avatar} style={{ width: 64, height: 64, borderRadius: 32 }} />
        <Flex className="flex-col justify-between">
          <Span className="text-white font-bold flex-1 flex items-center" style={{ fontSize: 24 }}>{user.login}</Span>
          <Span className="flex-1 flex items-center">TODO: bio</Span>
        </Flex>
      </Flex>
      <Columns gap={8}>
        <Flex className="flex-col flex-1">
          <ItemPair title="Stared Repos" icon={StarIcon}>
            {overview.star_repos}
          </ItemPair>
          <ItemPair title="Contributed to" icon={RepoIcon}>
            {overview.contribute_repos}
          </ItemPair>
          <ItemPair title="Pull Requests" icon={PRIcon}>
            {overview.pull_requests}
          </ItemPair>
        </Flex>
        <Flex className="flex-col flex-1">
          <ItemPair title="Stars Earned" icon={StarIcon}>
            {overview.star_repos}
          </ItemPair>
          <ItemPair title="Issues" icon={IssueIcon}>
            {overview.issues}
          </ItemPair>
          <ItemPair title="Code Reviews" icon={ReviewIcon}>
            {overview.code_reviews}
          </ItemPair>
        </Flex>
      </Columns>
      <ItemPair title="Code Changes" icon={PRIcon}>
        <Flex className="w-full" justify="center" gap={2}>
          <Span className="text-green-400">
            +{overview.code_additions}
          </Span>
          {' / '}
          <Span className="text-red-400">
            -{overview.code_deletions}
          </Span>
        </Flex>
      </ItemPair>
    </Flex>
  );
}

function Columns ({ className, gap, children }: { className?: string, gap?: number, children: ReactNode }) {
  return (
    <Flex className={className} items="flex-start" justify="space-between" gap={gap}>
      {children}
    </Flex>
  );
}

function ItemPair ({ icon, title, children }: { icon?: ReactElement, title: string, children: ReactNode }) {
  return (
    <Flex className="h-14 w-full" justify="space-between" items="center" gap={2}>
      {icon}
      <Span className="text-[rgb(200,200,200)]">
        {title}:
      </Span>
      <Flex className="flex-1 text-[#E9EaEE]" style={{ fontWeight: 400, justifyContent: 'flex-end' }} items="center" gap={2}>
        {children}
      </Flex>
    </Flex>
  );
}

const StarIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ff9d36" viewBox="0 0 16 16">
  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
</svg>;
const RepoIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#6940d0" viewBox="0 0 16 16">
  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
</svg>;
const IssueIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#fde494" viewBox="0 0 16 16">
  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
</svg>;
const PRIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#d34764" viewBox="0 0 16 16">
  <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
</svg>;
const ReviewIcon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#2f92ff" viewBox="0 0 16 16">
  <path
    d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 13H8.061l-2.574 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-8.5C0 1.784.784 1 1.75 1ZM1.5 2.75v8.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Zm5.28 1.72a.75.75 0 0 1 0 1.06L5.31 7l1.47 1.47a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-2-2a.75.75 0 0 1 0-1.06l2-2a.75.75 0 0 1 1.06 0Zm2.44 0a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.69 7 9.22 5.53a.75.75 0 0 1 0-1.06Z" />
</svg>;