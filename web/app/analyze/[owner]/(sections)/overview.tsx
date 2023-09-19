'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';

export default function OverviewContent() {
  return (
    <SectionTemplate title='Overview' level={2} className='pt-8'>
      <div className='flex gap-4 w-full flex-wrap'>
        <div className='flex flex-col gap-4 overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-overview-stars'
            width={698}
            height={150}
          />
          <div className='flex gap-4'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'pull-requests',
              }}
              width={222}
              height={222}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'reviews',
              }}
              width={222}
              height={222}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'issues',
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
              activity: 'active',
            }}
            width={300}
            height={186}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-contributors'
            searchParams={{
              activity: 'new',
            }}
            width={300}
            height={186}
          />
        </div>
        <ChartTemplate
          name='@ossinsight/widget-compose-org-activity-active-ranking'
          searchParams={{
            activity: 'repos',
          }}
          width={216}
          height={389}
        />
      </div>
    </SectionTemplate>
  );
}
