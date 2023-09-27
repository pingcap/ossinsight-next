'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { MainSideGridTemplate } from '@/components/Analyze/Section/gridTemplates/MainSideGridTemplate';
import { SplitTemplate } from '@/components/Analyze/Section/gridTemplates/SplitTemplate';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function PRRequestEfficiencyContent() {
  return (
    <SectionTemplate
      id="pull-request-efficiency"
      title="Pull Request Efficiency"
      level={3}
      className="pt-8 flex flex-col gap-4"
    >
      <MainSideGridTemplate inverse>
        <ChartTemplate
          name="@ossinsight/widget-compose-org-productivity-ratio"
          searchParams={{
            activity: 'pull-requests/merged',
          }}
          height={getWidgetSize().widgetWidth(3)}
        />
        <ChartTemplate
          name="@ossinsight/widget-analyze-org-activity-efficiency"
          searchParams={{
            activity: 'pull-requests',
          }}
          height={getWidgetSize().widgetWidth(3)}
        />
      </MainSideGridTemplate>
      <SplitTemplate>
        <ChartTemplate
          name="@ossinsight/widget-compose-org-activity-open-to-close"
          searchParams={{
            activity: 'pull-requests',
          }}
          height={274}
        />
        <ChartTemplate
          name="@ossinsight/widget-compose-org-activity-open-to-first-response"
          searchParams={{
            activity: 'pull-requests',
          }}
          height={274}
        />
      </SplitTemplate>
    </SectionTemplate>
  );
}
