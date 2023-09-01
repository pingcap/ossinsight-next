import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/app/analyze/org/[org]/Chart';

// import Content from '../mockContent';

const PAGE_ID = 'overview';

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
        title='Overview'
        level={2}
        description="Discover the popularity and reach of your repositories through stars, and understand the engagement and involvement of participants, enabling you to gauge the community's interest and identify potential collaboration opportunities."
        classname='pt-8'
      >
        <div className='flex gap-4 w-full flex-wrap'>
          <div className='flex flex-col gap-4 overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stars'
              searchParams={{
                repo_id: '41986369',
              }}
              className='h-[150px] w-[698px]'
            />
            <div className='flex gap-4'>
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  repo_id: '41986369',
                }}
                className='h-[222] w-[222]'
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  repo_id: '41986369',
                }}
                className='h-[222] w-[222px]'
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  repo_id: '41986369',
                }}
                className='h-[222px] w-[222px]'
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-contributors'
              searchParams={{
                repo_id: '41986369',
                limit: '5',
              }}
              className='h-[186px] w-[300px]'
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-contributors'
              searchParams={{
                repo_id: '41986369',
                limit: '5',
              }}
              className='h-[186px] w-[300px]'
            />
          </div>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-repositories'
            searchParams={{
              repo_id: '41986369',
              limit: '5',
            }}
            className='h-[388px] w-[300px]'
          />
        </div>

        {PAGE_ID}
        {/* <Content title={PAGE_ID} nextLink='star-growth' /> */}
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
