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
            width={648}
            height={389}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-stars-top-repos'
            searchParams={{}}
            width={219}
            height={389}
          />
        </div>

        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-company'
            searchParams={{
              activity: 'stars',
            }}
            width={648}
            height={405}
          />
          <CompanyRankTable
            id={orgId}
            type='stars'
            className='w-[219px] h-[405px] overflow-x-hidden overflow-y-auto'
          />
        </div>

        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-map'
            searchParams={{
              activity: 'stars',
            }}
            width={648}
            height={365}
          />
          <GeoRankTable
            id={orgId}
            className='w-[219px] h-[365px] overflow-x-hidden overflow-y-auto styled-scrollbar'
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
