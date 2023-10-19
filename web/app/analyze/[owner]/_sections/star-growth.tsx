'use client';
import { MainSideGridTemplate } from '@/components/Analyze/Section/gridTemplates/MainSideGridTemplate';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { AnalyzeOwnerContext } from '@/components/Context/Analyze/AnalyzeOwner';
import {
  CompanyRankTable,
  GeoRankTable,
} from '@/components/Analyze/Table/RankTable';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function StarGrowthContent() {
  const { id: orgId } = React.useContext(AnalyzeOwnerContext);

  return (
    <SectionTemplate
      title='Popularity'
      description="Discover the popularity and reach of your repositories through stars, enabling you to gauge the community's interest and identify potential collaboration opportunities."
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        title='Star Growth'
        id='star-growth'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <MainSideGridTemplate>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-growth-total'
            searchParams={{
              activity: 'stars',
            }}
            height={getWidgetSize().widgetWidth(4)}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-stars-top-repos'
            searchParams={{}}
            height={getWidgetSize().widgetWidth(4)}
          />
        </MainSideGridTemplate>

        <MainSideGridTemplate>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-company'
            searchParams={{
              activity: 'stars',
              role: 'stars'
            }}
            height={405}
          />
          <CompanyRankTable
            id={orgId}
            type='stars'
            role='stars'
            className={`h-[405px] overflow-x-hidden overflow-y-auto styled-scrollbar`}
          />
        </MainSideGridTemplate>

        <MainSideGridTemplate>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-map'
            searchParams={{
              activity: 'stars',
              role: 'stars'
            }}
            height={365}
          />
          <GeoRankTable
            id={orgId}
            type='stars'
            role='stars'
            className={`h-[365px] overflow-x-hidden overflow-y-auto styled-scrollbar`}
          />
        </MainSideGridTemplate>
      </SectionTemplate>
    </SectionTemplate>
  );
}
