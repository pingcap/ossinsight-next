import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';

const PAGE_ID = 'engagement';

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
          title='Engagement'
          level={3}
          classname='pt-8 flex flex-col gap-4'
        >
          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-activity-growth'
              searchParams={{
                owner_id: '11855343',
                activity: 'participants',
                period: 'past_28_days',
              }}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-repositories'
              searchParams={{
                owner_id: '11855343',
                activity: 'participants',
                period: 'past_28_days',
              }}
            />
          </div>
          <div className='w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-participants-roles-ratio'
              searchParams={{
                owner_id: '11855343',
                period: 'past_28_days',
              }}
            />
          </div>
          <div className='w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-engagement-scatter'
              searchParams={{
                owner_id: '11855343',
                period: 'past_28_days',
              }}
            />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
