'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';

export default function PRRequestEfficiencyContent() {
  return (
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
              activity: 'pull-requests/merged',
            }}
            width={216}
            height={216}
          />
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-efficiency'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={648}
            height={216}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-open-to-close'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={432}
            height={274}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-open-to-first-response'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={432}
            height={274}
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
