'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { AnalyzeOrgContext } from '@/components/Context/Analyze/AnalyzeOrg';
import {
  CompanyRankTable,
  GeoRankTable,
} from '@/components/Analyze/Table/RankTable';

export default function StarGrowthContent() {
  const { orgName, orgId } = React.useContext(AnalyzeOrgContext);

  return (
    <SectionTemplate
      title='Popularity'
      description="Discover the popularity and reach of your repositories through stars, and understand the engagement and involvement of participants, enabling you to gauge the community's interest and identify potential collaboration opportunities."
      level={2}
      classname='pt-8'
    >
      <SectionTemplate
        title='Star Growth'
        level={3}
        classname='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-growth'
            searchParams={{
              activity: 'stars',
            }}
            width={988}
            height={389}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-stars-top-repos'
            searchParams={{}}
            width={300}
            height={389}
          />
        </div>

        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-company'
            searchParams={{
              activity: 'stars',
            }}
            width={726}
            height={405}
          />
          <CompanyRankTable id={orgId} type='stars' />
        </div>

        <div className='flex gap-4 flex-wrap w-full h-fit overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-stars-map'
            searchParams={{
              activity: 'stars',
            }}
            width={726}
            height={405}
          />
          <GeoRankTable id={orgId} />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
