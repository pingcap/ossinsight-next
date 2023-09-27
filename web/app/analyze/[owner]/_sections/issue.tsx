'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function IssueContent() {
  return (
    <SectionTemplate
      id='issue'
      title='Issue'
      description={`Analyze your organization's issue management practices to gain insights into user feedback, suggestions, and discussions, indirectly revealing valuable product insights and user sentiments. Evaluate issue closure rates, response times, and active discussions to enhance organizational efficiency and collaboration while aligning with user needs for continuous improvement.`}
      level={2}
      className='pt-8 flex flex-col gap-4'
    >
      <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
        <ChartTemplate
          name='@ossinsight/widget-compose-org-productivity-ratio'
          searchParams={{
            activity: 'issues/closed',
          }}
          width={getWidgetSize().widgetWidth(3)}
          height={getWidgetSize().widgetWidth(3)}
        />
        <ChartTemplate
          name='@ossinsight/widget-analyze-org-activity-efficiency'
          searchParams={{
            activity: 'issues',
          }}
          width={getWidgetSize().widgetWidth(9)}
          height={getWidgetSize().widgetWidth(3)}
        />
      </div>
      <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
        <ChartTemplate
          name='@ossinsight/widget-compose-org-activity-open-to-close'
          searchParams={{
            activity: 'issues',
          }}
          width={getWidgetSize().widgetWidth(6)}
          height={274}
        />
        <ChartTemplate
          name='@ossinsight/widget-compose-org-activity-open-to-first-response'
          searchParams={{
            activity: 'issues',
          }}
          width={getWidgetSize().widgetWidth(6)}
          height={274}
        />
      </div>
      <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
        <ChartTemplate
          name='@ossinsight/widget-analyze-org-activity-action-top-repos'
          searchParams={{
            activity: 'issues/issue-comments',
          }}
          width={getWidgetSize().widgetWidth(6)}
          height={274}
        />
      </div>
    </SectionTemplate>
  );
}
