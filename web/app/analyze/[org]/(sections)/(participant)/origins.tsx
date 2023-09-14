'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { AnalyzeOrgContext } from '@/components/Context/Analyze/AnalyzeOrg';
import {
  CompanyRankTable,
  GeoRankTable,
} from '@/components/Analyze/Table/RankTable';

export default function OriginsContent() {
  const { orgName, orgId } = React.useContext(AnalyzeOrgContext);

  return (
    <SectionTemplate
      title='Participant'
      description='Examine participation dynamics within your organization, analyzing participant activity, engagement depth, roles, affiliations, and geographic distribution. Uncover valuable insights into participate involvement, preferences, and demographics, enabling targeted strategies for enhanced engagement and tailored experiences.'
      level={2}
      classname='pt-8'
    >
      <SectionTemplate
        title='Origins'
        level={3}
        classname='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-company'
            searchParams={{
              activity: 'participants',
            }}
            width={720}
            height={405}
          />
          <CompanyRankTable id={orgId} type='participants' />
        </div>
        <div className='flex gap-4 flex-wrap w-full h-fit overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-stars-map'
            searchParams={{
              activity: 'participants',
            }}
            width={720}
            height={405}
          />
          <GeoRankTable id={orgId} type='participants' />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
