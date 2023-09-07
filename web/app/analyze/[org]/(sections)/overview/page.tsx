import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';

const PAGE_ID = 'overview';

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
              width={698}
              height={150}
            />
            <div className='flex gap-4'>
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'pull-requests',
                }}
                width={222}
                height={222}
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'issues',
                }}
                width={222}
                height={222}
              />
              <ChartTemplate
                name='@ossinsight/widget-compose-org-overview-stats'
                searchParams={{
                  owner_id: '11855343',
                  activity: 'pull-requests',
                }}
                width={222}
                height={222}
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
              width={300}
              height={186}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-active-contributors'
              searchParams={{
                owner_id: '11855343',
                activity: 'new',
                period: 'past_28_days',
              }}
              width={300}
              height={186}
            />
          </div>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-repositories'
            searchParams={{
              owner_id: '11855343',
              activity: 'repos',
              period: 'past_28_days',
            }}
            width={300}
            height={388}
          />
        </div>
      </SectionTemplate>
    </AnalyzeOrgContextProvider>
  );
}
