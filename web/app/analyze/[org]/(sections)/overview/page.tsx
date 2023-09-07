import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { getOrgInfo } from '@/components/Analyze/utils';
import { notFound } from 'next/navigation';

// import Content from '../mockContent';

const PAGE_ID = 'overview';

const fetchOrgInfo = async (
  orgName: string
): Promise<AnalyzeOrgContextProps> => {
  try {
    const orgDatas = await getOrgInfo(orgName);
    const orgData = orgDatas[0];
    if (!orgData) {
      throw new Error('org not found');
    }
    return {
      orgName: orgData.login,
      orgId: orgData.id,
    };
  } catch (error) {
    notFound();
  }
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
      <SectionTemplate title='Overview' level={2} classname='pt-8'>
        <div className='flex gap-4 w-full flex-wrap'>
          <div className='flex flex-col gap-4 overflow-x-auto'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stars'
              searchParams={{
                owner_id: '11855343',
              }}
            />
            <div className='flex gap-4'>
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'pull-requests',
                }}
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'issues',
                }}
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'pull-requests',
                }}
              />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-contributors'
              searchParams={{
                owner_id: '11855343',
                activity: 'active',
                period: 'past_28_days',
              }}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-contributors'
              searchParams={{
                owner_id: '11855343',
                activity: 'new',
                period: 'past_28_days',
              }}
            />
          </div>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-repositories'
            searchParams={{
              owner_id: '11855343',
              activity: 'activities',
            }}
          />
        </div>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
