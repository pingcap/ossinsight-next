import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import CompanyRankTable from '@/components/Analyze/Table/RankTable';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';

const PAGE_ID = 'issue';

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
        title='Issue'
        description={`Analyze your organization's issue management practices to gain insights into user feedback, suggestions, and discussions, indirectly revealing valuable product insights and user sentiments. Evaluate issue closure rates, response times, and active discussions to enhance organizational efficiency and collaboration while aligning with user needs for continuous improvement.`}
        level={2}
        classname='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-productivity-ratio'
            searchParams={{
              owner_id: '11855343',
              activity: 'issues/closed',
              period: 'past_28_days',
            }}
            width={272}
            height={272}
          />
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-efficiency'
            searchParams={{
              owner_id: '11855343',
              activity: 'issues',
              period: 'past_28_days',
            }}
            width={700}
            height={272}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-open-to-close'
            searchParams={{
              owner_id: '11855343',
              activity: 'issues',
              period: 'past_28_days',
            }}
            width={486}
            height={274}
          />
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-open-to-first-response'
            searchParams={{
              owner_id: '11855343',
              activity: 'issues',
              period: 'past_28_days',
            }}
            width={486}
            height={274}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-action-top-repos'
            searchParams={{
              owner_id: '11855343',
              activity: 'issues/issue-comments',
              period: 'past_28_days',
            }}
            width={486}
            height={274}
          />
        </div>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
