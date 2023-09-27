'use client';
import Engagement from '@/app/analyze/[owner]/_sections/participant/engagement';
import Origins from '@/app/analyze/[owner]/_sections/participant/origins';
import Issue from '@/app/analyze/[owner]/_sections/issue';
import Overview from '@/app/analyze/[owner]/_sections/overview';
import StarGrowth from '@/app/analyze/[owner]/_sections/star-growth';
import * as React from 'react';
import CodeReviewEfficiency from './_sections/productivity/code-review-efficiency';
import CodeSubmissionEfficiency from './_sections/productivity/code-submission';
import PRRequestEfficiency from './_sections/productivity/pull-request-efficiency';

export default function OrgAnalyzePageContent () {

  return (
    <>
      <Overview />
      <StarGrowth />
      <Engagement />
      <Origins />
      <PRRequestEfficiency />
      <CodeReviewEfficiency />
      <CodeSubmissionEfficiency />
      <Issue />
    </>
  );
}
