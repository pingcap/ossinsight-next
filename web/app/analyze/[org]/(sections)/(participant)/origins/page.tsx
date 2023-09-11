import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';
import {
  CompanyRankTable,
  GeoRankTable,
  TableSkeleton,
} from '@/components/Analyze/Table/RankTable';

const PAGE_ID = 'origins';

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
                owner_id: '11855343',
                activity: 'participants',
                period: 'past_28_days',
              }}
              width={720}
              height={405}
            />
            <CompanyRankTable id={data.orgId} type='participants' />
          </div>
          <div className='flex gap-4 flex-wrap w-full h-fit overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-stars-map'
              searchParams={{
                owner_id: '11855343',
                activity: 'participants',
                period: 'past_28_days',
              }}
              width={720}
              height={405}
            />
            <GeoRankTable id={data.orgId} type='participants' />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
