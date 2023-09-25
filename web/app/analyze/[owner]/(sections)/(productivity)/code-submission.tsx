'use client';
import * as React from 'react';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { TimeZoneSelector } from '@ossinsight/ui/src/components/Selector/TimeZoneSelector';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function CodeSubmissionContent() {
  const zoneMemo = React.useMemo(() => {
    return -new Date().getTimezoneOffset() / 60;
  }, []);

  return (
    <SectionTemplate
      title='Productivity'
      description='Analyze the development productivity of your organization in handling Pull Requests, Code Reviews, and Code Submissions. Identify bottlenecks in the development process, measure the efficiency of code review and issue resolution, and optimize the workflow for increased productivity.'
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        title='Code Submission'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-commits-growth'
            searchParams={{
              activity: 'commits',
            }}
            width={getWidgetSize().widgetWidth(12, 1)}
            height={getWidgetSize().widgetWidth(4, 1)}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <OrgCommitsTimeDistribution defaultZone={`${zoneMemo}`} />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-code-changes-top-repositories'
            searchParams={{}}
            width={getWidgetSize().widgetWidth(6)}
            height={274}
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}

function OrgCommitsTimeDistribution(props: { defaultZone: string }) {
  const { defaultZone } = props;

  const [zone, setZone] = React.useState<string>(defaultZone);

  const handleChangeZone = React.useCallback((newValue?: string) => {
    newValue && setZone(newValue);
  }, []);

  return (
    <>
      <ChartTemplate
        key={zone}
        name='@ossinsight/widget-analyze-org-commits-time-distribution'
        searchParams={{
          zone,
        }}
        width={getWidgetSize().widgetWidth(6)}
        height={274}
      >
        <div className='absolute top-10 left-5'>
          <TimeZoneSelector
            id='zone'
            onValueChange={handleChangeZone}
            value={zone}
          />
        </div>
      </ChartTemplate>
    </>
  );
}
