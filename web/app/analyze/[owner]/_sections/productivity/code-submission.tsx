'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { SplitTemplate } from '@/components/Analyze/Section/gridTemplates/SplitTemplate';
import { TimeZoneSelector } from '@ossinsight/ui/src/components/Selector/TimeZoneSelector';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';
import * as React from 'react';

export default function CodeSubmissionContent () {
  const zoneMemo = React.useMemo(() => {
    return -new Date().getTimezoneOffset() / 60;
  }, []);

  return (
    <SectionTemplate
      id="code-submission"
      title="Code Submission"
      level={3}
      className="pt-8 flex flex-col gap-4"
    >
      <ChartTemplate
        name="@ossinsight/widget-compose-org-commits-growth"
        className="w-full"
        searchParams={{
          activity: 'commits',
        }}
        height={getWidgetSize().widgetWidth(4)}
      />
      <SplitTemplate>
        <OrgCommitsTimeDistribution defaultZone={`${zoneMemo}`} />
        <ChartTemplate
          name="@ossinsight/widget-compose-org-code-changes-top-repositories"
          searchParams={{}}
          height={274}
        />
      </SplitTemplate>
    </SectionTemplate>
  );
}

function OrgCommitsTimeDistribution (props: { className?: string, defaultZone: string }) {
  const { defaultZone } = props;

  const [zone, setZone] = React.useState<string>(defaultZone);

  const handleChangeZone = React.useCallback((newValue?: string) => {
    newValue && setZone(newValue);
  }, []);

  return (
    <ChartTemplate
      key={zone}
      name="@ossinsight/widget-analyze-org-commits-time-distribution"
      className={props.className}
      searchParams={{
        zone,
      }}
      height={274}
    >
      <div className="absolute top-10 left-5">
        <TimeZoneSelector
          id="zone"
          onValueChange={handleChangeZone}
          value={zone}
        />
      </div>
    </ChartTemplate>
  );
}
