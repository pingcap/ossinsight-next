import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import CompanyRankTable from '@/components/Analyze/Table/RankTable';

const PAGE_ID = 'star-growth';

const fetchOrgInfo = async (
  orgName: string
): Promise<AnalyzeOrgContextProps> => {
  // TODO - fetch org info
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    orgName: 'pingcap',
    orgId: 11855343,
  };
};

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
                repo_id: '41986369',
              }}
              className='h-[408px] w-[1089px]'
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-repositories'
              searchParams={{
                repo_id: '41986369',
                limit: '5',
                activity: 'star',
              }}
              className='h-[388px] w-[300px]'
            />
          </div>

          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-repo-company'
              searchParams={{
                repo_id: '41986369',
                activity: 'stars',
              }}
              className='h-[405px] w-[720px]'
            />
            <CompanyRankTable />
          </div>

          <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-analyze-repo-stars-map'
              searchParams={{
                repo_id: '41986369',
                activity: 'stars',
              }}
              className='h-[405px] w-[720px]'
            />
            <CompanyRankTable />
          </div>
        </SectionTemplate>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
