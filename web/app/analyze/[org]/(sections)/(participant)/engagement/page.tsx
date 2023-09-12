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
                activity: 'participants',
              }}
              width={988}
              height={389}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-activity-active-ranking'
              searchParams={{
                activity: 'participants',
              }}
              width={300}
              height={389}
            />
          </div>
          <div className='w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-participants-roles-ratio'
              searchParams={{}}
              width={1042}
              height={259}
            />
          </div>
          <div className='w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-engagement-scatter'
              searchParams={{}}
              width={1042}
              height={259}
            />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
