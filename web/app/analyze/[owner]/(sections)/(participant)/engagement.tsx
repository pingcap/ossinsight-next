'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function EngagementContent() {
  return (
    <SectionTemplate
      title='Participant'
      description='Examine participation dynamics within your organization, analyzing participant activity, engagement depth, roles, affiliations, and geographic distribution. Uncover valuable insights into participate involvement, preferences, and demographics, enabling targeted strategies for enhanced engagement and tailored experiences.'
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        id='engagement'
        title='Engagement'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-participants-growth'
            searchParams={{
              activity: 'active',
            }}
            width={getWidgetSize().widgetWidth(9)}
            height={getWidgetSize().widgetWidth(4)}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-active-ranking'
            searchParams={{
              activity: 'participants',
            }}
            width={getWidgetSize().widgetWidth(3)}
            height={getWidgetSize().widgetWidth(4)}
          />
        </div>
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-participants-growth'
            searchParams={{
              activity: 'new',
            }}
            width={getWidgetSize().widgetWidth(9)}
            height={getWidgetSize().widgetWidth(4)}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-new-ranking'
            searchParams={{
              activity: 'participants',
            }}
            width={getWidgetSize().widgetWidth(3)}
            height={getWidgetSize().widgetWidth(4)}
          />
        </div>
        <div className='w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-participants-roles-ratio'
            searchParams={{}}
            width={getWidgetSize().widgetWidth(12)}
            height={getWidgetSize().widgetWidth(3)}
          />
        </div>
        <div className='w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-engagement-scatter'
            searchParams={{}}
            width={getWidgetSize().widgetWidth(12)}
            height={getWidgetSize().widgetWidth(6)}
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
