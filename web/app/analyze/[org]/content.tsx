'use client';
import * as React from 'react';
import {
  useParams,
  usePathname,
  useSearchParams,
  redirect,
  notFound,
} from 'next/navigation';

import {
  navItems,
  getNavItemById,
  DEFAULT_NAV_ID,
} from '@/components/Analyze/Navigation/OrgNav';
import Overview from '@/app/analyze/[org]/(sections)/overview';
import StarGrowth from '@/app/analyze/[org]/(sections)/star-growth';
import Issue from '@/app/analyze/[org]/(sections)/issue';
import Origins from '@/app/analyze/[org]/(sections)/(participant)/origins';
import Engagement from '@/app/analyze/[org]/(sections)/(participant)/engagement';
import PRRequestEfficiency from './(sections)/(productivity)/pull-request-efficiency';
import CodeReviewEfficiency from './(sections)/(productivity)/code-review-efficiency';
import CodeSubmissionEfficiency from './(sections)/(productivity)/code-submission';

export default function OrgAnalyzePageContent() {
  const searchParams = useSearchParams();

  const sectionMemo = React.useMemo(() => {
    const targetSectionId = searchParams.get('section') || DEFAULT_NAV_ID;
    const targetNavItem = getNavItemById(targetSectionId);
    return targetNavItem;
  }, [searchParams]);

  if (!sectionMemo) {
    return notFound();
  }

  return (
    <>
      {sectionMemo.id === 'overview' && <Overview />}
      {sectionMemo.id === 'star-growth' && <StarGrowth />}
      {sectionMemo.id === 'issue' && <Issue />}
      {sectionMemo.id === 'origins' && <Origins />}
      {sectionMemo.id === 'engagement' && <Engagement />}
      {sectionMemo.id === 'pull-request-efficiency' && <PRRequestEfficiency />}
      {sectionMemo.id === 'code-review-efficiency' && <CodeReviewEfficiency />}
      {sectionMemo.id === 'code-submission' && (
        <CodeSubmissionEfficiency />
      )}
    </>
  );
}
