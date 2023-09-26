'use client';
import Engagement from '@/app/analyze/[owner]/(sections)/(participant)/engagement';
import Origins from '@/app/analyze/[owner]/(sections)/(participant)/origins';
import Issue from '@/app/analyze/[owner]/(sections)/issue';
import Overview from '@/app/analyze/[owner]/(sections)/overview';
import StarGrowth from '@/app/analyze/[owner]/(sections)/star-growth';

import { DEFAULT_NAV_ID, getNavItemById } from '@/components/Analyze/Navigation/OrgNav';
import { notFound, useSearchParams } from 'next/navigation';
import * as React from 'react';
import CodeReviewEfficiency from './(sections)/(productivity)/code-review-efficiency';
import CodeSubmissionEfficiency from './(sections)/(productivity)/code-submission';
import PRRequestEfficiency from './(sections)/(productivity)/pull-request-efficiency';

export default function OrgAnalyzePageContent () {
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
      <Overview />
      <StarGrowth />
      <Issue />
      <Origins />
      <Engagement />
      <PRRequestEfficiency />
      <CodeReviewEfficiency />
      <CodeSubmissionEfficiency />
    </>
  );
}
