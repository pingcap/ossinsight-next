'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function PRRequestEfficiencyContent() {
  return (
    <SectionTemplate
      title='Productivity'
      description='Analyze the development productivity of your organization in handling Pull Requests, Code Reviews, and Code Submissions. Identify bottlenecks in the development process, measure the efficiency of code review and issue resolution, and optimize the workflow for increased productivity.'
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        title='Pull Request Efficiency'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-productivity-ratio'
            searchParams={{
              activity: 'pull-requests/merged',
            }}
            width={getWidgetSize().widgetWidth(3)}
            height={getWidgetSize().widgetWidth(3)}
          />
          <ChartTemplate
            name='@ossinsight/widget-analyze-org-activity-efficiency'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={getWidgetSize().widgetWidth(9)}
            height={getWidgetSize().widgetWidth(3)}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-open-to-close'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={getWidgetSize().widgetWidth(6)}
            height={274}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-open-to-first-response'
            searchParams={{
              activity: 'pull-requests',
            }}
            width={getWidgetSize().widgetWidth(6)}
            height={274}
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
