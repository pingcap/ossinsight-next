import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import {
  CompanyRankTable,
  GeoRankTable,
  TableSkeleton,
} from '@/components/Analyze/Table/RankTable';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';

const PAGE_ID = 'star-growth';

export default async function OrgAnalyzePage({
  params,
}: {
  params: { org: string };
}) {
  const data = await fetchOrgInfo(params.org);

  return (
    <AnalyzeOrgContextProvider data={data}>
      <OrgAnalyzePageHeader />
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
                owner_id: '11855343',
                activity: 'stars',
                period: 'past_28_days',
              }}
              width={988}
              height={389}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-stars-top-repos'
              searchParams={{
                owner_id: '11855343',
                period: 'past_28_days',
              }}
              width={300}
              height={389}
            />
          </div>

          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-company'
              searchParams={{
                owner_id: '11855343',
                activity: 'stars',
                period: 'past_28_days',
              }}
              width={726}
              height={405}
            />
            <CompanyRankTable id={data.orgId} type='stars' />
          </div>

          <div className='flex gap-4 flex-wrap w-full h-fit overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-stars-map'
              searchParams={{
                owner_id: '11855343',
                activity: 'stars',
                period: 'past_28_days',
              }}
              width={726}
              height={405}
            />
            <GeoRankTable id={data.orgId} />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
