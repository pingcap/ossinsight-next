import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/app/analyze/org/[org]/Chart';

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
      <SectionTemplate title='Star Growth' level={2} classname='pt-8'>
        <div className='w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-star-growth'
            searchParams={{
              repo_id: '41986369',
            }}
            className='h-[408px] w-[1089px]'
          />
        </div>
        {PAGE_ID}
        {/* <Content title={PAGE_ID} nextLink='star-growth' /> */}
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
