import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import CompanyRankTable from '@/components/Analyze/Table/RankTable';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';

const PAGE_ID = 'pull-request-efficiency';

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
        title='Productivity'
        description='Analyze the development productivity of your organization in handling Pull Requests, Code Reviews, and Code Submissions. Identify bottlenecks in the development process, measure the efficiency of code review and issue resolution, and optimize the workflow for increased productivity.'
        level={2}
        classname='pt-8'
      >
        <SectionTemplate
          title='Pull Request Efficiency'
          level={3}
          classname='pt-8 flex flex-col gap-4'
        >
          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-productivity-ratio'
              searchParams={{
                owner_id: '11855343',
                period: 'past_28_days',
              }}
            />
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-activity-efficiency'
              searchParams={{
                owner_id: '11855343',
                activity: 'pull-requests',
                period: 'past_28_days',
              }}
            />
          </div>
          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-activity-open-to-close'
              searchParams={{
                owner_id: '11855343',
                activity: 'pull-requests',
                period: 'past_28_days',
              }}
            />
            <ChartTemplate
              name='@ossinsight/widget-analyze-org-activity-open-to-first-response'
              searchParams={{
                owner_id: '11855343',
                activity: 'pull-requests',
                period: 'past_28_days',
              }}
            />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
